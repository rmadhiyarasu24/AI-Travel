import { Activity } from '../types';
import { mockActivities } from '../data/activities';

export const activityService = {
  async getAll(): Promise<Activity[]> {
    await new Promise((r) => setTimeout(r, 80));
    return mockActivities;
  },

  async getAllActivities(): Promise<Activity[]> {
    return this.getAll();
  },

  async getById(id: string): Promise<Activity | null> {
    await new Promise((r) => setTimeout(r, 60));
    return mockActivities.find((a) => a.id === id) || null;
  },

  async getActivityById(id: string): Promise<Activity | null> {
    return this.getById(id);
  },

  async getByDestination(dest: string): Promise<Activity[]> {
    await new Promise((r) => setTimeout(r, 60));
    const term = dest.toLowerCase();
    return mockActivities.filter(
      (a) => a.destinationId.toLowerCase() === term || a.destinationName.toLowerCase().includes(term)
    );
  },

  async getActivitiesByDestination(dest: string): Promise<Activity[]> {
    return this.getByDestination(dest);
  },

  async filter(params: {
    destination?: string;
    category?: string;
    maxPrice?: number;
    minRating?: number;
  }): Promise<Activity[]> {
    await new Promise((r) => setTimeout(r, 100));
    let list = [...mockActivities];

    if (params.destination && params.destination !== 'All') {
      const d = params.destination.toLowerCase();
      list = list.filter(
        (a) => a.destinationId.toLowerCase() === d || a.destinationName.toLowerCase().includes(d)
      );
    }

    if (params.category && params.category !== 'All') {
      list = list.filter((a) => a.category.toLowerCase().includes(params.category!.toLowerCase()));
    }

    if (params.maxPrice) {
      list = list.filter((a) => a.pricePerPerson <= params.maxPrice!);
    }

    if (params.minRating) {
      list = list.filter((a) => a.rating >= params.minRating!);
    }

    return list;
  }
};
