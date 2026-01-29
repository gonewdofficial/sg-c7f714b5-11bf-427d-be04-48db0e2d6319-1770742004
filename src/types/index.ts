export interface Property {
  id: string;
  name: string;
  description: string;
  location: {
    city: string;
    country: string;
    region: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  price: {
    perNight: number;
    perWeek?: number;
    currency: string;
  };
  rating: number;
  reviewCount: number;
  propertyType: "hotel" | "resort" | "campsite" | "villa" | "bungalow" | "eco-lodge" | "beach-club" | "chalet";
  naturistType: "clothing-optional" | "fully-naturist" | "naturist-friendly";
  amenities: string[];
  features: string[]; // Admin managed tags
  capacity: {
    guests: number;
    rooms: number;
  };
  availability: boolean;
  featured?: boolean;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

// Admin managed configuration types
export interface AdminTag {
  id: string;
  label: string;
  category: "amenity" | "feature" | "naturistType";
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "guest" | "owner";
  favorites: string[];
  createdAt: string;
}

export interface SearchFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  priceMin?: number;
  priceMax?: number;
  propertyType?: string[];
  naturistType?: string[];
  amenities?: string[];
  rating?: number;
}