"""
Configuration module for the backend API.
All settings loaded from environment variables.
"""

import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    MODEL_PATH: str = "models/fake_profile_model.pkl"
    METRICS_PATH: str = "models/model_metrics.json"
    API_PORT: int = 8000
    DATA_DIR: str = "data"
    CORS_ORIGINS: str = "http://localhost:5173"
    DATABASE_URL: str = "sqlite:///predictions.db"
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
