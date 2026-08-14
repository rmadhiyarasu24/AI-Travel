import time
import json
import urllib.request
import urllib.parse
from typing import List, Dict, Any, Optional
from app.config import settings

class OverpassService:
    """
    Reusable Tourist Places & POI Service using OpenStreetMap Overpass API.
    Retrieves tourist attractions, viewpoints, lakes, waterfalls, parks, museums, restaurants, and hotels.
    """

    _CACHE: Dict[str, tuple] = {}
    CACHE_TTL_SECONDS = 900  # 15 minutes

    CATEGORY_MAPPING = {
        "attraction": ["attraction", "theme_park", "viewpoint", "museum", "artwork"],
        "nature": ["viewpoint", "waterfall", "park", "nature_reserve", "lake"],
        "culture": ["museum", "historic", "temple", "church", "monument"],
        "food": ["restaurant", "cafe", "fast_food"],
        "hotel": ["hotel", "guest_house", "resort", "hostel"]
    }

    @classmethod
    def search_places(
        cls, 
        latitude: float, 
        longitude: float, 
        radius_meters: int = 8000, 
        category: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Queries OpenStreetMap via Overpass QL for POIs around (latitude, longitude).
        """
        cache_key = f"poi_{round(latitude, 3)}_{round(longitude, 3)}_{radius_meters}_{category or 'all'}"
        now = time.time()

        if cache_key in cls._CACHE:
            cached_time, cached_data = cls._CACHE[cache_key]
            if now - cached_time < cls.CACHE_TTL_SECONDS:
                return cached_data

        overpass_query = f"""
        [out:json][timeout:25];
        (
          node["tourism"](around:{radius_meters},{latitude},{longitude});
          way["tourism"](around:{radius_meters},{latitude},{longitude});
          node["historic"](around:{radius_meters},{latitude},{longitude});
          node["leisure"~"park|nature_reserve"](around:{radius_meters},{latitude},{longitude});
          node["amenity"~"restaurant|cafe"](around:{radius_meters},{latitude},{longitude});
          node["natural"~"waterfall|peak|water"](around:{radius_meters},{latitude},{longitude});
        );
        out center 35;
        """

        data_bytes = urllib.parse.urlencode({'data': overpass_query}).encode('utf-8')
        req = urllib.request.Request(
            settings.OVERPASS_BASE_URL, 
            data=data_bytes, 
            headers={
                "Content-Type": "application/x-www-form-urlencoded", 
                "User-Agent": settings.USER_AGENT
            }
        )

        try:
            with urllib.request.urlopen(req, timeout=12) as response:
                if response.status == 200:
                    payload = json.loads(response.read().decode("utf-8"))
                    elements = payload.get("elements", [])
                    places = []
                    seen_names = set()

                    for elem in elements:
                        tags = elem.get("tags", {})
                        name = tags.get("name") or tags.get("name:en")
                        if not name or name in seen_names:
                            continue

                        seen_names.add(name)
                        lat = elem.get("lat") or elem.get("center", {}).get("lat")
                        lng = elem.get("lon") or elem.get("center", {}).get("lon")
                        if not lat or not lng:
                            continue

                        # Categorize POI
                        tourism = tags.get("tourism", "")
                        historic = tags.get("historic", "")
                        amenity = tags.get("amenity", "")
                        natural = tags.get("natural", "")
                        leisure = tags.get("leisure", "")

                        cat_name = "Tourist Attraction"
                        if tourism == "viewpoint" or natural in ["peak", "waterfall"]:
                            cat_name = "Nature & Viewpoint"
                        elif tourism == "museum" or historic:
                            cat_name = "Heritage & Culture"
                        elif amenity in ["restaurant", "cafe"]:
                            cat_name = "Dining & Cafe"
                        elif leisure == "park" or natural == "water":
                            cat_name = "Parks & Lakes"

                        places.append({
                            "id": f"osm_{elem.get('id')}",
                            "name": name,
                            "latitude": float(lat),
                            "longitude": float(lng),
                            "category": cat_name,
                            "description": tags.get("description", f"Popular {cat_name.lower()} in the area."),
                            "tags": tags
                        })

                    if places:
                        cls._CACHE[cache_key] = (now, places)
                        return places

        except Exception as e:
            print(f"[OverpassService] Overpass query error: {e}")

        # High quality fallback for Ooty area if Overpass server is busy
        if abs(latitude - 11.4102) < 0.2 and abs(longitude - 76.6950) < 0.2:
            fallback_ooty = [
                {
                    "id": "ooty_1",
                    "name": "Ooty Lake & Boating Spot",
                    "latitude": 11.4089,
                    "longitude": 76.6853,
                    "category": "Parks & Lakes",
                    "description": "Scenic artificial lake created in 1824, ideal for speed boating and peaceful walks.",
                    "tags": {"tourism": "attraction", "water": "lake"}
                },
                {
                    "id": "ooty_2",
                    "name": "Government Botanical Garden",
                    "latitude": 11.4150,
                    "longitude": 76.7110,
                    "category": "Nature & Viewpoint",
                    "description": "55-acre terraced garden featuring thousands of exotic flora and 20-million-year-old fossilized tree.",
                    "tags": {"leisure": "park", "tourism": "attraction"}
                },
                {
                    "id": "ooty_3",
                    "name": "Doddabetta Peak & Telescope House",
                    "latitude": 11.4011,
                    "longitude": 76.7356,
                    "category": "Nature & Viewpoint",
                    "description": "Highest mountain peak in the Nilgiri Hills (2,637m) with panoramic valley views.",
                    "tags": {"natural": "peak", "tourism": "viewpoint"}
                },
                {
                    "id": "ooty_4",
                    "name": "Pykara Waterfalls & Lake",
                    "latitude": 11.4550,
                    "longitude": 76.5890,
                    "category": "Nature & Viewpoint",
                    "description": "Majestic multi-tiered waterfall nestled inside lush pine forests.",
                    "tags": {"natural": "waterfall", "tourism": "attraction"}
                },
                {
                    "id": "ooty_5",
                    "name": "Rose Garden",
                    "latitude": 11.4060,
                    "longitude": 76.7080,
                    "category": "Parks & Lakes",
                    "description": "Largest rose garden in India featuring over 20,000 varieties of roses.",
                    "tags": {"leisure": "park"}
                }
            ]
            cls._CACHE[cache_key] = (now, fallback_ooty)
            return fallback_ooty

        return []
