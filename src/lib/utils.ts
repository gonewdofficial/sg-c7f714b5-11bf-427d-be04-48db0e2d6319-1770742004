import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVenueCoordinates(venue: any) {
  if (venue.lat && venue.lng) {
    return { lat: venue.lat, lng: venue.lng };
  }
  
  if (venue.latitude && venue.longitude) {
    return { lat: venue.latitude, lng: venue.longitude };
  }

  // Fallback to country coordinates if available
  if (venue.country) {
    return getCountryCoordinates(venue.country);
  }

  return { lat: 0, lng: 0 };
}

export function getCountryCoordinates(country: string) {
  const coordinates: Record<string, { lat: number; lng: number }> = {
    "France": { lat: 46.2276, lng: 2.2137 },
    "Spain": { lat: 40.4637, lng: -3.7492 },
    "United States": { lat: 37.0902, lng: -95.7129 },
    "Austria": { lat: 47.5162, lng: 14.5501 },
    "Portugal": { lat: 39.3999, lng: -8.2245 },
    "Greece": { lat: 39.0742, lng: 21.8243 },
    "Australia": { lat: -25.2744, lng: 133.7751 },
    "Brazil": { lat: -14.2350, lng: -51.9253 },
    "Croatia": { lat: 45.1, lng: 15.2 },
    "Thailand": { lat: 15.8700, lng: 100.9925 },
    "Switzerland": { lat: 46.8182, lng: 8.2275 },
    "Germany": { lat: 51.1657, lng: 10.4515 },
    "Italy": { lat: 41.8719, lng: 12.5674 },
    "Netherlands": { lat: 52.1326, lng: 5.2913 },
    "United Kingdom": { lat: 55.3781, lng: -3.4360 },
    "Canada": { lat: 56.1304, lng: -106.3468 },
    "Mexico": { lat: 23.6345, lng: -102.5528 },
    "Argentina": { lat: -38.4161, lng: -63.6167 },
    "South Africa": { lat: -30.5595, lng: 22.9375 },
    "New Zealand": { lat: -40.9006, lng: 174.8860 }
  };

  return coordinates[country] || { lat: 0, lng: 0 };
}