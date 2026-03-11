"""
FastAPI application for Fake Profile Detection API.
Endpoints: /health, /predict, /predict-from-instagram, /predictions, /prediction-stats, /model-metrics
Serves the React frontend in production when built to backend/static/.
"""

import os
import json
import logging
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from backend.config import settings
from backend.database import init_db, get_db
from backend.schemas import (
    ProfileInput,
    PredictionResponse,
    PredictionHistoryItem,
    ModelMetricsResponse,
    HealthResponse,
    InstagramPredictRequest,
)
from backend.predictor import load_model, predict, get_model
from backend.services.history import add_prediction, get_all_predictions, get_prediction_stats
from backend.services.instagram_fetcher import fetch_profile_from_instagram

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Path to built frontend assets
STATIC_DIR = Path(__file__).parent / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database and load model on startup."""
    logger.info("Starting SENTRY API...")

    # Initialize database tables
    init_db()
    logger.info("Database initialized.")

    # Load ML model
    try:
        load_model()
        logger.info("Model loaded successfully.")
    except FileNotFoundError as e:
        logger.warning(f"Model not found: {e}")
    yield
    logger.info("Shutting down API.")


app = FastAPI(
    title="SENTRY API",
    description="AI-powered detection of fake social media profiles",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    try:
        artifact = get_model()
        model_loaded = True
        model_name = artifact.get("model_name", "Unknown")
    except Exception:
        model_loaded = False
        model_name = "Not loaded"

    return HealthResponse(
        status="ok" if model_loaded else "degraded",
        model_loaded=model_loaded,
        model_name=model_name,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@app.post("/predict-from-instagram", response_model=PredictionResponse)
async def predict_from_instagram(
    request: InstagramPredictRequest,
    db: Session = Depends(get_db),
):
    """
    Fetch profile from Instagram automatically and predict fake/genuine.
    Only requires Instagram username or profile URL — no manual data entry.
    """
    try:
        profile = fetch_profile_from_instagram(request.username)
        return await make_prediction(profile, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        logger.error(f"Instagram fetch error: {e}")
        raise HTTPException(status_code=502, detail=str(e))


@app.post("/predict", response_model=PredictionResponse)
async def make_prediction(profile: ProfileInput, db: Session = Depends(get_db)):
    """Predict whether a profile is fake or genuine."""
    try:
        input_dict = profile.model_dump()
        result = predict(input_dict)

        # Save to database
        add_prediction(
            db=db,
            prediction=result["prediction"],
            confidence=result["confidence"],
            risk_score=result["risk_score"],
            input_data=input_dict,
        )

        return PredictionResponse(
            prediction=result["prediction"],
            confidence=result["confidence"],
            risk_score=result["risk_score"],
            timestamp=datetime.now(timezone.utc).isoformat(),
            input_data=profile,
            model_name=result["model_name"],
        )
    except FileNotFoundError as e:
        logger.error(f"Model not found: {e}")
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.get("/predictions", response_model=list[PredictionHistoryItem])
async def get_predictions(db: Session = Depends(get_db)):
    """Get prediction history from database."""
    return get_all_predictions(db)


@app.get("/prediction-stats")
async def get_prediction_stats_endpoint(db: Session = Depends(get_db)):
    """Get prediction statistics from database."""
    return get_prediction_stats(db)


@app.get("/model-metrics", response_model=ModelMetricsResponse)
async def get_model_metrics():
    """Get model evaluation metrics."""
    metrics_path = settings.METRICS_PATH
    if not os.path.exists(metrics_path):
        raise HTTPException(
            status_code=404,
            detail=f"Metrics file not found. Run model training first.",
        )

    with open(metrics_path, "r") as f:
        metrics = json.load(f)

    return ModelMetricsResponse(**metrics)


# ---------------------------------------------------------------------------
# Serve the React frontend in production (when built to backend/static/)
# ---------------------------------------------------------------------------
if STATIC_DIR.is_dir():
    # Serve static assets (JS, CSS, images)
    app.mount("/assets", StaticFiles(directory=str(STATIC_DIR / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Catch-all: serve index.html for SPA client-side routing."""
        file_path = STATIC_DIR / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(STATIC_DIR / "index.html"))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=settings.API_PORT,
        reload=True,
    )
