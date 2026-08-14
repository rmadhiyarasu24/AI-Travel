from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from uuid import UUID

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "TOURIST"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Preference Schemas
class UserPreferenceUpdate(BaseModel):
    preferred_categories: Optional[List[str]] = []
    budget_range: Optional[str] = "medium"
    travel_style: Optional[str] = "balanced"
    dietary_restrictions: Optional[List[str]] = []

# Destination Schemas
class DestinationResponse(BaseModel):
    id: UUID
    name: str
    location: str
    description: str
    category: str
    rating: float
    image_url: Optional[str] = None
    coordinates: Dict[str, float]
    best_time_to_visit: Optional[str] = None
    average_daily_cost: float

    class Config:
        from_attributes = True

# Trip Schemas
class TripPlanRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    travelers: int = 1
    budget: float
    interests: List[str] = []
    transportation: Optional[str] = "car"

class TripCreate(BaseModel):
    title: str
    destination_name: str
    start_date: date
    end_date: date
    total_budget: float
    estimated_cost: float = 0.0

class TripResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    destination_name: str
    start_date: date
    end_date: date
    total_budget: float
    estimated_cost: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# AI Schemas
class AIChatRequest(BaseModel):
    message: str
    conversation_id: Optional[UUID] = None

class AIChatResponse(BaseModel):
    conversation_id: UUID
    reply: str
    recommendations: Optional[List[Dict[str, Any]]] = None
    itinerary: Optional[Dict[str, Any]] = None
