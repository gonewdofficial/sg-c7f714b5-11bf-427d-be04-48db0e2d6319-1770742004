import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Star, Plus, Edit, LogOut, MessageSquare } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Venue = Tables<"venues">;
type Review = Tables<"reviews"> & {
  profiles?: {
    full_name: string;
  };
};
type ReviewResponse = Tables<"review_responses">;

export default function OwnerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ownerName, setOwnerName] = useState("");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [reviews, setReviews] = useState<(Review & { venue_name?: string; response?: ReviewResponse })[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        router.push("/owner/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

      if (profileError || profile?.role !== "owner") {
        router.push("/owner/login");
        return;
      }

      setOwnerName(profile.full_name || "");
      await loadOwnerData(user.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadOwnerData = async (ownerId: string) => {
    const { data: venuesData, error: venuesError } = await supabase
      .from("venues")
      .select("*")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (venuesError) {
      console.error("Error loading venues:", venuesError);
    } else {
      setVenues(venuesData || []);
    }

    if (venuesData && venuesData.length > 0) {
      const venueIds = venuesData.map(v => v.id);
      
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles!reviews_user_id_fkey(full_name)
        `)
        .in("venue_id", venueIds)
        .order("created_at", { ascending: false });

      if (reviewsError) {
        console.error("Error loading reviews:", reviewsError);
      } else {
        const enrichedReviews = await Promise.all((reviewsData || []).map(async (review) => {
          const venue = venuesData.find(v => v.id === review.venue_id);
          
          const { data: responseData } = await supabase
            .from("review_responses")
            .select("*")
            .eq("review_id", review.id)
            .maybeSingle();

          return {
            ...review,
            venue_name: venue?.name,
            response: responseData || undefined
          };
        }));

        setReviews(enrichedReviews);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const pendingCount = reviews.filter(r => !r.response).length;

  return (
    <>
      <SEO 
        title="Owner Dashboard - Naturist Resort Marketplace"
        description="Manage your property listings and respond to reviews"
      />
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">Welcome back, {ownerName}</p>
            </div>
            <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
              <Link href="/owner/add-listing" className="flex-1 sm:flex-none">
                <Button className="bg-orange-500 hover:bg-orange-600 w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Listing
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="shrink-0">
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Condensed Stats Bar */}
          <div className="bg-white rounded-lg border px-4 md:px-6 py-4 mb-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
              <span className="font-semibold text-gray-900">{venues.length}</span>
              <span className="text-gray-600">Listing{venues.length !== 1 ? "s" : ""}</span>
              <span className="text-gray-300">|</span>
              <span className="font-semibold text-gray-900">{reviews.length}</span>
              <span className="text-gray-600">Review{reviews.length !== 1 ? "s" : ""}</span>
              <span className="text-gray-300">|</span>
              <span className="font-semibold text-gray-900">{pendingCount}</span>
              <span className="text-gray-600">Pending Response{pendingCount !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="listings" className="space-y-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="listings" className="flex-1 sm:flex-none">My Listings</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 sm:flex-none">Reviews & Responses</TabsTrigger>
            </TabsList>

            {/* Listings Tab */}
            <TabsContent value="listings" className="space-y-4">
              {venues.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                    <p className="text-gray-600 mb-4 text-sm">Start by adding your first property</p>
                    <Link href="/owner/add-listing">
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Listing
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                venues.map((venue) => (
                  <Card key={venue.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg md:text-xl break-words">{venue.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {venue.location}, {venue.country}
                          </p>
                        </div>
                        <Link href={`/owner/edit-listing/${venue.id}`} className="shrink-0">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{venue.average_rating ? venue.average_rating.toFixed(1) : "No rating"}</span>
                        </div>
                        <div>
                          {reviews.filter(r => r.venue_id === venue.id).length} review{reviews.filter(r => r.venue_id === venue.id).length !== 1 ? "s" : ""}
                        </div>
                        <Badge variant={venue.status === "active" ? "default" : "secondary"} className="bg-orange-500">
                          {venue.status || "draft"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-4">
              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                    <p className="text-gray-600 text-sm">Reviews from guests will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base md:text-lg break-words">{review.venue_name}</CardTitle>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 md:w-4 md:h-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs md:text-sm text-gray-600">
                              by {review.profiles?.full_name || "Anonymous"}
                            </span>
                          </div>
                        </div>
                        {!review.response && (
                          <Link href={`/owner/respond/${review.id}`} className="shrink-0">
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Respond
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm md:text-base text-gray-700 break-words">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {review.response && (
                        <div className="bg-orange-50 border-l-4 border-orange-500 p-3 md:p-4 rounded">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge className="bg-orange-500 text-xs">Verified Owner</Badge>
                            <span className="text-xs text-gray-600">
                              {new Date(review.response.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm md:text-base text-gray-700 break-words">{review.response.response}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}