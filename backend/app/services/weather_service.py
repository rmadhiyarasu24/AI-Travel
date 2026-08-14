import time
import json
import urllib.request
import urllib.parse
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.config import settings

class WeatherService:
    """
    Modular Weather Service Provider integrated with free Open-Meteo Forecast API.
    Supports in-memory TTL caching (15 min), WMO weather code parsing,
    and dynamic coordinates resolution for Indian travel destinations.
    """

    # In-memory TTL Cache: {(lat, lng, date): (timestamp, data)}
    _CACHE: Dict[str, tuple] = {}
    CACHE_TTL_SECONDS = 900  # 15 minutes

    # Known Indian Travel Destinations Coordinates Map
    INDIAN_DESTINATIONS_MAP: Dict[str, Dict[str, float]] = {
        "ooty": {"lat": 11.4102, "lng": 76.6950, "name": "Ooty, Tamil Nadu"},
        "munnar": {"lat": 10.0889, "lng": 77.0595, "name": "Munnar, Kerala"},
        "goa": {"lat": 15.2993, "lng": 74.1240, "name": "Goa"},
        "leh ladakh": {"lat": 34.1526, "lng": 77.5771, "name": "Leh Ladakh"},
        "ladakh": {"lat": 34.1526, "lng": 77.5771, "name": "Leh Ladakh"},
        "manali": {"lat": 32.2432, "lng": 77.1892, "name": "Manali, Himachal Pradesh"},
        "shimla": {"lat": 31.1048, "lng": 77.1734, "name": "Shimla, Himachal Pradesh"},
        "coorg": {"lat": 12.3375, "lng": 75.8069, "name": "Coorg, Karnataka"},
        "wayanad": {"lat": 11.6854, "lng": 76.1320, "name": "Wayanad, Kerala"},
        "kodaikanal": {"lat": 10.2381, "lng": 77.4892, "name": "Kodaikanal, Tamil Nadu"},
        "darjeeling": {"lat": 27.0410, "lng": 88.2663, "name": "Darjeeling, West Bengal"},
        "alleppey": {"lat": 9.4981, "lng": 76.3388, "name": "Alleppey, Kerala"},
        "jaipur": {"lat": 26.9124, "lng": 75.7873, "name": "Jaipur, Rajasthan"},
        "udaipur": {"lat": 24.5854, "lng": 73.7125, "name": "Udaipur, Rajasthan"},
        "pondicherry": {"lat": 11.9416, "lng": 79.8083, "name": "Pondicherry"},
        "varanasi": {"lat": 25.3176, "lng": 82.9739, "name": "Varanasi, Uttar Pradesh"},
        "rishikesh": {"lat": 30.0869, "lng": 78.2676, "name": "Rishikesh, Uttarakhand"},
        "chikmagalur": {"lat": 13.3161, "lng": 75.7720, "name": "Chikmagalur, Karnataka"},
        "gokarna": {"lat": 14.5479, "lng": 74.3188, "name": "Gokarna, Karnataka"}
    }

    # WMO Weather Code Decoder
    WMO_CODE_MAP = {
        0: ("Clear sky ☀️", "Ideal for outdoor activities, trekking, and sightseeing."),
        1: ("Mainly clear 🌤️", "Great weather for outdoor exploration."),
        2: ("Partly cloudy ⛅", "Pleasant weather with mild cloud cover."),
        3: ("Overcast ☁️", "Cool and cloudy, good for walking tours."),
        45: ("Foggy 🌫️", "Reduced visibility. Drive carefully on mountain roads."),
        48: ("Depositing rime fog 🌫️", "Cold mist and fog. Dress warmly."),
        51: ("Light drizzle 🌦️", "Light rain. Carry a light jacket or umbrella."),
        53: ("Moderate drizzle 🌧️", "Drizzle expected. Plan indoor or covered activities."),
        55: ("Dense drizzle 🌧️", "Continuous rain showers."),
        61: ("Slight rain 🌧️", "Intermittent light rain showers."),
        63: ("Moderate rain 🌧️", "Moderate rainfall. Carry raincoat or umbrella."),
        65: ("Heavy rain 🌧️", "Heavy downpour expected. Stay cautious."),
        71: ("Slight snowfall ❄️", "Snowfall expected. Great for snow sightseeing!"),
        73: ("Moderate snowfall ❄️", "Snowy conditions. Wear heavy winter apparel."),
        75: ("Heavy snowfall ❄️", "Heavy snow. Verify road accessibility."),
        80: ("Slight rain showers 🌦️", "Passing rain showers."),
        81: ("Moderate rain showers 🌧️", "Frequent rain showers expected."),
        82: ("Violent rain showers ⛈️", "Strong rain downpours."),
        95: ("Thunderstorm 🌩️", "Thunderstorms possible. Seek sheltered activities.")
    }

    @classmethod
    def decode_wmo_code(cls, code: int) -> tuple:
        return cls.WMO_CODE_MAP.get(code, ("Variable weather", "Check local conditions."))

    @classmethod
    def get_weather_by_coords(
        cls, 
        latitude: float, 
        longitude: float, 
        forecast_date: Optional[str] = None,
        location_name: Optional[str] = "Location"
    ) -> Dict[str, Any]:
        """
        Fetches live weather from Open-Meteo API for specified coordinates and optional forecast date.
        Uses 15-minute TTL caching.
        """
        cache_key = f"{round(latitude, 4)}_{round(longitude, 4)}_{forecast_date or 'current'}"
        now = time.time()

        # Check Cache
        if cache_key in cls._CACHE:
            cached_time, cached_data = cls._CACHE[cache_key]
            if now - cached_time < cls.CACHE_TTL_SECONDS:
                cached_copy = cached_data.copy()
                cached_copy["cached"] = True
                return cached_copy

        # Build Open-Meteo API Request URL
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,apparent_temperature,weather_code,precipitation,rain,wind_speed_10m",
            "daily": "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_probability_max,rain_sum",
            "timezone": "Asia/Kolkata"
        }
        
        if forecast_date:
            params["start_date"] = forecast_date
            params["end_date"] = forecast_date

        url = f"{settings.OPEN_METEO_BASE_URL}?{urllib.parse.urlencode(params)}"

        try:
            req = urllib.request.Request(url, headers={"User-Agent": "AI-Travel-App/1.0"})
            with urllib.request.urlopen(req, timeout=10) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode("utf-8"))
                    
                    current = data.get("current", {})
                    daily = data.get("daily", {})

                    weather_code = current.get("weather_code", daily.get("weather_code", [0])[0] if daily.get("weather_code") else 0)
                    condition_text, advice = cls.decode_wmo_code(weather_code)

                    precip_prob = daily.get("precipitation_probability_max", [0])[0] if daily.get("precipitation_probability_max") else 0
                    rain_mm = current.get("rain", current.get("precipitation", daily.get("rain_sum", [0.0])[0] if daily.get("rain_sum") else 0.0))
                    
                    sunrise_str = daily.get("sunrise", ["06:00"])[0] if daily.get("sunrise") else "06:00"
                    sunset_str = daily.get("sunset", "18:30")[0] if daily.get("sunset") else "18:30"

                    if "T" in sunrise_str:
                        sunrise_str = sunrise_str.split("T")[1]
                    if "T" in sunset_str:
                        sunset_str = sunset_str.split("T")[1]

                    result = {
                        "status": "success",
                        "location_name": location_name,
                        "latitude": latitude,
                        "longitude": longitude,
                        "temperature": float(current.get("temperature_2m", daily.get("temperature_2m_max", [22.0])[0] if daily.get("temperature_2m_max") else 22.0)),
                        "apparent_temperature": float(current.get("apparent_temperature", daily.get("apparent_temperature_max", [22.0])[0] if daily.get("apparent_temperature_max") else 22.0)),
                        "temp_max": float(daily.get("temperature_2m_max", [25.0])[0] if daily.get("temperature_2m_max") else 25.0),
                        "temp_min": float(daily.get("temperature_2m_min", [15.0])[0] if daily.get("temperature_2m_min") else 15.0),
                        "weather_code": weather_code,
                        "weather_condition": condition_text,
                        "travel_advice": advice,
                        "precipitation_probability": int(precip_prob),
                        "rainfall_mm": float(rain_mm),
                        "wind_speed_kmh": float(current.get("wind_speed_10m", 10.0)),
                        "sunrise": sunrise_str,
                        "sunset": sunset_str,
                        "timezone": data.get("timezone", "Asia/Kolkata"),
                        "cached": False
                    }

                    # Cache successful result
                    cls._CACHE[cache_key] = (now, result)
                    return result

        except Exception as e:
            # Graceful Fallback if Network / API fails
            print(f"[WeatherService] Open-Meteo call failed: {e}")

        # Fallback structured response
        return {
            "status": "fallback",
            "location_name": location_name,
            "latitude": latitude,
            "longitude": longitude,
            "temperature": 22.0,
            "apparent_temperature": 21.5,
            "weather_code": 0,
            "weather_condition": "Pleasant / Clear sky",
            "travel_advice": "Favorable conditions for travel.",
            "precipitation_probability": 10,
            "rainfall_mm": 0.0,
            "wind_speed_kmh": 12.0,
            "sunrise": "06:15",
            "sunset": "18:25",
            "timezone": "Asia/Kolkata",
            "cached": False
        }

    @classmethod
    def get_weather_by_destination(
        cls, 
        db: Session, 
        destination_name: str, 
        forecast_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Resolves coordinates for any Indian destination name and returns Open-Meteo forecast.
        Checks built-in map first, then queries Supabase PostgreSQL destinations table.
        """
        norm_name = destination_name.strip().lower()

        # Step A: Check built-in Indian destinations map
        if norm_name in cls.INDIAN_DESTINATIONS_MAP:
            info = cls.INDIAN_DESTINATIONS_MAP[norm_name]
            return cls.get_weather_by_coords(
                latitude=info["lat"],
                longitude=info["lng"],
                forecast_date=forecast_date,
                location_name=info["name"]
            )

        # Step B: Query Supabase PostgreSQL database
        if db:
            from app.models.domain import Destination
            dest = db.query(Destination).filter(Destination.name.ilike(f"%{destination_name}%")).first()
            if dest and dest.coordinates:
                coords = dest.coordinates
                lat = float(coords.get("lat", 11.4102))
                lng = float(coords.get("lng", 76.6950))
                return cls.get_weather_by_coords(
                    latitude=lat,
                    longitude=lng,
                    forecast_date=forecast_date,
                    location_name=f"{dest.name}, {dest.location}"
                )

        # Default fallback to Ooty, Tamil Nadu coordinates if unknown
        ooty_info = cls.INDIAN_DESTINATIONS_MAP["ooty"]
        return cls.get_weather_by_coords(
            latitude=ooty_info["lat"],
            longitude=ooty_info["lng"],
            forecast_date=forecast_date,
            location_name=f"{destination_name} (India)"
        )
