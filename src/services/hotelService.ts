import { Hotel } from '../types';
import { mockHotels } from '../data/hotels';

export const hotelService = {
  async getAll(): Promise<Hotel[]> {
    await new Promise((r) => setTimeout(r, 80));
    return mockHotels;
  },

  async getAllHotels(): Promise<Hotel[]> {
    return this.getAll();
  },

  async getById(id: string): Promise<Hotel | null> {
    await new Promise((r) => setTimeout(r, 60));
    return mockHotels.find((h) => h.id === id) || null;
  },

  async getHotelById(id: string): Promise<Hotel | null> {
    return this.getById(id);
  },

  async getByDestination(destinationId: string): Promise<Hotel[]> {
    await new Promise((r) => setTimeout(r, 60));
    const term = destinationId.toLowerCase();
    return mockHotels.filter(
      (h) =>
        h.destinationId.toLowerCase() === term ||
        h.destinationName.toLowerCase().includes(term) ||
        h.location.toLowerCase().includes(term)
    );
  },

  async getHotelsByDestination(destinationId: string): Promise<Hotel[]> {
    return this.getByDestination(destinationId);
  },

  async filter(params: {
    destinationId?: string;
    category?: string;
    maxPrice?: number;
    minRating?: number;
    amenities?: string[];
  }): Promise<Hotel[]> {
    await new Promise((r) => setTimeout(r, 100));
    let list = [...mockHotels];

    if (params.destinationId && params.destinationId !== 'All' && params.destinationId !== 'all') {
      const term = params.destinationId.toLowerCase();
      list = list.filter(
        (h) => h.destinationId.toLowerCase() === term || h.destinationName.toLowerCase().includes(term)
      );
    }
    if (params.category && params.category !== 'All') {
      list = list.filter((h) => h.category === params.category);
    }
    if (params.maxPrice) {
      const max = params.maxPrice;
      list = list.filter((h) => h.pricePerNight <= max);
    }
    if (params.minRating) {
      const min = params.minRating;
      list = list.filter((h) => h.rating >= min);
    }
    if (params.amenities && params.amenities.length > 0) {
      list = list.filter((h) =>
        params.amenities!.every((reqAmenity) =>
          h.amenities.some((a) => a.toLowerCase().includes(reqAmenity.toLowerCase()))
        )
      );
    }
    return list;
  }
};
