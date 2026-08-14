/**
 * Utility to generate standard, free Google Maps Directions URLs for multi-stop itineraries.
 * Does NOT require any Google Maps API Key or billing account.
 */

export interface MapStop {
  latitude: number;
  longitude: number;
  name?: string;
}

export function generateGoogleMapsDirUrl(stops: MapStop[]): string {
  if (!stops || stops.length === 0) {
    return 'https://www.google.com/maps';
  }

  if (stops.length === 1) {
    const s = stops[0];
    return `https://www.google.com/maps/search/?api=1&query=${s.latitude},${s.longitude}`;
  }

  const origin = `${stops[0].latitude},${stops[0].longitude}`;
  const destination = `${stops[stops.length - 1].latitude},${stops[stops.length - 1].longitude}`;

  if (stops.length === 2) {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  }

  // Waypoints between origin and destination
  const intermediateStops = stops.slice(1, stops.length - 1);
  const waypointsStr = intermediateStops
    .map((s) => `${s.latitude},${s.longitude}`)
    .join('%7C'); // URL encoded pipe '|'

  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypointsStr}&travelmode=driving`;
}
