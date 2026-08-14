from typing import Optional
from fastapi import APIRouter, Query
from app.services.overpass_service import OverpassService

router = APIRouter(prefix="/api/places", tags=["OpenStreetMap Overpass POIs"])

@router.get("")
def search_places(
    lat: float = Query(..., description="Center Latitude"),
    lng: float = Query(..., description="Center Longitude"),
    radius: int = Query(8000, description="Search radius in meters"),
    category: Optional[str] = Query(None, description="Category filter e.g. attraction, nature, food")
):
    """
    Search tourist POIs via OpenStreetMap Overpass API.
    """
    return OverpassService.search_places(
        latitude=lat, 
        longitude=lng, 
        radius_meters=radius, 
        category=category
    )
