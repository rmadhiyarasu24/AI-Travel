import json
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.services.nominatim_service import NominatimService
from app.services.overpass_service import OverpassService
from app.services.weather_service import WeatherService
from app.services.osrm_service import OSRMService
from app.services.ollama_service import OllamaService

class TravelOrchestrator:
    """
    AI Travel Orchestrator powered by Qwen3:8b + Open Geospatial Tool Pipeline.
    Integrates Nominatim, Overpass API, Open-Meteo, OSRM, and Ollama Qwen3:8b.
    Computes day-wise route legs and Google Maps navigation redirection data.
    """

    @classmethod
    def plan_trip(
        cls, 
        db: Session, 
        destination: str, 
        duration_days: int = 3, 
        traveler_type: str = "nature-loving",
        user_prompt: str = ""
    ) -> Dict[str, Any]:
        """
        Executes end-to-end travel planning flow:
        1. Geocode location via Nominatim
        2. Fetch real POIs via Overpass API
        3. Fetch live weather via Open-Meteo API
        4. Calculate driving distances and route geometry via OSRM (total + per-day legs)
        5. Pass real geospatial context to Qwen3:8b for structured itinerary synthesis
        """
        target_dest = destination.strip() if destination else "Ooty"

        # 1. Geocode Destination via Nominatim
        geo_info = NominatimService.geocode(target_dest)
        lat = geo_info.get("latitude", 11.4102)
        lng = geo_info.get("longitude", 76.6950)
        display_name = geo_info.get("display_name", target_dest)

        # 2. Retrieve Real POIs via Overpass API
        pois = OverpassService.search_places(latitude=lat, longitude=lng, radius_meters=8000)

        # 3. Retrieve Live Weather via Open-Meteo API
        weather_info = WeatherService.get_weather_by_coords(
            latitude=lat, 
            longitude=lng, 
            location_name=display_name
        )

        # 4. Calculate Driving Routes (Total + Day-Wise Legs via OSRM)
        waypoints_total = [{"latitude": lat, "longitude": lng}]
        for p in pois[:6]:
            waypoints_total.append({"latitude": p["latitude"], "longitude": p["longitude"]})

        total_route_info = OSRMService.calculate_route(waypoints_total)

        # Compute per-day routes
        day_routes = {}
        items_per_day = max(1, len(pois) // duration_days)
        
        for day in range(1, duration_days + 1):
            start_idx = (day - 1) * items_per_day
            end_idx = start_idx + items_per_day if day < duration_days else len(pois)
            day_pois = pois[start_idx:end_idx] if pois else []
            
            day_wps = [{"latitude": lat, "longitude": lng}]
            for dp in day_pois:
                day_wps.append({"latitude": dp["latitude"], "longitude": dp["longitude"]})
            
            day_route = OSRMService.calculate_route(day_wps)
            day_routes[str(day)] = {
                "day_number": day,
                "places": day_pois,
                "distance_km": day_route.get("distance_km", 0.0),
                "duration_minutes": day_route.get("duration_minutes", 0),
                "coordinates": day_route.get("route_coordinates", [])
            }

        # 5. Build AI Context for Qwen3:8b Orchestrator
        poi_summary = "\n".join([
            f"- {p['name']} ({p['category']}): Lat {p['latitude']}, Lng {p['longitude']} | {p['description']}"
            for p in pois[:10]
        ])

        system_prompt = f"""You are the Lead Travel AI Orchestrator for the AI Travel Platform.
You MUST generate a structured, concise {duration_days}-day travel itinerary for a {traveler_type} traveler visiting {target_dest}.

REAL DATA PROVIDED BY BACKEND TOOLS (DO NOT ALTER COORDINATES OR DISTANCES):
- Destination: {display_name} (Lat: {lat}, Lng: {lng})
- Live Open-Meteo Weather: {weather_info.get('temperature')}°C, {weather_info.get('weather_condition')}. Travel Advice: {weather_info.get('travel_advice')}
- Total Route Distance (OSRM): {total_route_info.get('distance_km')} km (~{total_route_info.get('duration_minutes')} mins driving)

VERIFIED REAL TOURIST PLACES (FROM OPENSTREETMAP):
{poi_summary}

INSTRUCTIONS:
1. Create a concise {duration_days}-day itinerary using ONLY the real places listed above.
2. Provide bullet points for Morning, Afternoon, and Evening for each day.
3. Keep total output under 250 words so generation is fast and crisp.
"""

        user_query = user_prompt if user_prompt else f"Plan a {duration_days}-day trip to {target_dest} for a {traveler_type} traveler."
        
        # 6. Generate Itinerary text via Qwen3:8b
        ai_response = OllamaService.generate_chat_response(
            user_message=user_query, 
            system_prompt=system_prompt
        )
        itinerary_text = ai_response.get("response", "Structured itinerary generated.")

        # 7. Build Full Response JSON for React + Leaflet Frontend
        return {
            "status": "success",
            "destination": {
                "name": target_dest,
                "display_name": display_name,
                "latitude": lat,
                "longitude": lng
            },
            "weather": weather_info,
            "places": pois,
            "route": {
                "distance_km": total_route_info.get("distance_km", 0.0),
                "duration_minutes": total_route_info.get("duration_minutes", 0),
                "coordinates": total_route_info.get("route_coordinates", [])
            },
            "day_routes": day_routes,
            "itinerary_markdown": itinerary_text,
            "model_used": "qwen3:8b"
        }
