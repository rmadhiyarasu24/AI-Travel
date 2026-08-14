import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Powered Travel Recommendation Platform"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-travel-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Supabase PostgreSQL connection URL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:%40713324AD055@db.byxamnetuserezhcmrlr.supabase.co:5432/postgres"
    )

    # Local Ollama Configuration
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "qwen3:8b")

    # Open-Meteo Weather API Base URL
    OPEN_METEO_BASE_URL: str = os.getenv("OPEN_METEO_BASE_URL", "https://api.open-meteo.com/v1/forecast")

    # Open Geospatial Services Configuration
    NOMINATIM_BASE_URL: str = os.getenv("NOMINATIM_BASE_URL", "https://nominatim.openstreetmap.org")
    OVERPASS_BASE_URL: str = os.getenv("OVERPASS_BASE_URL", "https://overpass-api.de/api/interpreter")
    OSRM_BASE_URL: str = os.getenv("OSRM_BASE_URL", "http://router.project-osrm.org/route/v1/driving")
    USER_AGENT: str = "AI-Travel-Platform/1.0 (contact@aitravel.example.com)"

    model_config = SettingsConfigDict(case_sensitive=True, extra="ignore")

settings = Settings()
