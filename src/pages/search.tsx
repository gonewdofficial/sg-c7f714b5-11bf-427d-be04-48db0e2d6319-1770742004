import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { PropertyCard } from "@/components/PropertyCard";
import { InteractiveMap } from "@/components/InteractiveMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { getVenues } from "@/services/venueService";

const propertyTypes = ["hotel", "resort", "campsite", "villa", "bungalow"];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    countries: [] as string[],
    propertyTypes: [] as string[],
    priceRange: [0, 1000] as [number, number],
    rating: 0,
    amenities: [] as string[],
  });

  useEffect(() => {
    async function loadVenues() {
      try {
        setLoading(true);
        const data = await getVenues();
        console.log("Loaded venues:", data);
        setVenues(data);
      } catch (error) {
        console.error("Error loading venues:", error);
      } finally {
        setLoading(false);
      }
    }
    loadVenues();
  }, []);

  const filteredProperties = useMemo(() => {
    let result = venues;

    if (filters.countries.length > 0) {
      result = result.filter((p) => filters.countries.includes(p.country));
    }

    if (filters.propertyTypes.length > 0) {
      result = result.filter((p) =>
        filters.propertyTypes.includes(p.property_type)
      );
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      result = result.filter(
        (p) =>
          p.price_per_night >= filters.priceRange[0] &&
          p.price_per_night <= filters.priceRange[1]
      );
    }

    if (filters.rating > 0) {
      result = result.filter((p) => (p.rating || 0) >= filters.rating);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.location.toLowerCase().includes(term) ||
          p.country.toLowerCase().includes(term)
      );
    }

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price_per_night - b.price_per_night);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price_per_night - a.price_per_night);
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [venues, filters, searchTerm, sortBy]);

  const handleCountryToggle = (country: string) => {
    setFilters((prev) => ({
      ...prev,
      countries: prev.countries.includes(country)
        ? prev.countries.filter((c) => c !== country)
        : [...prev.countries, country],
    }));
  };

  const handlePropertyTypeToggle = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }));
  };

  const mapProperties = venues.map(v => ({
    id: v.id,
    name: v.name,
    location: v.location,
    country: v.country,
    latitude: v.latitude || 0,
    longitude: v.longitude || 0,
    image: v.main_image || "/placeholder.jpg",
    price: v.price_per_night,
    rating: v.rating || 0,
  }));

  return (
    <>
      <SEO
        title="Search Naturist Properties - Find Your Perfect Getaway"
        description="Browse and search naturist hotels, resorts, and campgrounds worldwide."
      />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by destination, property name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg"
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">Explore locations</h2>
            <InteractiveMap
              properties={mapProperties}
              selectedCountries={filters.countries}
              onCountryClick={handleCountryToggle}
            />
          </div>

          <div className="flex gap-8">
            <aside className={`${showFilters ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden`}>
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <Label className="font-semibold mb-3 block">Property Type</Label>
                  <div className="space-y-2">
                    {propertyTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={filters.propertyTypes.includes(type)}
                          onCheckedChange={() => handlePropertyTypeToggle(type)}
                        />
                        <label
                          htmlFor={type}
                          className="text-sm capitalize cursor-pointer"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-semibold mb-3 block">
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </Label>
                  <Slider
                    min={0}
                    max={1000}
                    step={10}
                    value={filters.priceRange}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: value as [number, number],
                      }))
                    }
                  />
                </div>

                <div>
                  <Label className="font-semibold mb-3 block">
                    Minimum Rating: {filters.rating} stars
                  </Label>
                  <Slider
                    min={0}
                    max={5}
                    step={0.5}
                    value={[filters.rating]}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, rating: value[0] }))
                    }
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setFilters({
                      countries: [],
                      propertyTypes: [],
                      priceRange: [0, 1000],
                      rating: 0,
                      amenities: [],
                    })
                  }
                >
                  Clear All Filters
                </Button>
              </div>
            </aside>

            <main className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {loading ? "Loading..." : `${filteredProperties.length} properties found`}
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading properties...</p>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No properties found</h3>
                  <p className="text-gray-500">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      id={property.id}
                      name={property.name}
                      location={property.location}
                      image={property.main_image || "/placeholder.jpg"}
                      price={property.price_per_night}
                      rating={property.rating || 0}
                      reviews={0}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}