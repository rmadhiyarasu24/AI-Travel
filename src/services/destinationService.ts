import { Destination } from '../types';
import { mockDestinations } from '../data/destinations';
import { request } from './apiClient';

export const destinationService = {
  async getAll(): Promise<Destination[]> {
    try {
      const liveData = await request<any[]>('/destinations');
      if (liveData && Array.isArray(liveData) && liveData.length > 0) {
        return liveData.map((d): Destination => ({
          id: d.id,
          name: d.name,
          stateOrCountry: d.location,
          region: (d.category === 'Beach' ? 'South India' : (d.category === 'Cultural' ? 'International' : 'South India')) as any,
          description: d.description,
          tagline: d.description ? (d.description.slice(0, 60) + '...') : 'Scenic destination',
          image: d.image_url || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
          gallery: [d.image_url || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'],
          rating: Number(d.rating) || 4.5,
          reviewCount: 128,
          bestTimeToVisit: d.best_time_to_visit || 'Year-round',
          startingBudget: Number(d.average_daily_cost) || 3500,
          idealDurationDays: 3,
          climate: 'Cool / Mountain',
          tags: [d.category || 'Nature', 'Popular'],
          popularActivities: ['Sightseeing', 'Photography', 'Boating'],
          coordinates: d.coordinates || { lat: 11.4102, lng: 76.695 },
          highlights: ['Scenic Views', 'Local Culture', 'Culinary Experiences'],
          topAttractions: ['Central Park', 'Historical Museum', 'Scenic Lookout']
        }));
      }
    } catch (err) {
      console.warn('Using local fallback for destinations:', err);
    }
    return mockDestinations;
  },

  async getAllDestinations(): Promise<Destination[]> {
    return this.getAll();
  },

  async getById(id: string): Promise<Destination | null> {
    const list = await this.getAll();
    const normalized = id.toLowerCase();
    const dest = list.find(
      (d) => d.id.toLowerCase() === normalized || d.name.toLowerCase() === normalized
    );
    return dest || null;
  },

  async getDestinationById(id: string): Promise<Destination | null> {
    return this.getById(id);
  },

  async search(query: string, region?: string): Promise<Destination[]> {
    let results = await this.getAll();
    if (region && region !== 'All') {
      results = results.filter((d) => d.region === region);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.stateOrCountry.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return results;
  }
};
