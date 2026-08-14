from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services.weather_service import WeatherService

router = APIRouter(prefix="/api/weather", tags=["Open-Meteo Weather Service"])

@router.get("")
def get_weather(
    destination: Optional[str] = Query(None, description="Indian destination name e.g. Ooty, Munnar, Goa, Manali"),
    lat: Optional[float] = Query(None, description="Latitude"),
    lng: Optional[float] = Query(None, description="Longitude"),
    date: Optional[str] = Query(None, description="Forecast date in YYYY-MM-DD format"),
    db: Session = Depends(get_db)
):
    """
    Get live Open-Meteo weather forecast for any Indian destination or latitude/longitude coordinates.
    """
    if lat is not None and lng is not None:
        return WeatherService.get_weather_by_coords(
            latitude=lat,
            longitude=lng,
            forecast_date=date,
            location_name=destination or f"({lat}, {lng})"
        )

    target_dest = destination or "Ooty"
    return WeatherService.get_weather_by_destination(
        db=db,
        destination_name=target_dest,
        forecast_date=date
    )

@router.get("/ooty")
def get_ooty_weather(db: Session = Depends(get_db)):
    """
    Direct test route for Ooty, Tamil Nadu weather forecast.
    """
    return WeatherService.get_weather_by_destination(db, "Ooty")

@router.get("/munnar")
def get_munnar_weather(db: Session = Depends(get_db)):
    """
    Direct test route for Munnar, Kerala weather forecast.
    """
    return WeatherService.get_weather_by_destination(db, "Munnar")

@router.get("/goa")
def get_goa_weather(db: Session = Depends(get_db)):
    """
    Direct test route for Goa weather forecast.
    """
    return WeatherService.get_weather_by_destination(db, "Goa")

@router.get("/manali")
def get_manali_weather(db: Session = Depends(get_db)):
    """
    Direct test route for Manali, Himachal Pradesh weather forecast.
    """
    return WeatherService.get_weather_by_destination(db, "Manali")
