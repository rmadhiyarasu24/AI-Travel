import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Text, Numeric, Boolean, Integer, Date, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="TOURIST")
    avatar_url = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    preferences = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")
    ai_conversations = relationship("AIConversation", back_populates="user", cascade="all, delete-orphan")


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    preferred_categories = Column(JSON, default=list)
    budget_range = Column(String(50), default="medium")
    travel_style = Column(String(50), default="balanced")
    dietary_restrictions = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    user = relationship("User", back_populates="preferences")


class Destination(Base):
    __tablename__ = "destinations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, index=True)
    location = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    rating = Column(Numeric(3, 2), default=4.50)
    image_url = Column(Text, nullable=True)
    coordinates = Column(JSON, default=dict)
    best_time_to_visit = Column(String(255), nullable=True)
    average_daily_cost = Column(Numeric(10, 2), default=0.00)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    places = relationship("Place", back_populates="destination", cascade="all, delete-orphan")
    hotels = relationship("Hotel", back_populates="destination", cascade="all, delete-orphan")
    restaurants = relationship("Restaurant", back_populates="destination", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="destination", cascade="all, delete-orphan")


class Place(Base):
    __tablename__ = "places"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    opening_hours = Column(JSON, default=dict)
    ticket_price = Column(Numeric(10, 2), default=0.00)
    rating = Column(Numeric(3, 2), default=4.50)
    image_url = Column(Text, nullable=True)
    coordinates = Column(JSON, default=dict)
    recommended_duration_hours = Column(Numeric(3, 1), default=2.0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    destination = relationship("Destination", back_populates="places")


class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    price_per_night = Column(Numeric(10, 2), nullable=False)
    rating = Column(Numeric(3, 2), default=4.50)
    amenities = Column(JSON, default=list)
    address = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    coordinates = Column(JSON, default=dict)
    contact_phone = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    destination = relationship("Destination", back_populates="hotels")


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    cuisine = Column(String(100), nullable=False)
    price_range = Column(String(50), default="$$")
    average_cost_per_person = Column(Numeric(10, 2), default=300.00)
    rating = Column(Numeric(3, 2), default=4.50)
    address = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    coordinates = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    destination = relationship("Destination", back_populates="restaurants")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    duration = Column(String(50), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    category = Column(String(100), nullable=False)
    rating = Column(Numeric(3, 2), default=4.50)
    image_url = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    destination = relationship("Destination", back_populates="activities")


class Trip(Base):
    __tablename__ = "trips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    destination_name = Column(String(255), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    total_budget = Column(Numeric(10, 2), nullable=False)
    estimated_cost = Column(Numeric(10, 2), default=0.00)
    status = Column(String(50), default="planned")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    user = relationship("User", back_populates="trips")
    days = relationship("ItineraryDay", back_populates="trip", cascade="all, delete-orphan")


class ItineraryDay(Base):
    __tablename__ = "itinerary_days"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    day_number = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    trip = relationship("Trip", back_populates="days")
    items = relationship("ItineraryItem", back_populates="day", cascade="all, delete-orphan")


class ItineraryItem(Base):
    __tablename__ = "itinerary_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    itinerary_day_id = Column(UUID(as_uuid=True), ForeignKey("itinerary_days.id", ondelete="CASCADE"), nullable=False)
    item_type = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    place_id = Column(UUID(as_uuid=True), ForeignKey("places.id", ondelete="SET NULL"), nullable=True)
    hotel_id = Column(UUID(as_uuid=True), ForeignKey("hotels.id", ondelete="SET NULL"), nullable=True)
    restaurant_id = Column(UUID(as_uuid=True), ForeignKey("restaurants.id", ondelete="SET NULL"), nullable=True)
    activity_id = Column(UUID(as_uuid=True), ForeignKey("activities.id", ondelete="SET NULL"), nullable=True)
    start_time = Column(String(20), nullable=True)
    end_time = Column(String(20), nullable=True)
    cost = Column(Numeric(10, 2), default=0.00)
    location_name = Column(String(255), nullable=True)
    coordinates = Column(JSON, default=dict)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    day = relationship("ItineraryDay", back_populates="items")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    service_type = Column(String(50), nullable=False)
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    booking_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(50), default="confirmed")
    total_amount = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)


class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), default="New Travel Chat")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    user = relationship("User", back_populates="ai_conversations")
    messages = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan")


class AIMessage(Base):
    __tablename__ = "ai_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String(50), nullable=False) # 'user', 'assistant', 'system'
    content = Column(Text, nullable=False)
    msg_metadata = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    conversation = relationship("AIConversation", back_populates="messages")
