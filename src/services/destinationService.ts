import { Destination } from '../types';
import { mockDestinations } from '../data/destinations';

export const destinationService = {
  async getAll(): Promise<Destination[]> {
    // Simulates slight network latency
    await new Promise((r) => setTimeout(r, 80));
    return mockDestinations;
  },

  async getAllDestinations(): Promise<Destination[]> {
    return this.getAll();
  },

  async getById(id: string): Promise<Destination | null> {
    await new Promise((r) => setTimeout(r, 60));
    const normalized = id.toLowerCase();
    const dest = mockDestinations.find(
      (d) => d.id.toLowerCase() === normalized || d.name.toLowerCase() === normalized
    );
    return dest || null;
  },

  async getDestinationById(id: string): Promise<Destination | null> {
    return this.getById(id);
  },

  async search(query: string, region?: string): Promise<Destination[]> {
    await new Promise((r) => setTimeout(r, 80));
    let results = [...mockDestinations];
    
    if (region && region !== 'All') {
      results = results.filter((d) => d.region === region);
    }
    
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.stateOrCountry.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)) ||
          d.popularActivities.some((a) => a.toLowerCase().includes(q))
      );
    }
    return results;
  }
};
