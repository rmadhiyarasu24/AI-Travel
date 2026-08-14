from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.domain import Hotel, Restaurant, Activity

hotels_router = APIRouter(prefix="/api/hotels", tags=["Hotels"])
restaurants_router = APIRouter(prefix="/api/restaurants", tags=["Restaurants"])
activities_router = APIRouter(prefix="/api/activities", tags=["Activities"])

@hotels_router.get("")
def get_hotels(db: Session = Depends(get_db)):
    return db.query(Hotel).all()

@restaurants_router.get("")
def get_restaurants(db: Session = Depends(get_db)):
    return db.query(Restaurant).all()

@activities_router.get("")
def get_activities(db: Session = Depends(get_db)):
    return db.query(Activity).all()
