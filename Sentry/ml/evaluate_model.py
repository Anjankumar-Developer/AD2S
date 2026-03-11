"""
Model evaluation module for SENTRY.
Loads a saved model and evaluates it on the test set.
"""

import os
import json
import joblib
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
)
from dotenv import load_dotenv

from ml.preprocessing import preprocess_data

load_dotenv()

MODEL_PATH = os.environ.get("MODEL_PATH", "models/fake_profile_model.pkl")


def evaluate(model_path: str | None = None):
    """Load saved model and evaluate on the test set."""
    model_path = model_path or MODEL_PATH

    print("Loading model...")
    artifact = joblib.load(model_path)
    model = artifact["model"]
    model_name = artifact["model_name"]

    print(f"Model: {model_name}")
    print("Preprocessing test data...")
    data = preprocess_data()

    X_test = data["X_test"]
    y_test = data["y_test"]

    print("Running predictions...")
    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average="weighted")
    rec = recall_score(y_test, y_pred, average="weighted")
    f1 = f1_score(y_test, y_pred, average="weighted")
    cm = confusion_matrix(y_test, y_pred)

    print(f"\n{'='*50}")
    print(f"  MODEL EVALUATION — {model_name}")
    print(f"{'='*50}")
    print(f"  Accuracy:   {acc:.4f}")
    print(f"  Precision:  {prec:.4f}")
    print(f"  Recall:     {rec:.4f}")
    print(f"  F1 Score:   {f1:.4f}")
    print(f"\nConfusion Matrix:")
    print(cm)
    print(f"\n{classification_report(y_test, y_pred, target_names=['Fake', 'Genuine'])}")


if __name__ == "__main__":
    evaluate()
