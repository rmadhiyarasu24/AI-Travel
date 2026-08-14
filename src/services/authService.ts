import { UserProfile } from '../types';

const USER_PROFILE_KEY = 'aetheria_user_profile';

const defaultUserProfile: UserProfile = {
  id: 'usr_madhiyarasu_01',
  name: 'Madhiyarasu',
  email: 'rmadhiyarasu0803@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  currency: 'INR',
  savedDestinationIds: ['ooty', 'kerala'],
  savedHotelIds: ['savoy-ooty', 'kumarakom-lake-resort'],
  savedRestaurantIds: ['earls-secret-ooty', 'history-restaurant-brunton-kerala'],
  savedActivityIds: ['ooty-toy-train', 'kerala-houseboat-cruise'],
  savedTripIds: ['kerala-5day-explorer']
};

export const authService = {
  getCurrentUser(): UserProfile {
    try {
      const stored = localStorage.getItem(USER_PROFILE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return defaultUserProfile;
  },

  updateCurrentUser(updates: Partial<UserProfile>): UserProfile {
    const current = this.getCurrentUser();
    const updated = { ...current, ...updates };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
    return updated;
  }
};
