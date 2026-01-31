import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { InteractiveMap } from "@/components/InteractiveMap";
import { mockProperties } from "@/lib/mockData";
import type { Property } from "@/types";

export default function Home() {
  const [properties] = useState<Property[]>(mockProperties);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [accommodationType, setAccommodationType] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get unique countries from properties
  const availableCountries = Array.from(new Set(mockProperties.map((p) => p.location.country)));
  
  // Extract all unique tags/facilities from venue listings
  const availableTags = Array.from(
    new Set(
      mockProperties.flatMap((p) => p.amenities || [])
    )
  ).sort();

  useEffect(() => {
    filterProperties();
  }, [selectedCountries, location, checkIn, checkOut, guests, priceRange]);

  const filterProperties = () => {
    let results = [...properties];

    // Country filter - only apply if countries are selected
    if (selectedCountries.length > 0) {
      results = results.filter((property) =>
        selectedCountries.includes(property.location.country)
      );
    }

    // Location search
    if (location) {
      results = results.filter(
        (property) =>
          property.name.toLowerCase().includes(location.toLowerCase()) ||
          property.location.city.toLowerCase().includes(location.toLowerCase()) ||
          property.location.country.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Price filter
    results = results.filter(
      (property) =>
        property.price.perNight >= priceRange[0] &&
        property.price.perNight <= priceRange[1]
    );

    // Sort: Featured first, then by rating
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

  return (
    <>
      <SEO
        title="GO/NEWD - Discover Naturist Hotels Across the Globe"
        description="Find your perfect clothing-optional getaway"
      />
      <div className="min-h-screen bg-white">
        <Header />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Discover Naturist Hotels Across the Globe
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find your perfect clothing-optional getaway
              </p>
            </div>
          </section>

          {/* Interactive Map Section */}
          <section className="px-4 py-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Explore Locations on Map
              </h2>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <InteractiveMap
                  properties={mockProperties}
                  selectedCountries={selectedCountries}
                  onCountryClick={handleCountryToggle}
                />
              </div>
              
              {/* Location Pills - Orange dot + Selected Countries */}
              <div className="flex flex-wrap gap-2 mt-4 items-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Locations</span>
                </div>
                
                {selectedCountries.map((country) => (
                  <button
                    key={country}
                    onClick={() => removeCountry(country)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
                  >
                    <span className="text-sm font-medium">{country}</span>
                    <span className="text-lg leading-none">×</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Search Filters */}
          <section className="px-4 py-8">
            <SearchBar
              selectedCountries={selectedCountries}
              onCountrySelect={handleCountryToggle}
              availableCountries={availableCountries}
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
            />
          </section>

          {/* Properties Grid */}
          <section className="px-4 pb-16">
            <div className="container mx-auto max-w-6xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredProperties.length} Properties Available
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {filteredProperties.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No properties found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}