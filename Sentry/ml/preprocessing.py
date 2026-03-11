"""
Preprocessing module for SENTRY.
Handles data loading, merging, feature engineering, and train/test splitting.
Reuses logic from the original Random Forest.py / SVM.py scripts.
"""

import os
import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from dotenv import load_dotenv

load_dotenv()

DATA_DIR = os.environ.get("DATA_DIR", "data")
TEST_SIZE = float(os.environ.get("TEST_SIZE", "0.20"))
RANDOM_STATE = int(os.environ.get("RANDOM_STATE", "42"))


def read_datasets(data_dir: str | None = None) -> tuple[pd.DataFrame, np.ndarray]:
    """
    Reads genuine and fake user profiles from CSV files and merges them.
    Labels: 0 = fake, 1 = genuine (matches original script convention).
    """
    data_dir = data_dir or DATA_DIR
    genuine_path = os.path.join(data_dir, "users.csv")
    fake_path = os.path.join(data_dir, "fusers.csv")

    genuine_users = pd.read_csv(genuine_path)
    fake_users = pd.read_csv(fake_path)

    # Merge datasets — fake first, then genuine (matches original code)
    x = pd.concat([fake_users, genuine_users], ignore_index=True)
    y = np.array([0] * len(fake_users) + [1] * len(genuine_users))

    return x, y


def extract_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Feature engineering reused from the original ML scripts.
    Extracts numerical features relevant for SENTRY.
    """
    features = df.copy()

    # Language encoding — map each unique language to an integer code
    lang_values = features["lang"].fillna("unknown")
    lang_list = list(enumerate(np.unique(lang_values)))
    lang_dict = {name: i for i, name in lang_list}
    features["lang_code"] = lang_values.map(lang_dict).astype(int)

    # Derived features (replacing unreliable sexmachine dependency)
    features["followers_to_friends"] = (
        features["followers_count"] / (features["friends_count"] + 1)
    )
    features["statuses_to_followers"] = (
        features["statuses_count"] / (features["followers_count"] + 1)
    )
    features["favourites_to_statuses"] = (
        features["favourites_count"] / (features["statuses_count"] + 1)
    )
    features["listed_to_followers"] = (
        features["listed_count"] / (features["followers_count"] + 1)
    )
    features["name_length"] = features["name"].fillna("").str.len()
    features["screen_name_length"] = features["screen_name"].fillna("").str.len()
    features["has_description"] = features["description"].notna().astype(int)
    features["has_url"] = features["url"].notna().astype(int)
    features["has_location"] = features["location"].notna().astype(int)

    # Core feature columns from original scripts + new derived features
    feature_columns = [
        "statuses_count",
        "followers_count",
        "friends_count",
        "favourites_count",
        "listed_count",
        "lang_code",
        "followers_to_friends",
        "statuses_to_followers",
        "favourites_to_statuses",
        "listed_to_followers",
        "name_length",
        "screen_name_length",
        "has_description",
        "has_url",
        "has_location",
    ]

    return features[feature_columns]


def preprocess_data(
    data_dir: str | None = None,
) -> dict:
    """
    Full preprocessing pipeline: load → merge → engineer features → split → scale.
    Returns a dictionary with X_train, X_test, y_train, y_test, scaler, feature_names.
    """
    raw_df, labels = read_datasets(data_dir)
    features_df = extract_features(raw_df)

    # Impute missing values
    imputer = SimpleImputer(strategy="median")
    X = imputer.fit_transform(features_df)

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train / test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, labels, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=labels
    )

    return {
        "X_train": X_train,
        "X_test": X_test,
        "y_train": y_train,
        "y_test": y_test,
        "scaler": scaler,
        "imputer": imputer,
        "feature_names": list(features_df.columns),
    }


if __name__ == "__main__":
    result = preprocess_data()
    print(f"Training samples: {len(result['X_train'])}")
    print(f"Test samples:     {len(result['X_test'])}")
    print(f"Features:         {result['feature_names']}")
