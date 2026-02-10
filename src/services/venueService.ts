import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Venue = Database["public"]["Tables"]["venues"]["Row"];
// Define specific enum type for venue_type to avoid string errors
type VenueType = Database["public"]["Enums"]["venue_type"];

type VenueInsert = Database["public"]["Tables"]["venues"]["Insert"];
type VenueUpdate = Database["public"]["Tables"]["venues"]["Update"];

// Define return type for getVenues to match the transformation
export type VenueWithStats = Venue & {
  average_rating: number;
  review_count: number;
  venue_images: {
    id: string;
    image_url: string;
    display_order: number;
    is_primary: boolean;
  }[];
  reviews: {
    id: string;
    rating: number | null;
  }[];
};

/**
 * Generate URL-friendly slug from venue name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Get all venues with optional filters
 */
export async function getVenues(filters?: {
  country?: string;
  venue_type?: string;
  min_price?: number;
  max_price?: number;
}) {
  try {
    let query = supabase
      .from("venues")
      .select(`
        *,
        venue_images (
          id,
          image_url,
          display_order,
          is_primary
        ),
        reviews (
          id,
          rating
        )
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (filters?.country) {
      query = query.eq("country", filters.country);
    }

    if (filters?.venue_type) {
      query = query.eq("venue_type", filters.venue_type as VenueType);
    }

    if (filters?.min_price) {
      query = query.gte("price_per_night", filters.min_price);
    }

    if (filters?.max_price) {
      query = query.lte("price_per_night", filters.max_price);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate average ratings
    const venuesWithRatings = data?.map((venue) => {
      // Cast to any to handle the joined data structure temporarily
      const v = venue as any;
      const reviews = Array.isArray(v.reviews) ? v.reviews : [];
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length
        : 0;
      
      // Ensure venue_type is one of the allowed values or default to resort
      const validVenueType = ["hotel", "resort", "campground", "beach_club", "spa"].includes(v.venue_type) 
        ? v.venue_type 
        : "resort";

      return {
        ...v,
        average_rating: avgRating,
        review_count: reviews.length,
        venue_type: validVenueType,
      };
    }) || [];

    return { venues: venuesWithRatings as VenueWithStats[], error: null };
  } catch (error: any) {
    console.error("getVenues error:", error);
    return { venues: [], error: error.message };
  }
}

/**
 * Get venue reviews
 */
export async function getVenueReviews(venueId: string) {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq("venue_id", venueId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { reviews: data, error: null };
  } catch (error: any) {
    console.error("getVenueReviews error:", error);
    return { reviews: [], error: error.message };
  }
}

/**
 * Get venue by ID with all related data
 */
export async function getVenueById(id: string) {
  try {
    const { data, error } = await supabase
      .from("venues")
      .select(`
        *,
        venue_images (
          id,
          image_url,
          caption,
          display_order,
          is_primary
        ),
        reviews (
          id,
          rating,
          comment,
          created_at,
          profiles (
            full_name,
            avatar_url
          )
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    return { venue: data, error: null };
  } catch (error: any) {
    console.error("getVenueById error:", error);
    return { venue: null, error: error.message };
  }
}

/**
 * Get venue by slug
 */
export async function getVenueBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from("venues")
      .select(`
        *,
        venue_images (
          id,
          image_url,
          caption,
          display_order,
          is_primary
        ),
        reviews (
          id,
          rating,
          comment,
          created_at,
          profiles (
            full_name,
            avatar_url
          )
        )
      `)
      .eq("slug", slug)
      .single();

    if (error) throw error;

    return { venue: data, error: null };
  } catch (error: any) {
    console.error("getVenueBySlug error:", error);
    return { venue: null, error: error.message };
  }
}

/**
 * Get venues by owner ID
 */
export async function getVenuesByOwner(ownerId: string) {
  try {
    const { data, error } = await supabase
      .from("venues")
      .select(`
        *,
        venue_images (
          id,
          image_url,
          is_primary
        ),
        reviews (
          id,
          rating
        )
      `)
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { venues: data || [], error: null };
  } catch (error: any) {
    console.error("getVenuesByOwner error:", error);
    return { venues: [], error: error.message };
  }
}

/**
 * Create new venue (owner only)
 */
export async function createVenue(venue: Omit<VenueInsert, "slug" | "owner_id">) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Not authenticated");
    }

    const slug = generateSlug(venue.name);

    const { data, error } = await supabase
      .from("venues")
      .insert({
        ...venue,
        slug,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return { venue: data, error: null };
  } catch (error: any) {
    console.error("createVenue error:", error);
    return { venue: null, error: error.message };
  }
}

/**
 * Update venue
 */
export async function updateVenue(id: string, updates: VenueUpdate) {
  try {
    // If name is being updated, regenerate slug
    if (updates.name) {
      updates.slug = generateSlug(updates.name);
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("venues")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { venue: data, error: null };
  } catch (error: any) {
    console.error("updateVenue error:", error);
    return { venue: null, error: error.message };
  }
}

/**
 * Delete venue
 */
export async function deleteVenue(id: string) {
  try {
    const { error } = await supabase
      .from("venues")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { error: null };
  } catch (error: any) {
    console.error("deleteVenue error:", error);
    return { error: error.message };
  }
}

/**
 * Add images to venue
 */
export async function addVenueImages(venueId: string, images: { image_url: string; caption?: string; display_order?: number; is_primary?: boolean }[]) {
  try {
    const { data, error } = await supabase
      .from("venue_images")
      .insert(
        images.map((img) => ({
          venue_id: venueId,
          ...img,
        }))
      )
      .select();

    if (error) throw error;

    return { images: data, error: null };
  } catch (error: any) {
    console.error("addVenueImages error:", error);
    return { images: null, error: error.message };
  }
}

/**
 * Add review to venue
 */
export async function addReview(venueId: string, rating: number, comment?: string) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Not authenticated");
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        venue_id: venueId,
        user_id: user.id,
        rating,
        comment,
      })
      .select()
      .single();

    if (error) throw error;

    return { review: data, error: null };
  } catch (error: any) {
    console.error("addReview error:", error);
    return { review: null, error: error.message };
  }
}

/**
 * Get unique countries from venues
 */
export async function getCountries() {
  try {
    const { data, error } = await supabase
      .from("venues")
      .select("country")
      .eq("status", "active")
      .order("country", { ascending: true });

    if (error) throw error;

    const countries = [...new Set(data?.map(v => v.country) || [])];
    return { countries, error: null };
  } catch (error: any) {
    console.error("getCountries error:", error);
    return { countries: [], error: error.message };
  }
}

/**
 * Get unique venue types
 */
export async function getVenueTypes() {
  try {
    const { data, error } = await supabase
      .from("venues")
      .select("venue_type")
      .eq("status", "active")
      .order("venue_type", { ascending: true });

    if (error) throw error;

    const types = [...new Set(data?.map(v => v.venue_type) || [])];
    return { types, error: null };
  } catch (error: any) {
    console.error("getVenueTypes error:", error);
    return { types: [], error: error.message };
  }
}

/**
 * Create booking inquiry
 */
export async function createInquiry(inquiry: {
  venue_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  message: string;
}) {
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        ...inquiry,
        subject: "New Booking Inquiry", // Add default subject
        status: "pending"
      })
      .select()
      .single();

    if (error) throw error;

    return { inquiry: data, error: null };
  } catch (error: any) {
    console.error("createInquiry error:", error);
    return { inquiry: null, error: error.message };
  }
}