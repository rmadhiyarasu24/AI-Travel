from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.domain import Destination, Place, Hotel, Restaurant, Activity

class TravelTools:
    """
    Tool Calling Layer:
    - search_destinations
    - search_places
    - get_weather
    - calculate_route
    - search_hotels
    - search_restaurants
    - calculate_budget
    """

    @staticmethod
    def search_destinations(db: Session, query: str = "") -> List[Dict[str, Any]]:
        destinations = db.query(Destination).all()
        return [
            {
                "id": str(d.id),
                "name": d.name,
                "location": d.location,
                "category": d.category,
                "rating": float(d.rating),
                "image_url": d.image_url,
                "average_daily_cost": float(d.average_daily_cost)
            }
            for d in destinations
            if not query or query.lower() in d.name.lower() or query.lower() in d.location.lower()
        ]

    @staticmethod
    def get_weather(db: Session, destination_name: str, forecast_date: str = None) -> Dict[str, Any]:
        from app.services.weather_service import WeatherService
        return WeatherService.get_weather_by_destination(db, destination_name, forecast_date)

    @staticmethod
    def search_hotels(db: Session, destination_id: str = None) -> List[Dict[str, Any]]:
        hotels = db.query(Hotel).all()
        return [
            {
                "id": str(h.id),
                "name": h.name,
                "price_per_night": float(h.price_per_night),
                "rating": float(h.rating),
                "amenities": h.amenities,
                "image_url": h.image_url
            }
            for h in hotels
        ]

    @staticmethod
    def search_restaurants(db: Session, destination_id: str = None) -> List[Dict[str, Any]]:
        restaurants = db.query(Restaurant).all()
        return [
            {
                "id": str(r.id),
                "name": r.name,
                "cuisine": r.cuisine,
                "price_range": r.price_range,
                "average_cost_per_person": float(r.average_cost_per_person),
                "rating": float(r.rating)
            }
            for r in restaurants
        ]

    @staticmethod
    def calculate_budget(duration_days: int, hotel_cost_per_night: float, daily_food_cost: float, activity_cost: float) -> Dict[str, Any]:
        total_hotel = duration_days * hotel_cost_per_night
        total_food = duration_days * daily_food_cost
        total_budget = total_hotel + total_food + activity_cost
        return {
            "duration_days": duration_days,
            "accommodation_total": round(total_hotel, 2),
            "food_total": round(total_food, 2),
            "activities_total": round(activity_cost, 2),
            "estimated_total_cost": round(total_budget, 2)
        }
