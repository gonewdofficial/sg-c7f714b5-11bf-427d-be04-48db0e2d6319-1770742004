import type { Database } from "@/integrations/supabase/types";

// Database types
export type Venue = Database["public"]["Tables"]["venues"]["Row"];
export type VenueImage = Database["public"]["Tables"]["venue_images"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];

// Extended types for UI
export interface VenueWithDetails extends Venue {
  venue_images?: VenueImage[];
  reviews?: Review[];
  average_rating?: number;
  review_count?: number;
}

export interface Property {
  id: string;
  name: string;
  slug: string;
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
  propertyType: string;
  naturistType: string;
  amenities: string[];
  features: string[];
  capacity: {
    guests: number;
    rooms: number;
  };
  availability: boolean;
  featured?: boolean;
  verified?: boolean;
  tags?: string[];
  bookingUrl?: string;
  websiteUrl?: string;
  reviews?: {
    id: string;
    author: string;
    rating: number;
    date: string;
    comment: string;
    verified?: boolean;
  }[];
}

export interface ReviewWithProfile extends Review {
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
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