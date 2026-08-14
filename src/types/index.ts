export interface Destination {
  id: string;
  name: string;
  stateOrCountry: string;
  region: 'South India' | 'North India' | 'East India' | 'West India' | 'International';
  description: string;
  tagline: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  bestTimeToVisit: string;
  startingBudget: number; // in INR
  idealDurationDays: number;
  climate: 'Cool / Mountain' | 'Tropical Coastal' | 'Temperate' | 'Heritage Valley' | 'Desert';
  tags: string[];
  popularActivities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  highlights: string[];
  topAttractions: string[];
}

export interface Hotel {
  id: string;
  name: string;
  destinationId: string;
  destinationName: string;
  location: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  category: 'Luxury Resort' | 'Boutique Heritage' | 'Eco Lodge' | 'Modern Premium' | 'Cozy Villa';
  amenities: string[];
  roomTypes: {
    name: string;
    price: number;
    capacity: string;
    features: string[];
  }[];
  coordinates: {
    lat: number;
    lng: number;
  };
  featuredTag?: string;
  sustainableBadge?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  destinationId: string;
  destinationName: string;
  location: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  priceRange: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  approxCostForTwo: number;
  isVegetarian: boolean;
  isVeganFriendly: boolean;
  isFamilyFriendly: boolean;
  specialtyDishes: string[];
  distanceKm: number;
  openingHours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Activity {
  id: string;
  title: string;
  destinationId: string;
  destinationName: string;
  category: 'Trekking' | 'Water Sports' | 'Historical Sites' | 'Nature' | 'Food Experiences' | 'Cultural Experiences';
  categoryIcon: string;
  image: string;
  duration: string;
  pricePerPerson: number;
  rating: number;
  reviewCount: number;
  difficulty?: 'Easy' | 'Moderate' | 'Challenging';
  includes: string[];
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  location: string;
  type: 'attraction' | 'food' | 'activity' | 'relaxation' | 'stay' | 'transit';
  description: string;
  image: string;
  durationHours: number;
  distanceFromPrevKm: number;
  travelDurationMin: number;
  estimatedCost: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  tips?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  theme: string;
  date?: string;
  items: ItineraryItem[];
  dayEstimatedCost: number;
}

export interface TripBudgetBreakdown {
  hotel: number;
  food: number;
  transport: number;
  activities: number;
  other: number;
  total: number;
  currency: string;
}

export interface TripPlan {
  id: string;
  title: string;
  destination: string;
  stateOrCountry: string;
  summary: string;
  heroImage: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travelers: number;
  travelStyle: 'Relaxed' | 'Balanced' | 'Fast-Paced' | 'Luxury' | 'Budget Explorer';
  interests: string[];
  transportMode: 'Private Cab' | 'Self Drive' | 'Train & Local' | 'Flight & Taxi';
  accommodationType: 'Luxury Resorts' | 'Boutique Hotels' | 'Eco Stays' | 'Budget Friendly';
  days: ItineraryDay[];
  budget: TripBudgetBreakdown;
  recommendations: {
    packing: string[];
    localEtiquette: string[];
    bestPhotoSpots: string[];
    curatedFoodStops: string[];
  };
  weather?: {
    tempAvgC: number;
    condition: string;
    forecast: string;
    humidity: string;
    uvIndex: string;
  };
  weatherForecast?: {
    tempAvg: number;
    tempHigh: number;
    tempLow: number;
    condition: string;
    rainProbability: number;
    packingRecommendations: string[];
  };
  sources?: string[];
  createdAt?: string;
}

export interface WeatherInfo {
  destinationId: string;
  cityName: string;
  tempAvg: number;
  tempHigh: number;
  tempLow: number;
  condition: string;
  rainProbability: number;
  humidity: string;
  packingRecommendations: string[];
}

export interface PlanTripRequest {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  budgetTier?: 'budget' | 'moderate' | 'luxury';
  travelStyle?: string;
  interests: string[];
  accommodationStyle?: string;
  pace?: 'relaxed' | 'balanced' | 'fast-paced';
  dietaryPreference?: string;
  transportation?: string;
  accommodation?: string;
}

// Section 28: FastAPI AI Planning Contract
export interface AIPlanTripRequest {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  travelStyle?: string;
  interests: string[];
  transportation?: string;
  accommodation?: string;
}

export interface AIPlanTripResponse {
  tripId: string;
  destination: string;
  summary: string;
  heroImage: string;
  durationDays: number;
  travelers: number;
  days: ItineraryDay[];
  budget: TripBudgetBreakdown;
  recommendations: {
    packing: string[];
    localEtiquette: string[];
    bestPhotoSpots: string[];
    curatedFoodStops: string[];
  };
  weather: {
    tempAvgC: number;
    condition: string;
    forecast: string;
    humidity: string;
    uvIndex: string;
  };
  sources: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  thinkingSteps?: string[];
  suggestedActions?: {
    label: string;
    actionType: 'open_destination' | 'plan_trip' | 'view_hotel' | 'view_restaurant' | 'view_activity' | 'custom';
    payload?: any;
  }[];
  attachments?: {
    type: 'trip_preview' | 'hotel' | 'destination' | 'weather';
    data: any;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  currency: string;
  savedDestinationIds: string[];
  savedHotelIds: string[];
  savedRestaurantIds: string[];
  savedActivityIds: string[];
  savedTripIds: string[];
}
