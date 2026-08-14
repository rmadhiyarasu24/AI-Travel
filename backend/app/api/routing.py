from typing import List, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter
from app.services.osrm_service import OSRMService

router = APIRouter(prefix="/api/routing", tags=["OSRM Driving Routing"])

class WaypointModel(BaseModel):
    latitude: float
    longitude: float

class RouteRequestModel(BaseModel):
    waypoints: List[WaypointModel]

@router.post("/route")
def calculate_route(body: RouteRequestModel):
    """
    Calculate driving distance, estimated travel time, and polyline coordinates via OSRM.
    """
    wps = [{"latitude": wp.latitude, "longitude": wp.longitude} for wp in body.waypoints]
    return OSRMService.calculate_route(wps)
