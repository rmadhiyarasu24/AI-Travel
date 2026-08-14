import { Activity, TripPlan } from '../types';
import { mockActivities } from '../data/activities';
import { mockSampleTrips } from '../data/sampleTrips';

const LOCAL_STORAGE_KEY_TRIPS = 'aetheria_saved_trips';

export const travelService = {
  async getActivities(destinationId?: string): Promise<Activity[]> {
    await new Promise((r) => setTimeout(r, 80));
    if (destinationId && destinationId !== 'all') {
      return mockActivities.filter((a) => a.destinationId === destinationId);
    }
    return mockActivities;
  },

  async getActivityById(id: string): Promise<Activity | null> {
    await new Promise((r) => setTimeout(r, 60));
    return mockActivities.find((a) => a.id === id) || null;
  },

  async filterActivities(params: {
    destinationId?: string;
    category?: string;
    maxPrice?: number;
    difficulty?: string;
  }): Promise<Activity[]> {
    await new Promise((r) => setTimeout(r, 80));
    let list = [...mockActivities];
    if (params.destinationId && params.destinationId !== 'all') {
      list = list.filter((a) => a.destinationId === params.destinationId);
    }
    if (params.category && params.category !== 'All') {
      list = list.filter((a) => a.category === params.category);
    }
    if (params.maxPrice) {
      const max = params.maxPrice;
      list = list.filter((a) => a.pricePerPerson <= max);
    }
    if (params.difficulty && params.difficulty !== 'All') {
      list = list.filter((a) => a.difficulty === params.difficulty);
    }
    return list;
  },

  // Trip Plans Management
  async getSavedTrips(): Promise<TripPlan[]> {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TRIPS);
      if (saved) {
        const parsed: TripPlan[] = JSON.parse(saved);
        // Combine with default sample trips if not present
        const combined = [...parsed];
        mockSampleTrips.forEach((st) => {
          if (!combined.some((t) => t.id === st.id)) {
            combined.push(st);
          }
        });
        return combined;
      }
    } catch {
      // fallback
    }
    return mockSampleTrips;
  },

  async getTripById(id: string): Promise<TripPlan | null> {
    const all = await this.getSavedTrips();
    return all.find((t) => t.id === id) || null;
  },

  async saveTrip(trip: TripPlan): Promise<void> {
    const current = await this.getSavedTrips();
    const existingIndex = current.findIndex((t) => t.id === trip.id);
    let updated: TripPlan[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = trip;
    } else {
      updated = [trip, ...current];
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_TRIPS, JSON.stringify(updated));
  },

  async deleteTrip(tripId: string): Promise<void> {
    const current = await this.getSavedTrips();
    const updated = current.filter((t) => t.id !== tripId);
    localStorage.setItem(LOCAL_STORAGE_KEY_TRIPS, JSON.stringify(updated));
  }
};
