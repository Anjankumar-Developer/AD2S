"""
Prediction history service — persistent storage via SQLAlchemy.
Replaces the previous in-memory implementation.
"""

import json
from datetime import datetime, timezone

from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func

from backend.models import Prediction


def add_prediction(
    db: Session,
    prediction: str,
    confidence: float,
    risk_score: float,
    input_data: dict,
) -> dict:
    """Insert a prediction record into the database and return it as a dict."""
    input_summary = (
        f"{input_data.get('name', 'Unknown')} (@{input_data.get('screen_name', 'unknown')})"
    )

    record = Prediction(
        prediction=prediction,
        confidence=confidence,
        risk_score=risk_score,
        timestamp=datetime.now(timezone.utc),
        input_summary=input_summary,
        input_data=json.dumps(input_data),
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return _to_dict(record)


def get_all_predictions(db: Session) -> list[dict]:
    """Return all predictions, newest first."""
    rows = db.query(Prediction).order_by(Prediction.id.desc()).all()
    return [_to_dict(r) for r in rows]


def get_prediction_stats(db: Session) -> dict:
    """Return aggregate statistics from the predictions table."""
    total = db.query(sql_func.count(Prediction.id)).scalar() or 0
    fake_count = (
        db.query(sql_func.count(Prediction.id))
        .filter(Prediction.prediction == "Fake Profile")
        .scalar()
        or 0
    )
    genuine_count = total - fake_count

    return {
        "total_predictions": total,
        "fake_count": fake_count,
        "genuine_count": genuine_count,
        "fake_percentage": round(fake_count / total * 100, 1) if total > 0 else 0,
        "genuine_percentage": round(genuine_count / total * 100, 1) if total > 0 else 0,
    }


def _to_dict(record: Prediction) -> dict:
    """Convert a Prediction ORM object to a plain dict."""
    return {
        "id": record.id,
        "prediction": record.prediction,
        "confidence": record.confidence,
        "risk_score": record.risk_score,
        "timestamp": record.timestamp.isoformat() if record.timestamp else "",
        "input_summary": record.input_summary,
    }
