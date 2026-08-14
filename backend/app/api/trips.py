from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.domain import Trip, User
from app.schemas.dto import TripCreate, TripResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/trips", tags=["Trips"])

@router.get("", response_model=List[TripResponse])
def get_user_trips(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Trip).filter(Trip.user_id == current_user.id).all()

@router.post("", response_model=TripResponse)
def create_trip(trip_data: TripCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_trip = Trip(
        user_id=current_user.id,
        title=trip_data.title,
        destination_name=trip_data.destination_name,
        start_date=trip_data.start_date,
        end_date=trip_data.end_date,
        total_budget=trip_data.total_budget,
        estimated_cost=trip_data.estimated_cost,
        status="planned"
    )
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return new_trip

@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.delete("/{trip_id}")
def delete_trip(trip_id: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(trip)
    db.commit()
    return {"message": "Trip deleted successfully"}
