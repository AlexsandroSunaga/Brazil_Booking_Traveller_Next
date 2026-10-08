from fastapi import APIRouter
from pydantic import BaseModel, Field

from src.services.pricing import estimate_duration_minutes, haversine_km

router = APIRouter(tags=["routing"])


class RouteRequest(BaseModel):
    pickupLat: float = Field(ge=-90, le=90)
    pickupLng: float = Field(ge=-180, le=180)
    dropoffLat: float = Field(ge=-90, le=90)
    dropoffLng: float = Field(ge=-180, le=180)


@router.post("/route")
def route(body: RouteRequest) -> dict:
    """Key-free distance/duration estimate (great-circle distance, average-speed model)."""
    km = haversine_km(body.pickupLat, body.pickupLng, body.dropoffLat, body.dropoffLng)
    return {
        "distanceKm": round(km, 1),
        "durationMinutes": estimate_duration_minutes(km),
        "provider": "haversine",
    }
