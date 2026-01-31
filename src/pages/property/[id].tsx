import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ExternalLink, MapPin, Star, Loader2, Wifi, Users, Calendar, Check } from "lucide-react";
import { mockProperties } from "@/lib/mockData";
import type { Property, Review } from "@/types";

export default function PropertyDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && typeof id === "string") {
      // Find property by ID from mock data
      const foundProperty = mockProperties.find(p => p.id === id);
      setProperty(foundProperty || null);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600">Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${property.name} - GO/NEWD`}
        description={property.description}
      />
      <div className="min-h-screen bg-white">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <Link href="/" className="text-orange-500 hover:underline mb-6 inline-block">
            ← Back to Search
          </Link>

          {/* Image Gallery */}
          <div className="mb-8">
            <Carousel className="w-full">
              <CarouselContent>
                {property.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt={`${property.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{property.name}</h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location.city}, {property.location.country}</span>
                    </div>
                  </div>
                  {property.featured && (
                    <Badge className="bg-orange-500 text-white">
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-semibold text-lg">
                      {property.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    ({property.reviews.length} {property.reviews.length === 1 ? "review" : "reviews"})
                  </span>
                  {property.verified && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <Check className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Tags */}
                {property.tags && property.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Property</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Reviews */}
              {property.reviews && property.reviews.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Guest Reviews</h2>
                  <div className="space-y-4">
                    {property.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">
                                  {review.author}
                                </span>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="ml-1 text-sm">{review.rating}</span>
                                </div>
                                {review.verified && (
                                  <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                    <Check className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-700 mb-2">{review.comment}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(review.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric"
                                })}
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
                <CardContent className="pt-6 space-y-4">
                  {/* Price */}
                  <div className="text-center pb-4 border-b">
                    <div className="text-3xl font-bold text-orange-500">
                      {property.price.currency}{property.price.perNight}
                    </div>
                    <div className="text-sm text-gray-600">per night</div>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-3 py-4 border-b">
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">
                        {property.location.city}, {property.location.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">
                        Max {property.capacity || "varies"} guests
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    {property.bookingUrl && (
                      <a href={property.bookingUrl} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                          Book Now
                        </Button>
                      </a>
                    )}
                    
                    {property.websiteUrl && (
                      <a href={property.websiteUrl} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full" variant="outline">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Website
                        </Button>
                      </a>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="text-xs text-gray-500 pt-4 border-t">
                    <p>Free cancellation available</p>
                    <p className="mt-1">No booking fees</p>
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