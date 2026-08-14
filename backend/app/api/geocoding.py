from typing import Optional
from fastapi import APIRouter, Query
from app.services.nominatim_service import NominatimService

router = APIRouter(prefix="/api/geocoding", tags=["Nominatim Geocoding"])

@router.get("/search")
def forward_geocode(q: str = Query(..., description="Location search query e.g. Ooty, Munnar")):
    """
    Forward geocoding via Nominatim: Location name -> Lat, Lng, Display Name.
    """
    return NominatimService.geocode(q)

@router.get("/reverse")
def reverse_geocode(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude")
):
    """
    Reverse geocoding via Nominatim: Lat, Lng -> City, State, Country.
    """
    return NominatimService.reverse_geocode(lat, lng)
