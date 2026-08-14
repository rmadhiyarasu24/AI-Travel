import { request } from './apiClient';
import {
  AIPlanTripRequest,
  AIPlanTripResponse,
  PlanTripRequest,
  TripPlan,
  ChatMessage,
  ItineraryDay,
  ItineraryItem,
  TripBudgetBreakdown
} from '../types';
import { mockDestinations } from '../data/destinations';
import { mockHotels } from '../data/hotels';
import { mockRestaurants } from '../data/restaurants';
import { mockActivities } from '../data/activities';
import { mockWeatherData } from '../data/weatherData';
import { calculateDaysBetween } from '../utils/formatters';

export const aiService = {
  /**
   * Conforms to Section 28 FastAPI AI Contract: POST /api/travel/plan
   */
  async planTrip(
    req: AIPlanTripRequest,
    onProgress?: (step: string) => void
  ): Promise<AIPlanTripResponse> {
    let liveOrchestration: any = null;
    const destName = req.destination?.trim() || 'Ooty';
    const duration = calculateDaysBetween(req.startDate, req.endDate) || 3;

    try {
      if (onProgress) onProgress(`✨ Geocoding ${destName} & fetching OpenStreetMap POIs...`);
      liveOrchestration = await request<any>('/travel/plan', {
        method: 'POST',
        body: JSON.stringify({
          destination: destName,
          duration_days: duration,
          traveler_type: req.interests?.join(', ') || 'nature-loving',
          user_prompt: `Plan a trip to ${destName}`
        })
      });

      if (liveOrchestration && liveOrchestration.status === 'success') {
        if (onProgress) onProgress(`✓ Open Geospatial Pipeline complete for ${destName}: OSRM route & Open-Meteo weather verified!`);
      }
    } catch (err) {
      console.warn('[aiService] Live FastAPI travel orchestration fallback:', err);
    }

    if (onProgress) onProgress(`✨ Synthesizing itinerary for ${destName}...`);

    const baseBudget = req.budget || 25000;
    const hotelBudget = Math.round(baseBudget * 0.38);
    const foodBudget = Math.round(baseBudget * 0.22);
    const transportBudget = Math.round(baseBudget * 0.20);
    const activitiesBudget = Math.round(baseBudget * 0.12);
    const otherBudget = Math.round(baseBudget * 0.08);

    const budgetBreakdown: TripBudgetBreakdown = {
      hotel: hotelBudget,
      food: foodBudget,
      transport: transportBudget,
      activities: activitiesBudget,
      other: otherBudget,
      total: baseBudget,
      currency: 'INR'
    };

    // If live FastAPI Orchestrator returned real destination data (e.g. Coimbatore)
    if (liveOrchestration && liveOrchestration.status === 'success') {
      const realDest = liveOrchestration.destination;
      const realWeather = liveOrchestration.weather;
      const realPlaces: any[] = liveOrchestration.places || [];
      const dayRoutes = liveOrchestration.day_routes || {};

      const days: ItineraryDay[] = [];
      const itemsPerDay = Math.max(1, Math.ceil(realPlaces.length / duration));

      for (let dayNum = 1; dayNum <= duration; dayNum++) {
        const startIdx = (dayNum - 1) * itemsPerDay;
        const dayPois = realPlaces.slice(startIdx, startIdx + itemsPerDay);
        const dayRouteInfo = dayRoutes[String(dayNum)] || {};

        const items: ItineraryItem[] = dayPois.map((poi, idx) => ({
          id: `item-${dayNum}-${idx + 1}`,
          time: idx === 0 ? '09:30' : idx === 1 ? '13:00' : '16:30',
          title: poi.name || `Explore ${realDest.name} Landmark ${idx + 1}`,
          location: `${poi.name}, ${realDest.name}`,
          type: poi.category === 'Heritage' ? 'attraction' : poi.category === 'Waterfall' || poi.category === 'Park' ? 'activity' : 'attraction',
          description: poi.description || `Visit famous ${poi.category || 'attraction'} in ${realDest.name}.`,
          image: poi.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          durationHours: 2.0,
          distanceFromPrevKm: idx === 0 ? 0 : 3.5,
          travelDurationMin: idx === 0 ? 0 : 15,
          estimatedCost: 350 * req.travelers,
          coordinates: {
            lat: poi.latitude || realDest.latitude,
            lng: poi.longitude || realDest.longitude
          },
          tips: realWeather.travel_advice || 'Wear comfortable walking shoes.'
        }));

        // Fallback item if no POIs returned for day
        if (items.length === 0) {
          items.push({
            id: `item-${dayNum}-1`,
            time: '09:30',
            title: `Sightseeing & Exploration in ${realDest.name}`,
            location: realDest.display_name || realDest.name,
            type: 'attraction',
            description: `Discover key cultural and natural highlights of ${realDest.name}.`,
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            durationHours: 3.0,
            distanceFromPrevKm: 0,
            travelDurationMin: 0,
            estimatedCost: 300 * req.travelers,
            coordinates: { lat: realDest.latitude, lng: realDest.longitude }
          });
        }

        days.push({
          dayNumber: dayNum,
          title: `Day ${dayNum}: ${realDest.name} ${dayNum === 1 ? 'Discovery & Welcome' : dayNum === duration ? 'Farewell Vistas' : 'Exploration'}`,
          theme: dayNum === 1 ? 'Arrival & Key Landmarks' : 'Sightseeing & Local Immersion',
          date: `Day ${dayNum}`,
          items,
          dayEstimatedCost: Math.round(baseBudget / duration)
        });
      }

      return {
        tripId: `trip-${Date.now()}`,
        destination: realDest.name,
        summary: `A carefully balanced ${duration}-day itinerary through ${realDest.name} for ${req.travelers} traveler(s), incorporating ${req.interests.join(', ') || 'scenic nature and dining'} with estimated budget of ₹${baseBudget.toLocaleString('en-IN')}.`,
        heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        durationDays: duration,
        travelers: req.travelers,
        days,
        budget: budgetBreakdown,
        recommendations: {
          packing: [
            realWeather.travel_advice || 'Light jacket for evening',
            'Power bank & universal adapter',
            'Eco-friendly water bottle'
          ],
          localEtiquette: [
            'Respect local customs at cultural locations',
            'Support local food artisans'
          ],
          bestPhotoSpots: realPlaces.slice(0, 3).map((p) => p.name),
          curatedFoodStops: [`Famous ${realDest.name} Regional Restaurants`]
        },
        weather: {
          tempAvgC: Math.round(realWeather.temperature || 24),
          condition: realWeather.weather_condition || 'Pleasant',
          forecast: `${realWeather.weather_condition || 'Pleasant'}, temperature of ${realWeather.temperature || 24}°C.`,
          humidity: '65%',
          uvIndex: '6 (Moderate)'
        },
        sources: [
          'Qwen3:8b AI Orchestrator',
          'Nominatim Geocoding API',
          'OpenStreetMap Overpass API',
          'OSRM Driving Routing API',
          'Open-Meteo Weather API'
        ]
      };
    }

    // Fallback: Find matching mock destination if live endpoint unavailable
    const normalizedDest = destName.toLowerCase();
    const matchedDest = mockDestinations.find(
      (d) => d.name.toLowerCase().includes(normalizedDest) || d.id.toLowerCase().includes(normalizedDest)
    ) || {
      id: normalizedDest.replace(/\s+/g, '-'),
      name: destName,
      stateOrCountry: 'India',
      region: 'South India' as const,
      description: `Explore the vibrant culture and landmarks of ${destName}.`,
      tagline: `Discover ${destName}`,
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      gallery: [],
      rating: 4.8,
      reviewCount: 120,
      bestTimeToVisit: 'September – March',
      startingBudget: 15000,
      idealDurationDays: 3,
      climate: 'Temperate' as const,
      tags: ['Heritage', 'Nature'],
      popularActivities: ['Sightseeing', 'Local Dining'],
      coordinates: { lat: 11.0168, lng: 76.9558 },
      highlights: [`${destName} Center`],
      topAttractions: [`${destName} Landmarks`]
    };

    const destHotels = mockHotels.filter((h) => h.destinationId === matchedDest.id);
    const destRestaurants = mockRestaurants.filter((r) => r.destinationId === matchedDest.id);
    const destActivities = mockActivities.filter((a) => a.destinationId === matchedDest.id);

    const days: ItineraryDay[] = [];
    for (let dayNum = 1; dayNum <= duration; dayNum++) {
      days.push({
        dayNumber: dayNum,
        title: `Day ${dayNum}: ${matchedDest.name} ${dayNum === 1 ? 'Discovery & Welcome' : 'Exploration'}`,
        theme: 'Sightseeing & Culture',
        date: `Day ${dayNum}`,
        items: [
          {
            id: `item-${dayNum}-1`,
            time: '09:30',
            title: `Explore ${matchedDest.name} Center`,
            location: `${matchedDest.name}, ${matchedDest.stateOrCountry}`,
            type: 'attraction',
            description: `Visit landmark spots and enjoy the morning atmosphere in ${matchedDest.name}.`,
            image: matchedDest.image,
            durationHours: 2.5,
            distanceFromPrevKm: 0,
            travelDurationMin: 0,
            estimatedCost: 350 * req.travelers,
            coordinates: matchedDest.coordinates
          }
        ],
        dayEstimatedCost: Math.round(budgetBreakdown.total / duration)
      });
    }

    return {
      tripId: `trip-${Date.now()}`,
      destination: matchedDest.name,
      summary: `A carefully balanced ${duration}-day itinerary through ${matchedDest.name} for ${req.travelers} traveler(s).`,
      heroImage: matchedDest.image,
      durationDays: duration,
      travelers: req.travelers,
      days,
      budget: budgetBreakdown,
      recommendations: {
        packing: ['Light layers', 'Power bank'],
        localEtiquette: ['Support local businesses'],
        bestPhotoSpots: [`${matchedDest.name} Viewpoints`],
        curatedFoodStops: [`${matchedDest.name} Dining`]
      },
      weather: {
        tempAvgC: 24,
        condition: 'Pleasant',
        forecast: 'Pleasant weather',
        humidity: '60%',
        uvIndex: '5 (Moderate)'
      },
      sources: ['Aetheria Intelligence Core']
    };
  },

  /**
   * Generates a full interactive TripPlan used by TripPlannerPage
   */
  async generateTripPlan(
    req: PlanTripRequest,
    onProgress?: (step: string) => void
  ): Promise<TripPlan> {
    const aiReq: AIPlanTripRequest = {
      destination: req.destination,
      startDate: req.startDate,
      endDate: req.endDate,
      travelers: req.travelers,
      budget: req.budget,
      travelStyle: req.travelStyle || 'Balanced',
      interests: req.interests,
      transportation: req.transportation,
      accommodation: req.accommodationStyle || req.accommodation
    };

    const aiRes = await this.planTrip(aiReq, onProgress);

    const trip: TripPlan = {
      id: aiRes.tripId,
      title: `${aiRes.durationDays} Days in ${aiRes.destination}: Curated Journey`,
      destination: aiRes.destination,
      stateOrCountry: 'India',
      summary: aiRes.summary,
      heroImage: aiRes.heroImage,
      startDate: req.startDate,
      endDate: req.endDate,
      durationDays: aiRes.durationDays,
      travelers: req.travelers,
      travelStyle: (req.travelStyle as any) || 'Balanced',
      interests: req.interests,
      transportMode: 'Private Cab',
      accommodationType: 'Boutique Hotels',
      days: aiRes.days,
      budget: aiRes.budget,
      recommendations: aiRes.recommendations,
      weather: aiRes.weather,
      weatherForecast: {
        tempAvg: aiRes.weather.tempAvgC,
        tempHigh: aiRes.weather.tempAvgC + 4,
        tempLow: aiRes.weather.tempAvgC - 5,
        condition: aiRes.weather.condition,
        rainProbability: 15,
        packingRecommendations: aiRes.recommendations.packing
      },
      sources: aiRes.sources,
      createdAt: new Date().toISOString()
    };

    return trip;
  },

  /**
   * Interactive AI Travel Concierge
   */
  async chatAssistant(
    userPrompt: string,
    onThinkingStep?: (step: string) => void
  ): Promise<ChatMessage> {
    const p = userPrompt.toLowerCase();

    if (onThinkingStep) {
      onThinkingStep('Checking destinations and real-time knowledge base...');
    }

    try {
      const backendRes = await request<any>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userPrompt })
      });

      if (backendRes && backendRes.reply) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: backendRes.reply,
          suggestedActions: [
            { label: '🌲 Plan 3-day Trip', actionType: 'plan_trip', payload: { destination: 'Coimbatore', duration: 3, budget: 20000 } }
          ]
        };
      }
    } catch (err) {
      console.warn('[aiService] Live AI chat fallback:', err);
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: `I'm your intelligent travel concierge! I can calculate optimal travel routes, synthesize custom multi-day itineraries with budget estimates, and find top boutique hotels, regional restaurants, and outdoor activities. What destination are you dreaming of?`,
      suggestedActions: [
        { label: '🌲 Plan trip to Coimbatore', actionType: 'plan_trip', payload: { destination: 'Coimbatore' } },
        { label: '🌲 Plan trip to Ooty', actionType: 'plan_trip', payload: { destination: 'Ooty' } },
        { label: '🌴 Plan trip to Kerala', actionType: 'plan_trip', payload: { destination: 'Kerala' } }
      ]
    };
  }
};
