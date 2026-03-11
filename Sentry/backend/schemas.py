"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProfileInput(BaseModel):
    """Input schema for profile prediction."""

    statuses_count: int = Field(..., ge=0, description="Number of statuses/tweets")
    followers_count: int = Field(..., ge=0, description="Number of followers")
    friends_count: int = Field(..., ge=0, description="Number of friends/following")
    favourites_count: int = Field(..., ge=0, description="Number of favourites/likes")
    listed_count: int = Field(..., ge=0, description="Number of lists the user is on")
    lang: str = Field(default="en", description="Profile language code")
    name: str = Field(default="", description="Display name")
    screen_name: str = Field(default="", description="Screen name / handle")
    has_description: bool = Field(default=True, description="Whether profile has a bio")
    has_url: bool = Field(default=False, description="Whether profile has a URL")
    has_location: bool = Field(default=True, description="Whether profile has location set")

    class Config:
        json_schema_extra = {
            "example": {
                "statuses_count": 500,
                "followers_count": 200,
                "friends_count": 150,
                "favourites_count": 300,
                "listed_count": 5,
                "lang": "en",
                "name": "John Doe",
                "screen_name": "johndoe",
                "has_description": True,
                "has_url": False,
                "has_location": True,
            }
        }


class PredictionResponse(BaseModel):
    """Response schema for prediction results."""

    prediction: str = Field(..., description="'Fake Profile' or 'Genuine Profile'")
    confidence: float = Field(..., ge=0, le=1, description="Prediction confidence score")
    risk_score: float = Field(..., ge=0, le=100, description="Risk score 0-100")
    timestamp: str = Field(..., description="ISO timestamp of prediction")
    input_data: ProfileInput
    model_name: str = Field(..., description="Name of the model used")


class PredictionHistoryItem(BaseModel):
    """Schema for prediction history entries."""

    id: int
    prediction: str
    confidence: float
    risk_score: float
    timestamp: str
    input_summary: str


class ModelMetricsResponse(BaseModel):
    """Response schema for model metrics."""

    best_model: str
    feature_names: list[str]
    models: dict


class InstagramPredictRequest(BaseModel):
    """Request schema for Instagram-based prediction."""

    username: str = Field(..., min_length=1, description="Instagram username or profile URL")


class HealthResponse(BaseModel):
    """Response schema for health check."""

    status: str
    model_loaded: bool
    model_name: str
    timestamp: str
