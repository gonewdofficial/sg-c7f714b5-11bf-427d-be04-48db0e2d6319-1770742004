import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Building2, Star, MessageSquare, Plus, Edit, LogOut } from "lucide-react";
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

      // Verify owner role
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
    // Load venues
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

    // Load reviews for owner's venues
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
        // Enrich reviews with venue names and responses
        const enrichedReviews = await Promise.all((reviewsData || []).map(async (review) => {
          const venue = venuesData.find(v => v.id === review.venue_id);
          
          // Check for existing response
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

  return (
    <>
      <SEO 
        title="Owner Dashboard - Naturist Resort Marketplace"
        description="Manage your property listings and respond to reviews"
      />
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {ownerName}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/owner/add-listing">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Listing
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                <Building2 className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{venues.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                <Star className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviews.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Responses</CardTitle>
                <MessageSquare className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reviews.filter(r => !r.response).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="listings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="reviews">Reviews & Responses</TabsTrigger>
            </TabsList>

            {/* Listings Tab */}
            <TabsContent value="listings" className="space-y-4">
              {venues.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first property</p>
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
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{venue.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {venue.location}, {venue.country}
                          </CardDescription>
                        </div>
                        <Link href={`/owner/edit-listing/${venue.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{venue.average_rating || "No rating"}</span>
                        </div>
                        <div>
                          {reviews.filter(r => r.venue_id === venue.id).length} reviews
                        </div>
                        <Badge variant={venue.status === "active" ? "default" : "secondary"}>
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
                    <p className="text-gray-600">Reviews from guests will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{review.venue_name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              by {review.profiles?.full_name || "Anonymous"}
                            </span>
                          </div>
                        </div>
                        {!review.response && (
                          <Link href={`/owner/respond/${review.id}`}>
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
                        <p className="text-gray-700">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {review.response && (
                        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-orange-500">Verified Owner</Badge>
                            <span className="text-xs text-gray-600">
                              {new Date(review.response.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.response.response}</p>
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