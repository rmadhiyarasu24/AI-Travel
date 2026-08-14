import math
import time
import json
import urllib.request
import urllib.parse
from typing import List, Dict, Any
from app.config import settings

class OSRMService:
    """
    Reusable Driving Route & Navigation Service using OSRM (Open Source Routing Machine).
    Calculates driving distance, estimated travel duration, and polyline GeoJSON coordinates.
    """

    _CACHE: Dict[str, tuple] = {}
    CACHE_TTL_SECONDS = 1800  # 30 minutes

    @classmethod
    def calculate_route(cls, waypoints: List[Dict[str, float]]) -> Dict[str, Any]:
        """
        Calculates route between 2 or more waypoints.
        waypoints format: [{"latitude": 11.4102, "longitude": 76.6950}, ...]
        Returns distance_km, duration_minutes, and route_coordinates [[lat, lng], ...].
        """
        if not waypoints or len(waypoints) < 2:
            return {
                "distance_km": 0.0,
                "duration_minutes": 0,
                "route_coordinates": []
            }

        # Build OSRM Coordinate string: lon1,lat1;lon2,lat2;lon3,lat3
        coord_strs = [f"{wp['longitude']},{wp['latitude']}" for wp in waypoints]
        waypoints_path = ";".join(coord_strs)
        
        cache_key = f"osrm_{waypoints_path}"
        now = time.time()

        if cache_key in cls._CACHE:
            cached_time, cached_data = cls._CACHE[cache_key]
            if now - cached_time < cls.CACHE_TTL_SECONDS:
                return cached_data

        url = f"{settings.OSRM_BASE_URL}/{waypoints_path}?overview=full&geometries=geojson"

        try:
            req = urllib.request.Request(url, headers={"User-Agent": settings.USER_AGENT})
            with urllib.request.urlopen(req, timeout=10) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode("utf-8"))
                    routes = data.get("routes", [])
                    if routes:
                        primary_route = routes[0]
                        dist_meters = primary_route.get("distance", 0.0)
                        dur_seconds = primary_route.get("duration", 0.0)
                        geometry = primary_route.get("geometry", {}).get("coordinates", [])

                        # OSRM returns GeoJSON [lng, lat]. Convert to Leaflet format [lat, lng].
                        leaflet_coords = [[pt[1], pt[0]] for pt in geometry]

                        res = {
                            "status": "success",
                            "distance_km": round(dist_meters / 1000.0, 1),
                            "duration_minutes": round(dur_seconds / 60.0),
                            "route_coordinates": leaflet_coords,
                            "cached": False
                        }
                        cls._CACHE[cache_key] = (now, res)
                        return res

        except Exception as e:
            print(f"[OSRMService] OSRM query failed: {e}")

        # Fallback Haversine geodesic interpolation if OSRM server is slow
        total_dist_km = 0.0
        route_coords = []

        for i in range(len(waypoints) - 1):
            p1 = waypoints[i]
            p2 = waypoints[i + 1]
            lat1, lng1 = p1["latitude"], p1["longitude"]
            lat2, lng2 = p2["latitude"], p2["longitude"]

            # Haversine distance
            R = 6371.0
            dlat = math.radians(lat2 - lat1)
            dlng = math.radians(lng2 - lng1)
            a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
            dist = R * c
            total_dist_km += dist

            # Interpolate 10 points between waypoints
            for step in range(11):
                t = step / 10.0
                route_coords.append([
                    round(lat1 + (lat2 - lat1) * t, 5),
                    round(lng1 + (lng2 - lng1) * t, 5)
                ])

        res = {
            "status": "fallback",
            "distance_km": round(total_dist_km, 1),
            "duration_minutes": round(total_dist_km * 2.5),  # ~25 km/h average mountain driving speed
            "route_coordinates": route_coords,
            "cached": False
        }
        cls._CACHE[cache_key] = (now, res)
        return res
