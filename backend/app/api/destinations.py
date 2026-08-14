from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.domain import Destination, Place
from app.schemas.dto import DestinationResponse
from app.services.recommendation_service import RecommendationEngine

router = APIRouter(prefix="/api/destinations", tags=["Destinations"])

@router.get("", response_model=List[DestinationResponse])
def get_destinations(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Destination)
    if category:
        query = query.filter(Destination.category.ilike(f"%{category}%"))
    return query.all()

@router.get("/recommendations")
def get_recommendations(db: Session = Depends(get_db)):
    destinations = db.query(Destination).all()
    results = []
    for d in destinations:
        dest_dict = {
            "id": str(d.id),
            "name": d.name,
            "location": d.location,
            "description": d.description,
            "category": d.category,
            "rating": float(d.rating),
            "image_url": d.image_url,
            "average_daily_cost": float(d.average_daily_cost),
            "coordinates": d.coordinates
        }
        score = RecommendationEngine.calculate_destination_score(
            dest_dict,
            user_interests=["nature", "cultural", "food"],
            user_budget=20000.0
        )
        dest_dict["recommendation_score"] = score
        results.append(dest_dict)
    
    results.sort(key=lambda x: x["recommendation_score"], reverse=True)
    return results

@router.get("/{destination_id}", response_model=DestinationResponse)
def get_destination_detail(destination_id: str, db: Session = Depends(get_db)):
    dest = db.query(Destination).filter(Destination.id == destination_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    return dest

@router.get("/{destination_id}/places")
def get_destination_places(destination_id: str, db: Session = Depends(get_db)):
    places = db.query(Place).filter(Place.destination_id == destination_id).all()
    return places
