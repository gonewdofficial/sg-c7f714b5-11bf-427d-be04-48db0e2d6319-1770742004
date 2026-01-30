import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Venue = Database["public"]["Tables"]["venues"]["Row"];
type VenueInsert = Database["public"]["Tables"]["venues"]["Insert"];
type VenueUpdate = Database["public"]["Tables"]["venues"]["Update"];

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
  accommodationType?: string;
}) {
  try {
    let query = supabase
      .from("venues")
      .select("*")
      .order("name", { ascending: true });

    if (filters?.country) {
      query = query.eq("country", filters.country);
    }

    if (filters?.accommodationType) {
      query = query.eq("accommodation_type", filters.accommodationType);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { venues: data || [], error: null };
  } catch (error: any) {
    return { venues: [], error: error.message };
  }
}

/**
 * Get venue by slug
 */
export async function getVenueBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;

    return { venue: data, error: null };
  } catch (error: any) {
    return { venue: null, error: error.message };
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

    return { reviews: data || [], error: null };
  } catch (error: any) {
    return { reviews: [], error: error.message };
  }
}

/**
 * Create new venue (admin only)
 */
export async function createVenue(venue: Omit<VenueInsert, "slug">) {
  try {
    const slug = generateSlug(venue.name);

    const { data, error } = await supabase
      .from("venues")
      .insert({
        ...venue,
        slug,
      })
      .select()
      .single();

    if (error) throw error;

    return { venue: data, error: null };
  } catch (error: any) {
    return { venue: null, error: error.message };
  }
}

/**
 * Update venue (admin only)
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
    return { venue: null, error: error.message };
  }
}

/**
 * Delete venue (admin only)
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
    return { error: error.message };
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
      .order("country", { ascending: true });

    if (error) throw error;

    const countries = [...new Set(data?.map(v => v.country) || [])];
    return { countries, error: null };
  } catch (error: any) {
    return { countries: [], error: error.message };
  }
}

/**
 * Get unique accommodation types
 */
export async function getAccommodationTypes() {
  try {
    const { data, error } = await supabase
      .from("venues")
      .select("accommodation_type")
      .order("accommodation_type", { ascending: true });

    if (error) throw error;

    const types = [...new Set(data?.map(v => v.accommodation_type) || [])];
    return { types, error: null };
  } catch (error: any) {
    return { types: [], error: error.message };
  }
}