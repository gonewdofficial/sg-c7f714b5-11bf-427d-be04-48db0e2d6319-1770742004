import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { InteractiveMap } from "@/components/InteractiveMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Loader2 } from "lucide-react";
import { getVenues, getCountries, getAccommodationTypes } from "@/services/venueService";
import type { Database } from "@/integrations/supabase/types";

type Venue = Database["public"]["Tables"]["venues"]["Row"];

export default function HomePage() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [accommodationTypes, setAccommodationTypes] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterVenues();
  }, [selectedCountry, selectedType, venues]);

  const loadData = async () => {
    setLoading(true);
    
    const { venues: venuesData } = await getVenues();
    const { countries: countriesData } = await getCountries();
    const { types: typesData } = await getAccommodationTypes();

    setVenues(venuesData);
    setFilteredVenues(venuesData);
    setCountries(countriesData);
    setAccommodationTypes(typesData);
    
    setLoading(false);
  };

  const filterVenues = () => {
    let filtered = venues;

    if (selectedCountry !== "all") {
      filtered = filtered.filter(v => v.country === selectedCountry);
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(v => v.accommodation_type === selectedType);
    }

    setFilteredVenues(filtered);
  };

  const handleVenueClick = (venue: Venue) => {
    router.push(`/property/${venue.slug}`);
  };

  return (
    <>
      <SEO
        title="GO/NEWD - Discover Naturist Resorts & Hotels Worldwide"
        description="Find and book authentic clothing-optional resorts and hotels across the globe"
      />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header />
        
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-12 pb-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Discover Your Next Naturist Destination
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Explore authentic clothing-optional resorts and hotels across the globe
            </p>
          </div>

          {/* Search Filters */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Country</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Accommodation Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {accommodationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSelectedCountry("all");
                    setSelectedType("all");
                  }}
                  variant="outline"
                  className="h-12 w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Explore Locations on Map
            </h2>
            <div className="h-[500px] rounded-xl overflow-hidden">
              <InteractiveMap
                properties={filteredVenues.map(venue => ({
                  id: venue.id,
                  name: venue.name,
                  location: {
                    country: venue.country,
                    city: venue.location,
                    region: "",
                    coordinates: { lat: 0, lng: 0 }
                  },
                  accommodationType: venue.accommodation_type,
                  rating: venue.average_rating || 0,
                  reviewCount: venue.total_reviews || 0,
                  images: [],
                  description: venue.description || "",
                  pricePerNight: 0,
                  amenities: venue.facilities || [],
                  slug: venue.slug,
                  // Add missing required fields with defaults
                  price: {
                    perNight: 0,
                    currency: "USD"
                  },
                  capacity: {
                    guests: 0,
                    rooms: 0
                  },
                  availability: true,
                  propertyType: venue.accommodation_type as any, // Cast to any to avoid strict union type mismatch for now
                  naturistType: "clothing-optional", // Default value
                  features: venue.facilities || [],
                  contact: {
                    email: "",
                    phone: "",
                    website: venue.website_url || ""
                  }
                }))}
                selectedCountry={selectedCountry !== "all" ? selectedCountry : null}
              />
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredVenues.length} {filteredVenues.length === 1 ? "Property" : "Properties"} Found
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
          ) : filteredVenues.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg mb-4">No properties found matching your filters</p>
              <Button 
                onClick={() => {
                  setSelectedCountry("all");
                  setSelectedType("all");
                }}
                className="bg-brand hover:bg-brand/90"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => (
                <Card 
                  key={venue.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-orange-200"
                  onClick={() => handleVenueClick(venue)}
                >
                  <div className="relative h-48 bg-gradient-to-br from-orange-200 to-amber-200">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl opacity-20">🏖️</div>
                    </div>
                    <Badge className="absolute top-4 right-4 bg-white text-gray-900">
                      {venue.accommodation_type}
                    </Badge>
                  </div>

                  <CardContent className="p-5">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-1">
                      {venue.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm line-clamp-1">{venue.location}</span>
                    </div>

                    {venue.average_rating && venue.average_rating > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 font-semibold text-lg">
                            {venue.average_rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          ({venue.total_reviews} {venue.total_reviews === 1 ? "review" : "reviews"})
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No reviews yet</div>
                    )}

                    {venue.description && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                        {venue.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}