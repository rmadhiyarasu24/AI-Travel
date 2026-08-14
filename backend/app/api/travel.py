from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.travel_orchestrator import TravelOrchestrator

router = APIRouter(prefix="/api/travel", tags=["AI Travel Orchestration Engine"])

class TravelPlanRequest(BaseModel):
    destination: str
    duration_days: Optional[int] = 3
    traveler_type: Optional[str] = "nature-loving"
    user_prompt: Optional[str] = None

@router.post("/plan")
def plan_travel_trip(
    request: TravelPlanRequest,
    db: Session = Depends(get_db)
):
    """
    Complete Travel Planning endpoint:
    Geocodes via Nominatim -> Queries POIs via Overpass -> Fetches Open-Meteo Weather -> Computes OSRM Routes -> Synthesizes Qwen3:8b Itinerary.
    """
    return TravelOrchestrator.plan_trip(
        db=db,
        destination=request.destination,
        duration_days=request.duration_days or 3,
        traveler_type=request.traveler_type or "nature-loving",
        user_prompt=request.user_prompt or ""
    )
