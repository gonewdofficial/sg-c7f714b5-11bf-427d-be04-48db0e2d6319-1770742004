import { useRouter } from "next/router";
import Image from "next/image";
import { Header } from "@/components/Header";
import { BookingWidget } from "@/components/BookingWidget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { properties, reviews } from "@/lib/mockData";
import { MapPin, Star, Share2, Heart, Check, Wifi, Car, Utensils, Waves, TreePine } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function PropertyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const property = properties.find(p => p.id === id);
  const propertyReviews = reviews.filter(r => r.propertyId === id);

  if (!property) {
    return <div>Loading...</div>;
  }

  const amenitiesIcons: Record<string, any> = {
    "Pool": Waves,
    "Spa": SparklesIcon, 
    "Restaurant": Utensils,
    "Parking": Car,
    "Wifi": Wifi,
    "Garden": TreePine,
  };

  return (
    <>
      <SEO 
        title={`${property.name} - NaturEscape`}
        description={property.description}
        image={property.images[0]}
      />
      <div className="min-h-screen bg-white">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Title Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.name}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{property.location.city}, {property.location.country}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-emerald-600 text-emerald-600" />
                  <span className="font-semibold text-black">{property.rating}</span>
                  <span className="underline cursor-pointer">({property.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12">
            <div className="md:col-span-2 relative h-full">
              <Image
                src={property.images[0]}
                alt={property.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-2 h-full">
              <div className="relative h-full">
                <Image
                  src={property.images[1] || property.images[0]}
                  alt="Gallery 2"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                />
              </div>
              <div className="relative h-full">
                <Image
                  src={property.images[2] || property.images[0]}
                  alt="Gallery 3"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                />
              </div>
            </div>
            <div className="hidden md:grid grid-rows-2 gap-2 h-full">
              <div className="relative h-full">
                <Image
                  src={property.images[3] || property.images[0]}
                  alt="Gallery 4"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                />
              </div>
              <div className="relative h-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <span className="font-semibold text-gray-600">Show all photos</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <section>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {property.propertyType}
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1 border-emerald-200 text-emerald-700 bg-emerald-50">
                    {property.naturistType}
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold mb-4">About this place</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {property.description}
                </p>
              </section>

              {/* Amenities */}
              <section className="border-t pt-10">
                <h2 className="text-2xl font-bold mb-6">What this place offers</h2>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity) => {
                    const Icon = amenitiesIcons[amenity] || Check;
                    return (
                      <div key={amenity} className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Features/Rules */}
              <section className="border-t pt-10">
                <h2 className="text-2xl font-bold mb-6">Naturist Features & Rules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Reviews */}
              <section className="border-t pt-10">
                <div className="flex items-center gap-2 mb-8">
                  <Star className="h-6 w-6 fill-emerald-600 text-emerald-600" />
                  <h2 className="text-2xl font-bold">{property.rating} · {property.reviewCount} reviews</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {propertyReviews.map((review) => (
                    <div key={review.id} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={review.userAvatar} />
                          <AvatarFallback>{review.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold">{review.userName}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-8 w-full md:w-auto">
                  Show all {property.reviewCount} reviews
                </Button>
              </section>
            </div>

            {/* Sidebar Booking Widget */}
            <div className="lg:col-span-1">
              <BookingWidget property={property} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Helper icon component
function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}