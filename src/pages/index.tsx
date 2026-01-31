import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { InteractiveMap } from "@/components/InteractiveMap";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyCard } from "@/components/PropertyCard";
import { getVenues } from "@/services/venueService";
import { Loader2, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import type { Property } from "@/types";

type Venue = Database["public"]["Tables"]["venues"]["Row"];

export default function Home() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedAccommodationType, setSelectedAccommodationType] = useState<string>("all");

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    setLoading(true);
    const { venues: data, error } = await getVenues();
    if (!error && data) {
      setVenues(data);
    }
    setLoading(false);
  };

  const handleCountryClick = (country: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(country)) {
        return prev.filter(c => c !== country);
      }
      return [...prev, country];
    });
  };

  const removeCountry = (country: string) => {
    setSelectedCountries(prev => prev.filter(c => c !== country));
  };

  const clearFilters = () => {
    setSelectedCountries([]);
    setSelectedAccommodationType("all");
  };

  const filteredVenues = venues.filter(venue => {
    const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(venue.country);
    const typeMatch = selectedAccommodationType === "all" || venue.accommodation_type === selectedAccommodationType;
    return countryMatch && typeMatch;
  });

  const handlePropertyClick = (slug: string) => {
    router.push(`/property/${slug}`);
  };

  const uniqueCountries = Array.from(new Set(venues.map(v => v.country))).sort();
  const uniqueTypes = Array.from(new Set(venues.map(v => v.accommodation_type))).sort();

  return (
    <>
      <SEO
        title="GO/NEWD - Discover Naturist Hotels & Resorts"
        description="Explore authentic clothing-optional resorts and hotels across the globe"
      />
      <div className="min-h-screen bg-white">
        <Header />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="container mx-auto px-4 pt-8 pb-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                Discover Your Next <span className="text-brand">Naturist Destination</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Explore authentic clothing-optional resorts and hotels across the globe
              </p>
            </div>
          </section>

          {/* Map Section */}
          <section className="container mx-auto px-4 pb-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Explore Locations on Map</h2>
              <div className="relative w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden border border-gray-200">
                <InteractiveMap
                  properties={filteredVenues.map(venue => ({
                    id: venue.id,
                    name: venue.name,
                    slug: venue.slug,
                    description: venue.description || "",
                    location: {
                      city: "",
                      country: venue.country,
                      region: "",
                      coordinates: {
                        lat: venue.lat || 0,
                        lng: venue.lng || 0
                      }
                    },
                    propertyType: venue.accommodation_type as "resort" | "hotel" | "villa" | "campsite",
                    naturistType: "clothing-optional" as const,
                    price: {
                      perNight: 0,
                      currency: "EUR"
                    },
                    capacity: {
                      guests: 0,
                      rooms: 0
                    },
                    rating: venue.average_rating || 0,
                    reviewCount: venue.total_reviews || 0,
                    amenities: venue.facilities || [],
                    images: [],
                    availability: true,
                    features: venue.facilities || [],
                  }))}
                  onCountryClick={handleCountryClick}
                  selectedCountries={selectedCountries}
                />
              </div>

              {/* Selected Countries Pills - Below Map */}
              {selectedCountries.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Selected Countries:</span>
                  {selectedCountries.map(country => (
                    <button
                      key={country}
                      onClick={() => removeCountry(country)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand rounded-full text-sm font-medium hover:bg-brand/20 transition-colors"
                    >
                      {country}
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ))}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Filters Section */}
          <section className="container mx-auto px-4 pb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <Select
                    value={selectedCountries.length === 1 ? selectedCountries[0] : "multiple"}
                    onValueChange={(value) => {
                      if (value !== "multiple") {
                        setSelectedCountries([value]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" onClick={() => setSelectedCountries([])}>
                        All Countries
                      </SelectItem>
                      {uniqueCountries.map(country => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Accommodation Type</label>
                  <Select value={selectedAccommodationType} onValueChange={setSelectedAccommodationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {uniqueTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(selectedCountries.length > 0 || selectedAccommodationType !== "all") && (
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Results Section */}
          <section className="container mx-auto px-4 pb-12">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {filteredVenues.length} {filteredVenues.length === 1 ? "Location" : "Locations"} Found
              </h2>
              {selectedCountries.length > 0 && (
                <p className="text-gray-600 mt-1">
                  Showing results in: {selectedCountries.join(", ")}
                </p>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
              </div>
            ) : filteredVenues.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No venues found matching your criteria.</p>
                <Button onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVenues.map(venue => (
                  <PropertyCard
                    key={venue.id}
                    property={{
                      id: venue.id,
                      name: venue.name,
                      slug: venue.slug,
                      description: venue.description || "",
                      location: {
                        city: "",
                        country: venue.country,
                        region: "",
                        coordinates: {
                          lat: venue.lat || 0,
                          lng: venue.lng || 0
                        }
                      },
                      propertyType: venue.accommodation_type as "resort" | "hotel" | "villa" | "campsite",
                      naturistType: "clothing-optional" as const,
                      price: {
                        perNight: 0,
                        currency: "EUR"
                      },
                      capacity: {
                        guests: 0,
                        rooms: 0
                      },
                      rating: venue.average_rating || 0,
                      reviewCount: venue.total_reviews || 0,
                      amenities: venue.facilities || [],
                      images: [],
                      availability: true,
                      features: venue.facilities || [],
                    }}
                    onClick={() => handlePropertyClick(venue.slug)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}