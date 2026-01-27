export interface Property {
  id: string;
  name: string;
  description: string;
  location: {
    city: string;
    country: string;
    region: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  price: {
    perNight: number;
    currency: string;
  };
  rating: number;
  reviewCount: number;
  propertyType: "hotel" | "resort" | "campsite" | "villa" | "bungalow";
  naturistType: "clothing-optional" | "fully-naturist" | "naturist-friendly";
  amenities: string[];
  features: string[];
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

export interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  createdAt: string;
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