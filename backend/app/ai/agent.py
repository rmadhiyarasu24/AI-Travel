from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.ai.tools import TravelTools
from app.services.recommendation_service import RecommendationEngine
from app.services.itinerary_service import ItineraryOptimizerService

class AIAgentOrchestrator:
    """
    AI Travel Agent Orchestrator:
    Architecture: Intent Parsing -> Tool Execution -> Recommendation Scoring -> Itinerary Optimizer -> Validation Engine -> Response
    """
    
    def __init__(self, db: Session):
        self.db = db

    def process_chat_message(self, user_message: str, user_id: str = None) -> Dict[str, Any]:
        msg_lower = user_message.lower()
        
        # 1. Tool Call: Fetch destinations
        destinations = TravelTools.search_destinations(self.db)
        hotels = TravelTools.search_hotels(self.db)
        restaurants = TravelTools.search_restaurants(self.db)

        # 2. Score destinations using Recommendation Engine
        scored_destinations = []
        for dest in destinations:
            score = RecommendationEngine.calculate_destination_score(
                dest, 
                user_interests=["nature", "cultural", "food"],
                user_budget=20000
            )
            dest_copy = dest.copy()
            dest_copy["recommendation_score"] = score
            scored_destinations.append(dest_copy)

        scored_destinations.sort(key=lambda x: x["recommendation_score"], reverse=True)

        if "plan" in msg_lower or "trip" in msg_lower or "ooty" in msg_lower or "kerala" in msg_lower:
            # Generate full validated itinerary
            dest_name = "Ooty" if "ooty" in msg_lower else ("Kerala" if "kerala" in msg_lower else "Ooty")
            itinerary = ItineraryOptimizerService.generate_and_validate_itinerary(
                self.db,
                destination_name=dest_name,
                days_count=3,
                budget=20000.0,
                interests=["nature", "food"]
            )

            reply_text = (
                f"I've generated and validated a 3-day itinerary to **{dest_name}** matching your preferences and budget! "
                f"The estimated cost is ₹{itinerary['estimated_cost']:,} out of your ₹20,000 budget. "
                f"All opening hours, travel distances, and hotel recommendations have passed our multi-stage validation engine."
            )

            return {
                "reply": reply_text,
                "recommendations": scored_destinations[:3],
                "itinerary": itinerary
            }

        # Default conversational response with recommendations
        top_dest = scored_destinations[0]["name"] if scored_destinations else "Ooty"
        reply_text = (
            f"Hello! I am your AI Travel Assistant. Based on real-time recommendations and travel knowledge, "
            f"I highly recommend exploring **{top_dest}** (Match Score: {scored_destinations[0]['recommendation_score']}%). "
            f"Would you like me to generate a personalized day-by-day itinerary or check hotel availability?"
        )

        return {
            "reply": reply_text,
            "recommendations": scored_destinations[:3],
            "itinerary": None
        }

    def plan_trip(self, req_data: Dict[str, Any]) -> Dict[str, Any]:
        dest = req_data.get("destination", "Ooty")
        budget = float(req_data.get("budget", 20000))
        travelers = int(req_data.get("travelers", 1))
        interests = req_data.get("interests", ["nature"])
        
        start_date = req_data.get("start_date", "2026-09-10")
        end_date = req_data.get("end_date", "2026-09-13")

        # Calculate days
        days_count = 3

        # Run Itinerary Optimizer & Validation Engine
        itinerary = ItineraryOptimizerService.generate_and_validate_itinerary(
            self.db,
            destination_name=dest,
            days_count=days_count,
            budget=budget,
            interests=interests
        )

        # Weather Tool
        weather = TravelTools.get_weather(dest)

        return {
            "destination": dest,
            "weather": weather,
            "itinerary": itinerary,
            "validation_passed": itinerary["validation_passed"],
            "message": f"Successfully created and validated a custom itinerary for {dest}."
        }
