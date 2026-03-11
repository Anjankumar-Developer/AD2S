"""
sqlalchemy ORM models for the SENTRY database.
"""

from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func

from backend.database import Base


class Prediction(Base):
    """Stores each prediction result for persistent history."""

    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    prediction = Column(String(50), nullable=False)  # "Fake Profile" / "Genuine Profile"
    confidence = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    input_summary = Column(String(255), nullable=False, default="")
    input_data = Column(Text, nullable=True)  # Full input JSON for auditing
