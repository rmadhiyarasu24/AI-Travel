from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, destinations, trips, ai, weather, geocoding, places, routing, travel
from app.api.services_api import hotels_router, restaurants_router, activities_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Travel Recommendation & Tourist Services Platform API connected to Supabase PostgreSQL",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(destinations.router)
app.include_router(trips.router)
app.include_router(hotels_router)
app.include_router(restaurants_router)
app.include_router(activities_router)
app.include_router(ai.router)
app.include_router(weather.router)
app.include_router(geocoding.router)
app.include_router(places.router)
app.include_router(routing.router)
app.include_router(travel.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "AI-Powered Travel Recommendation Platform API",
        "database": "Supabase PostgreSQL connected",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
