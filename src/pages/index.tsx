import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { InteractiveMap } from "@/components/InteractiveMap";
import { getVenues } from "@/services/venueService";
import { getCountryCoordinates } from "@/lib/utils";
import type { Property } from "@/types";
import type { VenueWithStats } from "@/services/venueService";

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    setLoading(true);
    const { venues, error } = await getVenues();
    
    if (error) {
      console.error("Error loading venues:", error);
      setProperties([]);
      setFilteredProperties([]);
    } else {
      const mappedProperties: Property[] = venues.map((v: VenueWithStats) => {
        const coords = v.lat && v.lng 
          ? { lat: v.lat, lng: v.lng }
          : getCountryCoordinates(v.country);

        const images = Array.isArray(v.venue_images)
          ? v.venue_images
              .sort((a, b) => (a.display_order || 999) - (b.display_order || 999))
              .map((img) => img.image_url)
          : [];

        return {
          id: v.id,
          name: v.name,
          slug: v.slug || v.id, // Fallback to ID if slug is missing
          description: v.description || "",
          location: {
            city: v.city || "",
            country: v.country,
            region: v.region || "",
            address: v.address || undefined,
            coordinates: coords,
          },
          images: images,
          price: {
            perNight: v.price_per_night || 0,
            currency: "EUR",
          },
          rating: v.average_rating || 0,
          reviewCount: v.review_count || 0,
          propertyType: (v.venue_type as any) || "resort",
          naturistType: "clothing-optional",
          amenities: v.amenities || [],
          features: [],
          capacity: {
            guests: v.max_guests || 0,
            rooms: 0,
          },
          availability: v.status === "active",
          featured: false,
          verified: v.status === "active",
          websiteUrl: v.website_url || undefined,
        };
      });

      setProperties(mappedProperties);
      setFilteredProperties(mappedProperties);
    }
    setLoading(false);
  };

  const availableCountries = Array.from(new Set(properties.map((p) => p.location.country.toLowerCase())));
  
  const availableTags = Array.from(
    new Set(
      properties.flatMap((p) => p.amenities || [])
    )
  ).sort();

  useEffect(() => {
    filterProperties();
  }, [selectedCountries, location, priceRange, properties, selectedTags]);

  const filterProperties = () => {
    let results = [...properties];

    if (selectedCountries.length > 0) {
      results = results.filter((property) =>
        selectedCountries.some(
          (selected) => selected.toLowerCase() === property.location.country.toLowerCase()
        )
      );
    }

    if (location) {
      results = results.filter(
        (property) =>
          property.name.toLowerCase().includes(location.toLowerCase()) ||
          property.location.city.toLowerCase().includes(location.toLowerCase()) ||
          property.location.country.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      results = results.filter((property) =>
        selectedTags.every((tag) => property.amenities.includes(tag))
      );
    }

    results = results.filter(
      (property) =>
        property.price.perNight >= priceRange[0] &&
        property.price.perNight <= priceRange[1]
    );

    results.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });

    setFilteredProperties(results);
  };

  const handleCountryToggle = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const removeCountry = (country: string) => {
    setSelectedCountries((prev) => prev.filter((c) => c !== country));
  };

  const handleClearFilters = () => {
    setSelectedCountries([]);
    setSelectedTags([]);
    setLocation("");
    setPriceRange([0, 1000]);
  };

  if (loading) {
    return (
      <>
        <SEO
          title="GO/NEWD - Discover Naturist Hotels Across the Globe"
          description="Find your perfect clothing-optional getaway"
        />
        <div className="min-h-screen bg-white">
          <Header />
          <main className="pt-16">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading venues...</p>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="GO/NEWD - Discover Naturist Hotels Across the Globe"
        description="Find your perfect clothing-optional getaway"
      />
      <div className="min-h-screen bg-white">
        <Header />
        
        <main className="pt-16">
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Go/Newd Somewhere New
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Real photos, real reviews, real experiences.
              </p>
            </div>
          </section>

          <section className="px-4 py-8 bg-gray-50 rounded-lg mb-8">
            <h2 className="text-3xl font-bold mb-6 text-black">Explore locations</h2>
            <div className="mb-8">
              <InteractiveMap
                properties={properties}
                selectedCountries={selectedCountries}
                onCountryClick={handleCountryToggle}
              />
            </div>
            
            {selectedCountries.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Selected Locations</span>
                </div>
                
                {selectedCountries.map((country) => (
                  <button
                    key={country}
                    onClick={() => removeCountry(country)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
                  >
                    <span className="text-sm font-medium capitalize">{country}</span>
                    <span className="text-lg leading-none">×</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="px-4 py-8">
            <SearchBar
              selectedCountries={selectedCountries}
              onCountrySelect={handleCountryToggle}
              availableCountries={availableCountries}
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              onClearFilters={handleClearFilters}
            />
          </section>

          <section className="px-4 pb-16">
            <div className="container mx-auto max-w-6xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredProperties.length} Properties Available
                </h2>
                {(selectedCountries.length > 0 || selectedTags.length > 0) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    id={property.id}
                    name={property.name}
                    location={`${property.location.city}, ${property.location.country}`}
                    image={property.images[0] || "/placeholder.jpg"}
                    price={property.price.perNight}
                    rating={property.rating}
                    reviews={property.reviewCount}
                    featured={property.featured}
                  />
                ))}
              </div>

              {filteredProperties.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No properties found matching your criteria.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Clear filters and show all properties
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}