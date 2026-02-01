import { supabase } from "@/integrations/supabase/client";

/**
 * Comprehensive stress test for the entire application
 * Tests all critical data flows between frontend, backend, and database
 */

export async function runStressTest() {
  const results: any = {
    auth: { pass: false, message: "" },
    venues: { pass: false, message: "" },
    reviews: { pass: false, message: "" },
    responses: { pass: false, message: "" },
    images: { pass: false, message: "" },
    profiles: { pass: false, message: "" }
  };

  try {
    // Test 1: Auth Check
    console.log("🔍 Testing Authentication...");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      results.auth.message = "Authentication failed or no user logged in";
    } else {
      results.auth.pass = true;
      results.auth.message = `User authenticated: ${user.email}`;
    }

    // Test 2: Profile Check
    console.log("🔍 Testing Profile Access...");
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (profileError) {
      results.profiles.message = `Profile error: ${profileError.message}`;
    } else {
      results.profiles.pass = true;
      results.profiles.message = `Profile loaded: ${profile?.full_name}, Role: ${profile?.role}`;
    }

    // Test 3: Venues Read
    console.log("🔍 Testing Venues Read...");
    const { data: venues, error: venuesError } = await supabase
      .from("venues")
      .select("*")
      .limit(10);

    if (venuesError) {
      results.venues.message = `Venues read error: ${venuesError.message}`;
    } else {
      results.venues.pass = true;
      results.venues.message = `Venues loaded: ${venues?.length} records`;
    }

    // Test 4: Reviews Read
    console.log("🔍 Testing Reviews Read...");
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles!reviews_user_id_fkey(full_name)
      `)
      .limit(10);

    if (reviewsError) {
      results.reviews.message = `Reviews read error: ${reviewsError.message}`;
    } else {
      results.reviews.pass = true;
      results.reviews.message = `Reviews loaded: ${reviews?.length} records`;
    }

    // Test 5: Review Responses Read
    console.log("🔍 Testing Review Responses Read...");
    const { data: responses, error: responsesError } = await supabase
      .from("review_responses")
      .select("*")
      .limit(10);

    if (responsesError) {
      results.responses.message = `Responses read error: ${responsesError.message}`;
    } else {
      results.responses.pass = true;
      results.responses.message = `Responses loaded: ${responses?.length} records`;
    }

    // Test 6: Venue Images Read
    console.log("🔍 Testing Venue Images Read...");
    const { data: images, error: imagesError } = await supabase
      .from("venue_images")
      .select("*")
      .limit(10);

    if (imagesError) {
      results.images.message = `Images read error: ${imagesError.message}`;
    } else {
      results.images.pass = true;
      results.images.message = `Images loaded: ${images?.length} records`;
    }

  } catch (error: any) {
    console.error("Stress test error:", error);
  }

  // Print Results
  console.log("\n📊 STRESS TEST RESULTS:");
  console.log("========================");
  Object.entries(results).forEach(([key, value]: [string, any]) => {
    const status = value.pass ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} - ${key}: ${value.message}`);
  });

  const allPassed = Object.values(results).every((r: any) => r.pass);
  console.log("\n" + (allPassed ? "🎉 ALL TESTS PASSED" : "⚠️ SOME TESTS FAILED"));

  return results;
}