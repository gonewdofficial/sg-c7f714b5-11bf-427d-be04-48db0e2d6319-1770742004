import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { properties } from "@/lib/mockData";
import { Property, SearchFilters } from "@/types";
import { Search, MapPin, CalendarIcon, Users, SlidersHorizontal, X } from "lucide-react";
import { format } from "date-fns";
import { SEO } from "@/components/SEO";

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    priceMin: 0,
    priceMax: 500,
    guests: 2,
    propertyType: [],
    naturistType: [],
    amenities: [],
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(true);

  const propertyTypes = ["hotel", "resort", "campsite", "villa", "bungalow"];
  const naturistTypes = ["clothing-optional", "fully-naturist", "naturist-friendly"];
  const allAmenities = ["Pool", "Spa", "Restaurant", "Bar", "Beach Access", "Gym", "Sauna", "Yoga Studio", "Tennis Court", "Hot Tub", "Garden", "Bike Rental", "Water Sports", "Nightclub", "Kids Club"];

  const filteredProperties = useMemo(() => {
    const result = properties.filter(property => {
      // Search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch = 
          property.name.toLowerCase().includes(term) ||
          property.location.city.toLowerCase().includes(term) ||
          property.location.country.toLowerCase().includes(term) ||
          property.description.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      // Price filter
      if (property.price.perNight < filters.priceMin! || property.price.perNight > filters.priceMax!) {
        return false;
      }

      // Property type filter
      if (filters.propertyType && filters.propertyType.length > 0) {
        if (!filters.propertyType.includes(property.propertyType)) return false;
      }

      // Naturist type filter
      if (filters.naturistType && filters.naturistType.length > 0) {
        if (!filters.naturistType.includes(property.naturistType)) return false;
      }

      // Amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          property.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      // Capacity filter
      if (filters.guests && property.capacity.guests < filters.guests) {
        return false;
      }

      return true;
    });

    // Sort results
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price.perNight - b.price.perNight);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price.perNight - a.price.perNight);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "featured") {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [filters, searchTerm, sortBy]);

  const togglePropertyType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyType: prev.propertyType?.includes(type)
        ? prev.propertyType.filter(t => t !== type)
        : [...(prev.propertyType || []), type]
    }));
  };

  const toggleNaturistType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      naturistType: prev.naturistType?.includes(type)
        ? prev.naturistType.filter(t => t !== type)
        : [...(prev.naturistType || []), type]
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(prev.amenities || []), amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceMin: 0,
      priceMax: 500,
      guests: 2,
      propertyType: [],
      naturistType: [],
      amenities: [],
    });
    setSearchTerm("");
    setCheckIn(undefined);
    setCheckOut(undefined);
  };

  return (
    <>
      <SEO 
        title="Search Naturist Hotels & Resorts - NaturEscape"
        description="Browse and filter naturist accommodations worldwide. Find the perfect resort with our advanced search tools."
      />
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Search Header */}
        <div className="bg-white border-b sticky top-16 z-40">
          <div className="container mx-auto py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search location, property name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-12 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {checkIn ? format(checkIn, "MMM dd") : "Check-in"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-12 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {checkOut ? format(checkOut, "MMM dd") : "Check-out"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                </PopoverContent>
              </Popover>

              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  value={filters.guests}
                  onChange={(e) => setFilters(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                  className="h-12 w-20"
                  placeholder="2"
                />
                <Button className="h-12 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-8">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 shrink-0`}>
              <div className="bg-white rounded-xl p-6 sticky top-32">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filters
                  </h2>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <Label className="text-base font-semibold mb-3 block">Price per Night</Label>
                  <div className="space-y-4">
                    <Slider
                      min={0}
                      max={500}
                      step={10}
                      value={[filters.priceMin || 0, filters.priceMax || 500]}
                      onValueChange={(values) => setFilters(prev => ({ 
                        ...prev, 
                        priceMin: values[0], 
                        priceMax: values[1] 
                      }))}
                      className="my-4"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">€{filters.priceMin}</span>
                      <span className="font-medium">€{filters.priceMax}+</span>
                    </div>
                  </div>
                </div>

                {/* Property Type */}
                <div className="mb-6">
                  <Label className="text-base font-semibold mb-3 block">Property Type</Label>
                  <div className="space-y-3">
                    {propertyTypes.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={filters.propertyType?.includes(type)}
                          onCheckedChange={() => togglePropertyType(type)}
                        />
                        <label htmlFor={type} className="text-sm capitalize cursor-pointer">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Naturist Type */}
                <div className="mb-6">
                  <Label className="text-base font-semibold mb-3 block">Naturist Experience</Label>
                  <div className="space-y-3">
                    {naturistTypes.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`nat-${type}`}
                          checked={filters.naturistType?.includes(type)}
                          onCheckedChange={() => toggleNaturistType(type)}
                        />
                        <label htmlFor={`nat-${type}`} className="text-sm capitalize cursor-pointer">
                          {type.replace('-', ' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <Label className="text-base font-semibold mb-3 block">Amenities</Label>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {allAmenities.map(amenity => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={filters.amenities?.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Results */}
            <main className="flex-1">
              <div className="bg-white rounded-xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">
                      {filteredProperties.length} Properties Found
                    </h1>
                    <p className="text-gray-600">
                      {searchTerm && `Results for "${searchTerm}"`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active Filters */}
                {(filters.propertyType?.length! > 0 || filters.naturistType?.length! > 0 || filters.amenities?.length! > 0) && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    {filters.propertyType?.map(type => (
                      <Button
                        key={type}
                        variant="secondary"
                        size="sm"
                        onClick={() => togglePropertyType(type)}
                        className="capitalize"
                      >
                        {type}
                        <X className="h-3 w-3 ml-2" />
                      </Button>
                    ))}
                    {filters.naturistType?.map(type => (
                      <Button
                        key={type}
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleNaturistType(type)}
                        className="capitalize"
                      >
                        {type.replace('-', ' ')}
                        <X className="h-3 w-3 ml-2" />
                      </Button>
                    ))}
                    {filters.amenities?.slice(0, 3).map(amenity => (
                      <Button
                        key={amenity}
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleAmenity(amenity)}
                      >
                        {amenity}
                        <X className="h-3 w-3 ml-2" />
                      </Button>
                    ))}
                    {filters.amenities && filters.amenities.length > 3 && (
                      <span className="text-sm text-gray-600 py-1">
                        +{filters.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Property Grid */}
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-12 text-center">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No properties found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}