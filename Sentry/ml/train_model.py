"""
Model training module for SENTRY.
Trains Random Forest, SVM, and Neural Network (MLP).
Auto-selects the best model based on accuracy and saves it.
"""

import os
import json
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import cross_val_score
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
METRICS_PATH = os.environ.get("METRICS_PATH", "models/model_metrics.json")
RANDOM_STATE = int(os.environ.get("RANDOM_STATE", "42"))


def get_models() -> dict:
    """
    Returns dictionary of models to train.
    Configurations reused from original scripts.
    """
    return {
        "Random Forest": RandomForestClassifier(
            n_estimators=100,
            oob_score=True,
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),
        "SVM": SVC(
            kernel="rbf",
            probability=True,
            random_state=RANDOM_STATE,
        ),
        "Neural Network": MLPClassifier(
            hidden_layer_sizes=(100, 50),
            activation="relu",
            solver="adam",
            max_iter=500,
            random_state=RANDOM_STATE,
        ),
    }


def train_and_select_best(data: dict) -> tuple:
    """
    Train all models, cross-validate, and select the best one.
    Returns (best_model_name, best_model, all_results).
    """
    models = get_models()
    results = {}
    best_score = 0
    best_name = None
    best_model = None

    X_train = data["X_train"]
    y_train = data["y_train"]
    X_test = data["X_test"]
    y_test = data["y_test"]

    for name, model in models.items():
        print(f"\n{'='*50}")
        print(f"Training: {name}")
        print(f"{'='*50}")

        # Cross-validation
        cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring="accuracy")
        print(f"  CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

        # Train on full training set
        model.fit(X_train, y_train)

        # Evaluate on test set
        y_pred = model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average="weighted")
        rec = recall_score(y_test, y_pred, average="weighted")
        f1 = f1_score(y_test, y_pred, average="weighted")
        cm = confusion_matrix(y_test, y_pred)

        print(f"  Test Accuracy:  {acc:.4f}")
        print(f"  Precision:      {prec:.4f}")
        print(f"  Recall:         {rec:.4f}")
        print(f"  F1 Score:       {f1:.4f}")
        print(f"  Confusion Matrix:\n{cm}")
        print(f"\n{classification_report(y_test, y_pred, target_names=['Fake', 'Genuine'])}")

        results[name] = {
            "accuracy": float(acc),
            "precision": float(prec),
            "recall": float(rec),
            "f1_score": float(f1),
            "cv_accuracy_mean": float(cv_scores.mean()),
            "cv_accuracy_std": float(cv_scores.std()),
            "confusion_matrix": cm.tolist(),
        }

        if acc > best_score:
            best_score = acc
            best_name = name
            best_model = model

    return best_name, best_model, results


def save_model(model, model_path: str | None = None) -> None:
    """Save the trained model to disk."""
    model_path = model_path or MODEL_PATH
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    print(f"\nModel saved to: {model_path}")


def save_metrics(
    best_name: str,
    results: dict,
    feature_names: list,
    metrics_path: str | None = None,
) -> None:
    """Save model evaluation metrics to JSON."""
    metrics_path = metrics_path or METRICS_PATH
    os.makedirs(os.path.dirname(metrics_path), exist_ok=True)

    metrics = {
        "best_model": best_name,
        "feature_names": feature_names,
        "models": results,
    }

    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"Metrics saved to: {metrics_path}")


def main():
    """Full training pipeline."""
    print("=" * 60)
    print("  SENTRY — MODEL TRAINING PIPELINE")
    print("=" * 60)

    # Step 1: Preprocess data
    print("\n[1/4] Preprocessing data...")
    data = preprocess_data()
    print(f"  Training samples: {len(data['X_train'])}")
    print(f"  Test samples:     {len(data['X_test'])}")
    print(f"  Features:         {len(data['feature_names'])}")

    # Step 2: Train models and select best
    print("\n[2/4] Training models...")
    best_name, best_model, results = train_and_select_best(data)

    print(f"\n{'='*60}")
    print(f"  BEST MODEL: {best_name}")
    print(f"  Accuracy:   {results[best_name]['accuracy']:.4f}")
    print(f"{'='*60}")

    # Step 3: Save best model
    print("\n[3/4] Saving best model...")
    # Save model along with scaler and imputer for prediction
    save_artifact = {
        "model": best_model,
        "scaler": data["scaler"],
        "imputer": data["imputer"],
        "feature_names": data["feature_names"],
        "model_name": best_name,
    }
    save_model(save_artifact)

    # Step 4: Save metrics
    print("\n[4/4] Saving metrics...")
    save_metrics(best_name, results, data["feature_names"])

    print("\n✓ Training pipeline complete!")


if __name__ == "__main__":
    main()
