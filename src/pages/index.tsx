import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { InteractiveMap } from "@/components/InteractiveMap";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { properties } from "@/lib/mockData";
import { Search, SlidersHorizontal, MapPin, Star, X } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [sortBy, setSortBy] = useState<string>("rating");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique countries from properties
  const countries = useMemo(() => {
    const countrySet = new Set(properties.map(p => p.location.country));
    return Array.from(countrySet).sort();
  }, []);

  // Filter properties based on selections
  const filteredProperties = useMemo(() => {
    let filtered = properties;

    // Filter by country
    if (selectedCountry) {
      filtered = filtered.filter(
        p => p.location.country.toLowerCase() === selectedCountry.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.location.city.toLowerCase().includes(query) ||
          p.location.country.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      p => p.price.perNight >= priceRange[0] && p.price.perNight <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price.perNight - b.price.perNight);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price.perNight - a.price.perNight);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [selectedCountry, searchQuery, priceRange, sortBy]);

  const handleCountryClick = (countryName: string) => {
    if (selectedCountry === countryName) {
      setSelectedCountry(null);
    } else {
      setSelectedCountry(countryName);
    }
  };

  const clearFilters = () => {
    setSelectedCountry(null);
    setSearchQuery("");
    setPriceRange([0, 500]);
    setSortBy("rating");
  };

  return (
    <>
      <SEO 
        title="GO/NEWD - Discover Naturist Hotels & Resorts Worldwide"
        description="Explore authentic naturist hotels, resorts, and retreats worldwide. Browse reviews, compare amenities, and connect with your perfect clothing-optional destination."
      />
      <div className="min-h-screen bg-white">
        <Header />

        {/* Hero Section */}
        <section className="relative pt-8 md:pt-12 pb-8 md:pb-12 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4" style={{ color: '#FF6347' }}>
                Discover Your Next<br className="sm:hidden" /> Naturist Destination
              </h1>
              <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto" style={{ color: '#1A1A1A' }}>
                Explore authentic clothing-optional resorts and hotels across the globe
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="px-4 pb-8">
          <div className="container mx-auto">
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full">
              <InteractiveMap 
                properties={properties} 
                onCountryClick={handleCountryClick}
                selectedCountry={selectedCountry}
              />
            </div>
            
            {selectedCountry && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Badge className="bg-brand text-white px-4 py-2 text-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  {selectedCountry}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCountry(null)}
                  className="hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="px-4 py-8 bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name, city, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 px-6 border-brand text-brand hover:bg-brand hover:text-white"
                >
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="bg-white rounded-lg p-6 mb-6 shadow-md space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Country Filter */}
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                        Country
                      </label>
                      <Select value={selectedCountry || ""} onValueChange={(value) => setSelectedCountry(value || null)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="All Countries" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Countries</SelectItem>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                        Sort By
                      </label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="name">Name: A to Z</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                        Price Range: €{priceRange[0]} - €{priceRange[1]}
                      </label>
                      <Slider
                        min={0}
                        max={500}
                        step={10}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="mt-4"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={clearFilters}
                      className="text-brand hover:bg-red-50"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              )}

              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#FF6347' }}>
                    {selectedCountry ? `Properties in ${selectedCountry}` : 'All Properties'}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: '#1A1A1A' }}>
                    {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
                  </p>
                </div>
              </div>

              {/* Property Grid */}
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
                    No properties found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <Button onClick={clearFilters} className="bg-brand hover:bg-brand/90 text-white">
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 md:py-12 px-4" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
              <div className="col-span-2 md:col-span-1">
                <h4 className="font-bold text-base md:text-lg mb-3 md:mb-4" style={{ color: '#FF6347' }}>GO/NEWD</h4>
                <p className="text-xs md:text-sm text-gray-300">The world's leading naturist accommodation marketplace</p>
              </div>
              <div>
                <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base text-white">Company</h4>
                <ul className="space-y-2 text-xs md:text-sm text-gray-300">
                  <li className="hover:text-[#FF6347] cursor-pointer transition-colors">About Us</li>
                  <li className="hover:text-[#FF6347] cursor-pointer transition-colors">Careers</li>
                  <li className="hover:text-[#FF6347] cursor-pointer transition-colors">Press</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base text-white">Support</h4>
                <ul className="space-y-2 text-xs md:text-sm text-gray-300">
                  <li className="hover:text-[#FF6347] cursor-pointer transition-colors">Help Center</li>
                  <li className="hover:text-[#FF6347] cursor-pointer transition-colors">Safety</li>
                  <li className="hover:text-[#FF6347] cursor-pointer transition-colors">Contact Us</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base text-white">Legal</h4>
                <ul className="space-y-2 text-xs md:text-sm text-gray-300">
                  <li className="hover:text-[#FF6347] cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-[#FF6347] cursor-pointer transition-colors">Terms of Service</li>
                  <li className="hover:text-[#FF6347] cursor-pointer transition-colors">Cookie Policy</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6 md:pt-8 text-center text-xs md:text-sm text-gray-400">
              <p>&copy; 2026 GO/NEWD. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}