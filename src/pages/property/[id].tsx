import { useRouter } from "next/router";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MapPin, Star, Wifi, Utensils, Waves, Dumbbell, 
  Sparkles, Heart, Share2, Phone, Mail, MessageCircle
} from "lucide-react";
import { properties, reviews } from "@/lib/mockData";
import { SEO } from "@/components/SEO";

const amenityIcons: Record<string, any> = {
  "Free WiFi": Wifi,
  "Restaurant": Utensils,
  "Pool": Waves,
  "Spa": Sparkles,
  "Gym": Dumbbell,
};

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;

  const property = properties.find(p => p.id === id);
  const propertyReviews = reviews.filter(r => r.propertyId === id);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <Button onClick={() => router.push("/search")}>Browse Properties</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title={`${property.name} - GO/NEWD`} description={property.description} />
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                ← Back to results
              </Button>
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{property.name}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location.city}, {property.location.country}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{property.rating}</span>
                      <span>({propertyReviews.length} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-8 h-[500px]">
              <div className="col-span-2 row-span-2 relative">
                <Image
                  src={property.images[0]}
                  alt={property.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {property.images.slice(1, 5).map((image, idx) => (
                <div key={idx} className="relative">
                  <Image
                    src={image}
                    alt={`${property.name} ${idx + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="secondary">{property.type}</Badge>
                      <Badge variant="outline">{property.naturistType}</Badge>
                      {property.featured && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold mb-4">About this property</h2>
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Amenities</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {property.amenities.map((amenity) => {
                        const Icon = amenityIcons[amenity] || Sparkles;
                        return (
                          <div key={amenity} className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-blue-600" />
                            <span>{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Guest Reviews</h2>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">{property.rating}</span>
                        <span className="text-gray-600">({propertyReviews.length} reviews)</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {propertyReviews.map((review) => (
                        <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarFallback>{review.userName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="font-semibold">{review.userName}</div>
                                  <div className="text-sm text-gray-600">{review.date}</div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-semibold">{review.rating}</span>
                                </div>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                              {review.verified && (
                                <Badge variant="secondary" className="mt-2">
                                  Verified Stay
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Location</h2>
                    <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="mt-4 text-gray-600">
                      {property.location.address}, {property.location.city}, {property.location.country}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <Card className="shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-6">
                        <div className="text-3xl font-bold mb-1">
                          €{property.price.perNight}
                          <span className="text-lg font-normal text-gray-600"> / night</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          €{property.price.perWeek} per week
                        </p>
                      </div>

                      <div className="space-y-3 mb-6">
                        <Button className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Property
                        </Button>
                        <Button variant="outline" className="w-full h-12">
                          <Mail className="h-4 w-4 mr-2" />
                          Email Inquiry
                        </Button>
                        <Button variant="outline" className="w-full h-12">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3">Property Features</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium">{property.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Capacity:</span>
                            <span className="font-medium">{property.capacity} guests</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Style:</span>
                            <span className="font-medium">{property.naturistType}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        <span>Free cancellation available</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}