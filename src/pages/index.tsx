import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { PropertyCard } from "@/components/PropertyCard";
import { InteractiveMap } from "@/components/InteractiveMap";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getVenues, getCountries, getAccommodationTypes } from "@/services/venueService";
import type { Database } from "@/integrations/supabase/types";

type Venue = Database["public"]["Tables"]["venues"]["Row"];

export default function Home() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [accommodationTypes, setAccommodationTypes] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterVenues();
  }, [venues, selectedCountry, selectedType]);

  const loadData = async () => {
    setIsLoading(true);
    const [venuesResult, countriesResult, typesResult] = await Promise.all([
      getVenues(),
      getCountries(),
      getAccommodationTypes(),
    ]);

    if (!venuesResult.error) setVenues(venuesResult.venues);
    if (!countriesResult.error) setCountries(countriesResult.countries);
    if (!typesResult.error) setAccommodationTypes(typesResult.types);
    setIsLoading(false);
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

  const handleClearFilters = () => {
    setSelectedCountry("all");
    setSelectedType("all");
  };

  const handlePropertyClick = (slug: string) => {
    router.push(`/property/${slug}`);
  };

  return (
    <>
      <SEO
        title="Go/Newd - Discover Naturist Destinations"
        description="Explore authentic clothing-optional resorts and hotels across the globe"
      />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Discover Your Next <span className="text-orange-500">Naturist Destination</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore authentic clothing-optional resorts and hotels across the globe
          </p>
        </section>

        {/* Interactive Map Section - Directly below Hero */}
        <section className="container mx-auto px-4 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore Locations on Map</h2>
            <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-200">
              <InteractiveMap
                properties={filteredVenues.map(venue => ({
                  id: venue.id,
                  name: venue.name,
                  description: venue.description || "",
                  images: [],
                  price: { perNight: 0, currency: "USD", period: "night" },
                  rating: venue.average_rating || 0,
                  reviews: venue.total_reviews || 0,
                  reviewCount: venue.total_reviews || 0,
                  amenities: venue.facilities || [],
                  slug: venue.slug,
                  capacity: 0,
                  availability: true,
                  propertyType: (venue.accommodation_type as any) || "resort",
                  naturistType: "Clothing Optional",
                  features: venue.facilities || [],
                  contact: {
                    email: "",
                    phone: "",
                    website: venue.website_url || "",
                  },
                  location: {
                    city: "",
                    country: venue.country,
                    address: venue.location,
                    region: "",
                    coordinates: { 
                      lat: venue.lat || 0, 
                      lng: venue.lng || 0 
                    }
                  },
                }))}
                selectedCountry={selectedCountry !== "all" ? selectedCountry : null}
              />
            </div>
          </div>
        </section>

        {/* Search Filters */}
        <section className="container mx-auto px-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Country</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
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
                <label className="text-sm font-medium text-gray-700">Accommodation Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
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
                  onClick={handleClearFilters}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="container mx-auto px-4 pb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredVenues.length} {filteredVenues.length === 1 ? "Location" : "Locations"} Found
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading venues...</p>
            </div>
          ) : filteredVenues.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No venues found matching your filters.</p>
              <Button onClick={handleClearFilters} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => (
                <PropertyCard
                  key={venue.id}
                  property={{
                    id: venue.id,
                    name: venue.name,
                    location: { 
                      city: "",
                      country: venue.country, 
                      address: venue.location, 
                      region: "" 
                    },
                    images: [],
                    price: { perNight: 0, currency: "USD", period: "night" },
                    rating: venue.average_rating || 0,
                    reviews: venue.total_reviews || 0,
                    reviewCount: venue.total_reviews || 0,
                    amenities: venue.facilities || [],
                    slug: venue.slug,
                    propertyType: (venue.accommodation_type as any) || "resort",
                    naturistType: "Clothing Optional",
                    description: venue.description || "",
                    capacity: 0,
                    availability: true,
                    features: venue.facilities || [],
                    contact: {
                      email: "",
                      phone: "",
                      website: venue.website_url || "",
                    }
                  }}
                  onClick={() => handlePropertyClick(venue.slug)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}