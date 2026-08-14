export interface MapRoutePoint {
  lat: number;
  lng: number;
  title: string;
  type: string;
  order: number;
  time?: string;
  dayNumber?: number;
}

export const mapService = {
  calculateEstimatedDistanceKm(points: { lat: number; lng: number }[]): number {
    if (points.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      // Haversine formula
      const R = 6371; // km
      const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
      const dLon = ((p2.lng - p1.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((p1.lat * Math.PI) / 180) *
          Math.cos((p2.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      total += R * c;
    }
    return Math.round(total * 10) / 10;
  }
};
