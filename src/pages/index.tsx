import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { InteractiveMap } from "@/components/InteractiveMap";
import { mockProperties } from "@/lib/mockData";
import type { Property } from "@/types";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);

  useEffect(() => {
    let results = [...mockProperties];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (property) =>
          property.name.toLowerCase().includes(query) ||
          property.location.country.toLowerCase().includes(query) ||
          property.location.city.toLowerCase().includes(query)
      );
    }

    // Country filter - only apply if countries are selected
    if (selectedCountries.length > 0) {
      results = results.filter((property) =>
        selectedCountries.includes(property.location.country)
      );
    }

    // Property type filter - only apply if types are selected
    if (selectedTypes.length > 0) {
      results = results.filter((property) =>
        selectedTypes.includes(property.propertyType)
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
  }, [searchQuery, selectedCountries, selectedTypes, priceRange]);

  const handleCountrySelect = (countries: string[]) => {
    setSelectedCountries(countries);
  };

  const handleRemoveCountry = (country: string) => {
    setSelectedCountries(selectedCountries.filter((c) => c !== country));
  };

  return (
    <>
      <SEO
        title="GO/NEWD - Discover Naturist Hotels & Resorts"
        description="Explore naturist hotels, resorts, and accommodations across the globe"
      />
      <div className="min-h-screen bg-white">
        <Header />
        
        <main className="pt-16">
          <section className="py-16 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                  Discover Naturist Hotels Across the Globe
                </h1>
                <p className="text-xl text-gray-600">
                  Find your perfect clothing-optional getaway
                </p>
              </div>

              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCountries={selectedCountries}
                onCountryChange={setSelectedCountries}
                selectedTypes={selectedTypes}
                onTypeChange={setSelectedTypes}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
              />
            </div>
          </section>

          <section className="py-12 px-4 bg-gray-50">
            <div className="container mx-auto max-w-7xl">
              <h2 className="text-3xl font-bold mb-8">Explore Locations on Map</h2>
              
              <InteractiveMap
                properties={mockProperties}
                selectedCountries={selectedCountries}
                onCountryClick={handleCountrySelect}
              />

              {selectedCountries.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600">Selected countries:</span>
                  {selectedCountries.map((country) => (
                    <button
                      key={country}
                      onClick={() => handleRemoveCountry(country)}
                      className="px-3 py-1 bg-[#FF6B35] text-white rounded-full text-sm hover:bg-[#FF6B35]/90 transition-colors"
                    >
                      {country} ×
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedCountries([])}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="py-16 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">
                  {selectedCountries.length > 0 || searchQuery || selectedTypes.length > 0
                    ? `${filteredProperties.length} Properties Found`
                    : "All Properties"}
                </h2>
              </div>

              {filteredProperties.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-gray-600 mb-4">No properties found matching your criteria</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCountries([]);
                      setSelectedTypes([]);
                      setPriceRange([0, 1000]);
                    }}
                    className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF6B35]/90 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}