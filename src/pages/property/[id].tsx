import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, MapPin, Star, Loader2 } from "lucide-react";
import { getVenueBySlug, getVenueReviews } from "@/services/venueService";
import type { Database } from "@/integrations/supabase/types";

type Venue = Database["public"]["Tables"]["venues"]["Row"];
type Review = Database["public"]["Tables"]["reviews"]["Row"] & {
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export default function PropertyDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [venue, setVenue] = useState<Venue | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id && typeof id === "string") {
      loadVenue(id);
    }
  }, [id]);

  const loadVenue = async (slug: string) => {
    setLoading(true);
    const { venue: venueData, error: venueError } = await getVenueBySlug(slug);
    
    if (venueError || !venueData) {
      setError("Venue not found");
      setLoading(false);
      return;
    }

    setVenue(venueData);

    const { reviews: reviewsData } = await getVenueReviews(venueData.id);
    setReviews(reviewsData as Review[]);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Venue Not Found</h1>
          <Link href="/">
            <Button className="bg-brand hover:bg-brand/90">Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${venue.name} - GO/NEWD`}
        description={venue.description || `Discover ${venue.name} in ${venue.location}`}
      />
      <div className="min-h-screen bg-white">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <Link href="/" className="text-brand hover:underline mb-6 inline-block">
            ← Back to Search
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{venue.name}</h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{venue.location}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {venue.accommodation_type}
                  </Badge>
                </div>

                {/* Rating */}
                {venue.average_rating && venue.average_rating > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold text-lg">
                        {venue.average_rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-gray-600">
                      ({venue.total_reviews} {venue.total_reviews === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Description */}
              {venue.description && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">About This Property</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {venue.description}
                  </p>
                </div>
              )}

              {/* Facilities */}
              {venue.facilities && Array.isArray(venue.facilities) && venue.facilities.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Facilities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {venue.facilities.map((facility, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-brand rounded-full" />
                        <span className="text-sm">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {reviews.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Guest Reviews</h2>
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">
                                  {review.profiles?.full_name || "Anonymous"}
                                </span>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="ml-1 text-sm">{review.rating}</span>
                                </div>
                              </div>
                              {review.comment && (
                                <p className="text-gray-700">{review.comment}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Visit This Property</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {venue.website_url && (
                    <a href={venue.website_url} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full" variant="outline">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Website
                      </Button>
                    </a>
                  )}
                  
                  {venue.booking_link && (
                    <a href={venue.booking_link} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-brand hover:bg-brand/90">
                        Book Now
                      </Button>
                    </a>
                  )}

                  <Separator />

                  <div className="text-sm text-gray-600 space-y-2">
                    <div>
                      <span className="font-semibold">Location:</span>
                      <p>{venue.location}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Type:</span>
                      <p>{venue.accommodation_type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}