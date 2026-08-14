import time
import json
import urllib.request
import urllib.parse
from typing import Dict, Any, Optional
from app.config import settings

class NominatimService:
    """
    Reusable Geocoding Service using OpenStreetMap Nominatim API.
    Supports forward and reverse geocoding with User-Agent, TTL caching, and timeout handling.
    """

    _CACHE: Dict[str, tuple] = {}
    CACHE_TTL_SECONDS = 900  # 15 minutes

    @classmethod
    def geocode(cls, query: str) -> Dict[str, Any]:
        """
        Forward geocoding: Query string (e.g. "Ooty", "Munnar, Kerala") -> Lat, Lng, Display Name.
        """
        if not query or not query.strip():
            return {"error": "Query string cannot be empty."}

        norm_query = query.strip().lower()
        now = time.time()

        # Check Cache
        if norm_query in cls._CACHE:
            cached_time, cached_data = cls._CACHE[norm_query]
            if now - cached_time < cls.CACHE_TTL_SECONDS:
                copy_data = cached_data.copy()
                copy_data["cached"] = True
                return copy_data

        params = {
            "q": query.strip(),
            "format": "json",
            "limit": 1,
            "addressdetails": 1
        }
        url = f"{settings.NOMINATIM_BASE_URL}/search?{urllib.parse.urlencode(params)}"

        try:
            req = urllib.request.Request(
                url, 
                headers={"User-Agent": settings.USER_AGENT}
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode("utf-8"))
                    if data and len(data) > 0:
                        first = data[0]
                        res = {
                            "status": "success",
                            "name": query.strip(),
                            "latitude": float(first.get("lat")),
                            "longitude": float(first.get("lon")),
                            "display_name": first.get("display_name", query.strip()),
                            "address": first.get("address", {}),
                            "cached": False
                        }
                        cls._CACHE[norm_query] = (now, res)
                        return res

        except Exception as e:
            print(f"[NominatimService] Geocode error for '{query}': {e}")

        # Fallback for known Indian destinations if network is slow
        known_map = {
            "ooty": (11.4102, 76.6950, "Ooty, Udhagamandalam, Nilgiris, Tamil Nadu, India"),
            "munnar": (10.0889, 77.0595, "Munnar, Idukki, Kerala, India"),
            "goa": (15.2993, 74.1240, "Goa, India"),
            "manali": (32.2432, 77.1892, "Manali, Kullu, Himachal Pradesh, India"),
            "jaipur": (26.9124, 75.7873, "Jaipur, Rajasthan, India")
        }

        for key, (lat, lng, dname) in known_map.items():
            if key in norm_query:
                return {
                    "status": "fallback",
                    "name": query.strip(),
                    "latitude": lat,
                    "longitude": lng,
                    "display_name": dname,
                    "cached": False
                }

        return {
            "status": "not_found",
            "name": query.strip(),
            "error": f"No geocoding results found for '{query}'."
        }

    @classmethod
    def reverse_geocode(cls, latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Reverse geocoding: Lat, Lng -> City, State, Country, Display Name.
        """
        cache_key = f"rev_{round(latitude, 4)}_{round(longitude, 4)}"
        now = time.time()

        if cache_key in cls._CACHE:
            cached_time, cached_data = cls._CACHE[cache_key]
            if now - cached_time < cls.CACHE_TTL_SECONDS:
                return cached_data

        params = {
            "lat": latitude,
            "lon": longitude,
            "format": "json",
            "addressdetails": 1
        }
        url = f"{settings.NOMINATIM_BASE_URL}/reverse?{urllib.parse.urlencode(params)}"

        try:
            req = urllib.request.Request(
                url, 
                headers={"User-Agent": settings.USER_AGENT}
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode("utf-8"))
                    addr = data.get("address", {})
                    city = addr.get("city") or addr.get("town") or addr.get("village") or addr.get("county") or "Unknown City"
                    state = addr.get("state", "")
                    country = addr.get("country", "")

                    res = {
                        "status": "success",
                        "latitude": latitude,
                        "longitude": longitude,
                        "city": city,
                        "state": state,
                        "country": country,
                        "display_name": data.get("display_name", f"{city}, {country}")
                    }
                    cls._CACHE[cache_key] = (now, res)
                    return res
        except Exception as e:
            print(f"[NominatimService] Reverse geocode error for ({latitude}, {longitude}): {e}")

        return {
            "status": "error",
            "latitude": latitude,
            "longitude": longitude,
            "city": "Unknown Location",
            "country": "India"
        }
