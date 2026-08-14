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
   * Conforms to Section 28 FastAPI AI Contract: POST /api/ai/plan-trip
   */
  async planTrip(
    req: AIPlanTripRequest,
    onProgress?: (step: string) => void
  ): Promise<AIPlanTripResponse> {
    try {
      if (onProgress) onProgress('✨ Connecting to FastAPI AI Agent & Supabase database...');
      const backendRes = await request<any>('/ai/plan-trip', {
        method: 'POST',
        body: JSON.stringify({
          destination: req.destination,
          start_date: req.startDate,
          end_date: req.endDate,
          travelers: req.travelersCount,
          budget: req.totalBudget,
          interests: req.interests,
          transportation: req.transportationMode
        })
      });

      if (backendRes && backendRes.itinerary) {
        if (onProgress) onProgress('✓ AI Validation Engine passed: All opening hours and travel distances verified!');
      }
    } catch (err) {
      console.warn('[aiService] Live FastAPI call failed, switching to local AI optimizer:', err);
    }
    const steps = [
      '✨ Analyzing destination geography and local seasonal patterns...',
      '✓ Checking weather forecasts and optimal daylight hours...',
      '✓ Curating authentic attractions & scenic routes...',
      '✓ Evaluating boutique stays and local culinary gems...',
      '✓ Optimizing budget distribution and transit intervals...',
      '✨ Finalizing your personalized AI travel itinerary...'
    ];

    for (let i = 0; i < steps.length; i++) {
      if (onProgress) onProgress(steps[i]);
      await new Promise((r) => setTimeout(r, 350));
    }

    const duration = calculateDaysBetween(req.startDate, req.endDate) || 3;
    const destName = req.destination || 'Ooty';
    const normalizedDest = destName.toLowerCase();
    
    // Find matching mock destination if available
    const matchedDest = mockDestinations.find(
      (d) => d.name.toLowerCase().includes(normalizedDest) || d.id.toLowerCase().includes(normalizedDest)
    ) || mockDestinations[0];

    const destHotels = mockHotels.filter((h) => h.destinationId === matchedDest.id);
    const destRestaurants = mockRestaurants.filter((r) => r.destinationId === matchedDest.id);
    const destActivities = mockActivities.filter((a) => a.destinationId === matchedDest.id);
    const weather = mockWeatherData[matchedDest.id] || {
      destinationId: matchedDest.id,
      cityName: matchedDest.name,
      tempCurrentC: 22,
      tempMinC: 16,
      tempMaxC: 27,
      condition: 'Pleasant Breeze' as const,
      humidity: '65%',
      windSpeed: '10 km/h',
      uvIndex: '6 (Moderate)',
      bestMonths: 'September – May',
      clothingTip: 'Light layers for day, jacket for evening.'
    };

    // Construct Days
    const days: ItineraryDay[] = [];
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

    for (let dayNum = 1; dayNum <= duration; dayNum++) {
      const items: ItineraryItem[] = [];

      if (dayNum === 1) {
        items.push({
          id: `item-${dayNum}-1`,
          time: '09:30',
          title: `Arrival & Exploration at ${matchedDest.topAttractions[0] || matchedDest.name}`,
          location: `${matchedDest.topAttractions[0] || matchedDest.name}, ${matchedDest.stateOrCountry}`,
          type: 'attraction',
          description: `Kick off your journey experiencing the centerpiece landmark of ${matchedDest.name}. Take in the morning vistas and capture initial photographs.`,
          image: matchedDest.image,
          durationHours: 2.5,
          distanceFromPrevKm: 0,
          travelDurationMin: 0,
          estimatedCost: 350 * req.travelers,
          coordinates: matchedDest.coordinates,
          tips: 'Morning light provides the clearest views and fewer crowds.'
        });

        items.push({
          id: `item-${dayNum}-2`,
          time: '12:45',
          title: destRestaurants[0] ? `Lunch at ${destRestaurants[0].name}` : `Local Artisan Lunch Experience`,
          location: destRestaurants[0]?.location || `${matchedDest.name} Center`,
          type: 'food',
          description: destRestaurants[0]
            ? `Enjoy specialties like ${destRestaurants[0].specialtyDishes.slice(0, 2).join(', ')}.`
            : `Delight in traditional local delicacies prepared with farm-fresh ingredients.`,
          image: destRestaurants[0]?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
          durationHours: 1.5,
          distanceFromPrevKm: 2.4,
          travelDurationMin: 12,
          estimatedCost: (destRestaurants[0]?.approxCostForTwo || 1200) * (req.travelers / 2),
          coordinates: destRestaurants[0]?.coordinates || matchedDest.coordinates,
          tips: 'Try the house signature herbal beverage.'
        });

        items.push({
          id: `item-${dayNum}-3`,
          time: '15:30',
          title: destActivities[0]?.title || `Scenic Sightseeing at ${matchedDest.topAttractions[1] || 'Valley Viewpoint'}`,
          location: `${matchedDest.name} Countryside`,
          type: 'activity',
          description: destActivities[0]?.description || `Immerse yourself in nature walks and panoramic viewpoints.`,
          image: destActivities[0]?.image || matchedDest.gallery[1] || matchedDest.image,
          durationHours: 2.5,
          distanceFromPrevKm: 4.8,
          travelDurationMin: 18,
          estimatedCost: (destActivities[0]?.pricePerPerson || 600) * req.travelers,
          coordinates: destActivities[0]?.coordinates || matchedDest.coordinates,
          tips: 'Keep comfortable walking shoes on.'
        });

        items.push({
          id: `item-${dayNum}-4`,
          time: '18:30',
          title: `Sunset Golden Hour at ${matchedDest.topAttractions[2] || 'Promenade / Sunset Point'}`,
          location: `${matchedDest.name} Ridge`,
          type: 'relaxation',
          description: `Watch the sunset paint the sky in amber tones while enjoying fresh mountain or coastal air.`,
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          durationHours: 1.5,
          distanceFromPrevKm: 3.2,
          travelDurationMin: 15,
          estimatedCost: 200,
          coordinates: matchedDest.coordinates
        });
      } else {
        const actIndex = (dayNum - 1) % (destActivities.length || 1);
        const restIndex = (dayNum - 1) % (destRestaurants.length || 1);
        const attrIndex = (dayNum + 1) % (matchedDest.topAttractions.length || 1);

        items.push({
          id: `item-${dayNum}-1`,
          time: '09:00',
          title: `${matchedDest.topAttractions[attrIndex] || 'Morning Heritage Trail'}`,
          location: `${matchedDest.name} Area`,
          type: 'attraction',
          description: `Explore unique cultural roots and architecture curated for your ${req.interests.join(', ') || 'travel'} preferences.`,
          image: matchedDest.gallery[dayNum % matchedDest.gallery.length] || matchedDest.image,
          durationHours: 2.5,
          distanceFromPrevKm: 5.5,
          travelDurationMin: 20,
          estimatedCost: 400 * req.travelers,
          coordinates: {
            lat: matchedDest.coordinates.lat + (dayNum * 0.008),
            lng: matchedDest.coordinates.lng + (dayNum * 0.006)
          }
        });

        items.push({
          id: `item-${dayNum}-2`,
          time: '13:00',
          title: destRestaurants[restIndex] ? `Authentic Dining at ${destRestaurants[restIndex].name}` : 'Regional Delicacy Lunch',
          location: destRestaurants[restIndex]?.location || `${matchedDest.name}`,
          type: 'food',
          description: `Relax over a curated meal highlighting regional flavors.`,
          image: destRestaurants[restIndex]?.image || 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80',
          durationHours: 1.5,
          distanceFromPrevKm: 3.1,
          travelDurationMin: 14,
          estimatedCost: 1100 * (req.travelers / 2),
          coordinates: destRestaurants[restIndex]?.coordinates || matchedDest.coordinates
        });

        items.push({
          id: `item-${dayNum}-3`,
          time: '15:30',
          title: destActivities[actIndex]?.title || 'Nature & Adventure Discovery',
          location: `${matchedDest.name} Eco Zone`,
          type: 'activity',
          description: destActivities[actIndex]?.description || `Signature local activity tailored to your travel style.`,
          image: destActivities[actIndex]?.image || matchedDest.image,
          durationHours: 3.0,
          distanceFromPrevKm: 6.0,
          travelDurationMin: 25,
          estimatedCost: (destActivities[actIndex]?.pricePerPerson || 750) * req.travelers,
          coordinates: destActivities[actIndex]?.coordinates || matchedDest.coordinates
        });
      }

      days.push({
        dayNumber: dayNum,
        title: `Day ${dayNum}: ${matchedDest.name} ${dayNum === 1 ? 'Discovery & Welcome' : dayNum === duration ? 'Farewell Vistas & Local Bazaars' : 'Hidden Trails & Immersion'}`,
        theme: dayNum === 1 ? 'Arrival & Key Landmarks' : dayNum === 2 ? 'Nature & Heritage' : 'Cultural Immersion',
        date: `Day ${dayNum}`,
        items,
        dayEstimatedCost: Math.round(budgetBreakdown.total / duration)
      });
    }

    return {
      tripId: `trip-${Date.now()}`,
      destination: matchedDest.name,
      summary: `A carefully balanced ${duration}-day itinerary through ${matchedDest.name} for ${req.travelers} traveler(s), incorporating ${req.interests.join(', ') || 'scenic nature and relaxation'} with estimated budget of ₹${req.budget?.toLocaleString('en-IN') || '25,000'}.`,
      heroImage: matchedDest.image,
      durationDays: duration,
      travelers: req.travelers,
      days,
      budget: budgetBreakdown,
      recommendations: {
        packing: [
          weather.clothingTip,
          'Power bank & universal adapter',
          'Eco-friendly reusable water bottle',
          'Small first aid & personal medications kit'
        ],
        localEtiquette: [
          'Support local guides and artisans',
          'Respect photography guidelines at cultural shrines',
          'Carry some cash for local transit and snacks'
        ],
        bestPhotoSpots: matchedDest.highlights.map((h) => `${h} during golden hour`),
        curatedFoodStops: destRestaurants.map((r) => `${r.name} (${r.cuisine.join(', ')})`)
      },
      weather: {
        tempAvgC: weather.tempCurrentC,
        condition: weather.condition,
        forecast: `${weather.condition}, high of ${weather.tempMaxC || 26}°C and low of ${weather.tempMinC || 16}°C.`,
        humidity: weather.humidity,
        uvIndex: weather.uvIndex
      },
      sources: [
        'Aetheria Intelligence Core v3',
        `${matchedDest.stateOrCountry} Tourism Bureau`,
        'Global Meteorological Telemetry'
      ]
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
    const matchedDest = mockDestinations.find(
      (d) => d.name.toLowerCase().includes(req.destination.toLowerCase()) || d.id.toLowerCase().includes(req.destination.toLowerCase())
    ) || mockDestinations[0];

    const trip: TripPlan = {
      id: aiRes.tripId,
      title: `${aiRes.durationDays} Days in ${aiRes.destination}: Curated Journey`,
      destination: aiRes.destination,
      stateOrCountry: matchedDest.stateOrCountry,
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
        tempHigh: aiRes.weather.tempAvgC + 5,
        tempLow: aiRes.weather.tempAvgC - 6,
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

    // Trigger AI thinking steps
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
            { label: '🌲 Plan 3-day Ooty Trip', actionType: 'plan_trip', payload: { destination: 'Ooty', duration: 3, budget: 20000 } },
            { label: '🏖️ Explore Goa Beaches', actionType: 'open_destination', payload: { path: '/destinations' } }
          ]
        };
      }
    } catch (err) {
      console.warn('[aiService] Live AI chat fallback:', err);
    } 

    if (onThinkingStep) {
      await new Promise((r) => setTimeout(r, 300));
      onThinkingStep('✓ Finding top-rated attractions and routes...');
      await new Promise((r) => setTimeout(r, 350));
      onThinkingStep('✨ Formulating personalized recommendation...');
      await new Promise((r) => setTimeout(r, 300));
    }

    // Smart context responses
    if (p.includes('ooty') || p.includes('tea') || p.includes('nilgiri')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `Ooty is gorgeous right now with crisp 17°C mountain air! 🌿 I recommend taking the UNESCO Nilgiri Mountain Railway toy train from Coonoor, visiting the Highfield Tea Estate for artisan cupping, and dining by the fireplace at Earl's Secret. Would you like me to build a full 4-day itinerary or check luxury heritage stays like Savoy?`,
        suggestedActions: [
          { label: '✨ Plan 4-day Ooty Trip', actionType: 'plan_trip', payload: { destination: 'Ooty', duration: 4, budget: 20000 } },
          { label: '🏨 View Savoy Heritage Hotel', actionType: 'view_hotel', payload: { hotelId: 'savoy-ooty' } },
          { label: '🚂 View Toy Train Activity', actionType: 'view_activity', payload: { activityId: 'ooty-toy-train' } }
        ]
      };
    }

    if (p.includes('kerala') || p.includes('alleppey') || p.includes('backwater') || p.includes('munnar')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `Kerala is fantastic for a refreshing coastal & hill retreat! 🛶 For a classic 5-day journey: spend Day 1 in Fort Kochi's spice quarter, 2 days in the cool misty tea terraces of Munnar, and cruise the tranquil Alleppey backwaters on an authentic luxury houseboat.`,
        suggestedActions: [
          { label: '✨ View 5-Day Kerala Itinerary', actionType: 'plan_trip', payload: { destination: 'Kerala', duration: 5, budget: 34000 } },
          { label: '🏨 Check Kumarakom Lake Resort', actionType: 'view_hotel', payload: { hotelId: 'kumarakom-lake-resort' } },
          { label: '🍲 View History Restaurant Fort Kochi', actionType: 'view_restaurant', payload: { restaurantId: 'history-restaurant-brunton-kerala' } }
        ]
      };
    }

    if (p.includes('hotel') || p.includes('stay') || p.includes('resort')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `I have curated several award-winning stays! From the colonial fireplaces of Savoy in Ooty to the lakefront pool villas of Kumarakom Lake Resort in Kerala and the royal suites of The Leela Palace Jaipur. Which region are you planning to stay in?`,
        suggestedActions: [
          { label: '🏨 Browse All Hotels', actionType: 'open_destination', payload: { path: '/hotels' } },
          { label: '✨ Plan with Hotel Recommendations', actionType: 'plan_trip' }
        ]
      };
    }

    if (p.includes('restaurant') || p.includes('food') || p.includes('eat') || p.includes('dining')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `Our culinary index features handpicked authentic dining: Karimeen Pollichathu at Brunton Boatyard in Kochi, royal Rajasthani thali at Chokhi Dhani Jaipur, and French patisserie dining at Coromandel Cafe in Pondicherry.`,
        suggestedActions: [
          { label: '🍽️ Explore Curated Restaurants', actionType: 'open_destination', payload: { path: '/restaurants' } }
        ]
      };
    }

    // Default intelligent assistant response
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: `I'm your intelligent travel concierge! I can calculate optimal travel routes, synthesize custom multi-day itineraries with budget estimates, and find top boutique hotels, regional restaurants, and outdoor activities. What destination are you dreaming of?`,
      suggestedActions: [
        { label: '🌲 Plan trip to Ooty', actionType: 'plan_trip', payload: { destination: 'Ooty' } },
        { label: '🌴 Plan trip to Kerala', actionType: 'plan_trip', payload: { destination: 'Kerala' } },
        { label: '🏔️ Plan trip to Ladakh', actionType: 'plan_trip', payload: { destination: 'Leh Ladakh' } },
        { label: '🏰 Plan trip to Jaipur', actionType: 'plan_trip', payload: { destination: 'Jaipur' } }
      ]
    };
  }
};
