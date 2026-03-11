"""
Predictor module — loads the trained model and transforms inputs for prediction.
"""

import os
import joblib
import numpy as np
import logging
from backend.config import settings

logger = logging.getLogger(__name__)

# Global model artifact (loaded once)
_artifact = None


def load_model():
    """Load the trained model artifact from disk."""
    global _artifact
    model_path = settings.MODEL_PATH

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model file not found at '{model_path}'. "
            "Run `python -m ml.train_model` first."
        )

    _artifact = joblib.load(model_path)
    model_name = _artifact.get("model_name", "Unknown")
    logger.info(f"Model loaded: {model_name} from {model_path}")
    return _artifact


def get_model():
    """Get the loaded model artifact, loading it if necessary."""
    global _artifact
    if _artifact is None:
        load_model()
    return _artifact


def predict(input_data: dict) -> dict:
    """
    Run prediction on input profile data.
    Transforms the input to match the training feature pipeline.
    """
    artifact = get_model()
    model = artifact["model"]
    scaler = artifact["scaler"]
    imputer = artifact["imputer"]
    feature_names = artifact["feature_names"]

    # Build feature vector matching training pipeline
    lang_code = 0  # Default encoding for unknown language
    followers = input_data.get("followers_count", 0)
    friends = input_data.get("friends_count", 0)
    statuses = input_data.get("statuses_count", 0)
    favourites = input_data.get("favourites_count", 0)
    listed = input_data.get("listed_count", 0)
    name = input_data.get("name", "")
    screen_name = input_data.get("screen_name", "")

    features = {
        "statuses_count": statuses,
        "followers_count": followers,
        "friends_count": friends,
        "favourites_count": favourites,
        "listed_count": listed,
        "lang_code": lang_code,
        "followers_to_friends": followers / (friends + 1),
        "statuses_to_followers": statuses / (followers + 1),
        "favourites_to_statuses": favourites / (statuses + 1),
        "listed_to_followers": listed / (followers + 1),
        "name_length": len(name),
        "screen_name_length": len(screen_name),
        "has_description": int(input_data.get("has_description", True)),
        "has_url": int(input_data.get("has_url", False)),
        "has_location": int(input_data.get("has_location", True)),
    }

    # Build array in same order as training features
    X = np.array([[features.get(f, 0) for f in feature_names]])

    # Apply same transformations as training
    X = imputer.transform(X)
    X = scaler.transform(X)

    # Predict
    prediction = model.predict(X)[0]
    label = "Genuine Profile" if prediction == 1 else "Fake Profile"

    # Confidence score
    confidence = 0.5
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(X)[0]
        confidence = float(max(proba))
    elif hasattr(model, "decision_function"):
        decision = model.decision_function(X)[0]
        # Sigmoid approximation for confidence
        confidence = float(1 / (1 + np.exp(-abs(decision))))

    risk_score = round((1 - confidence if prediction == 1 else confidence) * 100, 2)

    return {
        "prediction": label,
        "confidence": round(confidence, 4),
        "risk_score": risk_score,
        "model_name": artifact.get("model_name", "Unknown"),
    }
