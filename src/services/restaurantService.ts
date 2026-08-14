import { Restaurant } from '../types';
import { mockRestaurants } from '../data/restaurants';

export const restaurantService = {
  async getAll(): Promise<Restaurant[]> {
    await new Promise((r) => setTimeout(r, 80));
    return mockRestaurants;
  },

  async getAllRestaurants(): Promise<Restaurant[]> {
    return this.getAll();
  },

  async getById(id: string): Promise<Restaurant | null> {
    await new Promise((r) => setTimeout(r, 60));
    return mockRestaurants.find((r) => r.id === id) || null;
  },

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    return this.getById(id);
  },

  async getByDestination(destId: string): Promise<Restaurant[]> {
    await new Promise((r) => setTimeout(r, 60));
    const term = destId.toLowerCase();
    return mockRestaurants.filter(
      (r) =>
        r.destinationId.toLowerCase() === term ||
        r.destinationName.toLowerCase().includes(term) ||
        r.location.toLowerCase().includes(term)
    );
  },

  async getRestaurantsByDestination(destId: string): Promise<Restaurant[]> {
    return this.getByDestination(destId);
  },

  async filter(params: {
    destinationId?: string;
    cuisine?: string;
    priceRange?: string;
    vegetarianOnly?: boolean;
    veganOnly?: boolean;
    veganFriendlyOnly?: boolean;
    familyFriendlyOnly?: boolean;
  }): Promise<Restaurant[]> {
    await new Promise((r) => setTimeout(r, 100));
    let list = [...mockRestaurants];

    if (params.destinationId && params.destinationId !== 'all' && params.destinationId !== 'All') {
      const term = params.destinationId.toLowerCase();
      list = list.filter(
        (r) => r.destinationId.toLowerCase() === term || r.destinationName.toLowerCase().includes(term)
      );
    }
    if (params.cuisine && params.cuisine !== 'All') {
      list = list.filter((r) => r.cuisine.some((c) => c.toLowerCase().includes(params.cuisine!.toLowerCase())));
    }
    if (params.priceRange && params.priceRange !== 'All') {
      list = list.filter((r) => r.priceRange === params.priceRange);
    }
    if (params.vegetarianOnly) {
      list = list.filter((r) => r.isVegetarian);
    }
    if (params.veganOnly || params.veganFriendlyOnly) {
      list = list.filter((r) => r.isVeganFriendly);
    }
    if (params.familyFriendlyOnly) {
      list = list.filter((r) => r.isFamilyFriendly);
    }
    return list;
  }
};
