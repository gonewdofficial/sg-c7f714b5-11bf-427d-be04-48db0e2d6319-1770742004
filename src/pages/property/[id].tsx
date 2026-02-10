import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, MapPin, Share2, Heart } from "lucide-react";
import { getVenueBySlug, getVenueReviews } from "@/services/venueService";
import type { Database } from "@/integrations/supabase/types";

// Define an extended type that includes the joined relationships
type VenueDetail = Database["public"]["Tables"]["venues"]["Row"] & {
  venue_images: {
    id: string;
    image_url: string;
    display_order: number;
    is_primary: boolean;
  }[];
};

type Review = Database["public"]["Tables"]["reviews"]["Row"] & {
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [venue, setVenue] = useState<VenueDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      loadVenueData(id);
    }
  }, [id]);

  async function loadVenueData(slug: string) {
    setLoading(true);
    setError(null);

    const { venue: venueData, error: venueError } = await getVenueBySlug(slug);
    
    if (venueError || !venueData) {
      setError("Property not found");
      setLoading(false);
      return;
    }

    // Cast the response to our extended type since we know the query includes venue_images
    setVenue(venueData as unknown as VenueDetail);

    const { reviews: reviewsData } = await getVenueReviews(venueData.id);
    setReviews(reviewsData || []);
    
    setLoading(false);
  }

  if (loading) {
    return (
      <>
        <SEO title="Loading..." />
        <div className="min-h-screen bg-white">
          <Header />
          <main className="pt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center">
                <p className="text-gray-600">Loading property details...</p>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (error || !venue) {
    return (
      <>
        <SEO title="Property Not Found" />
        <div className="min-h-screen bg-white">
          <Header />
          <main className="pt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
                <Button onClick={() => router.push("/")}>Back to Home</Button>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
    : 0;

  const amenities = Array.isArray(venue.amenities) ? venue.amenities : [];
  // Use amenities as features since features is not in DB yet, or use empty array
  const features: string[] = []; 
  
  // Map venue_images to string array for display
  const images = venue.venue_images 
    ? venue.venue_images
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map(img => img.image_url)
    : [];

  return (
    <>
      <SEO
        title={`${venue.name} - Naturist Resort`}
        description={venue.description || ""}
        image={images[0] || ""}
      />
      <div className="min-h-screen bg-white">
        <Header />
        
        <main className="pt-16">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {venue.name}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-current text-orange-500" />
                      <span className="font-semibold text-gray-900">{averageRating > 0 ? averageRating.toFixed(1) : "No rating"}</span>
                      <span className="text-gray-600">({reviews.length} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-5 w-5 text-orange-500" />
                      <span>{venue.city}, {venue.country}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-orange-500 text-orange-600">
                  {venue.accommodation_type || venue.venue_type}
                </Badge>
              </div>
            </div>

            {images.length > 0 && (
              <div className="mb-8">
                <Carousel className="w-full">
                  <CarouselContent>
                    {images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative h-[400px] md:h-[600px] rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`${venue.name} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">About This Property</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {venue.description}
                    </p>
                  </CardContent>
                </Card>

                {amenities.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-4 text-gray-900">Amenities</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {amenities.map((amenity) => (
                          <div key={amenity} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-gray-700">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {features.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-4 text-gray-900">Special Features</h2>
                      <div className="flex flex-wrap gap-2">
                        {features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="bg-orange-100 text-orange-700">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">
                      Guest Reviews ({reviews.length})
                    </h2>
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">
                                  {review.profiles?.full_name || "Anonymous"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < (review.rating || 0)
                                          ? "fill-orange-500 text-orange-500"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                  {review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                      {reviews.length === 0 && (
                        <p className="text-gray-600 text-center py-4">
                          No reviews yet. Be the first to review this property!
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}