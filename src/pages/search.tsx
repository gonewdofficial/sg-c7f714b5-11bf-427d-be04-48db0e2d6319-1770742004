import { useState, useMemo, useEffect } from "react";
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
import { Property, SearchFilters } from "@/types";
import { Search, MapPin, CalendarIcon, Users, SlidersHorizontal, X } from "lucide-react";
import { format } from "date-fns";
import { SEO } from "@/components/SEO";
import { getVenues } from "@/services/venueService";
import type { Database } from "@/integrations/supabase/types";

type Venue = Database["public"]["Tables"]["venues"]["Row"];

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
  const [showFilters, setShowFilters] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    setLoading(true);
    const { venues: data } = await getVenues();
    setVenues(data.filter(v => v.status === "active"));
    setLoading(false);
  };

  const propertyTypes = ["hotel", "resort", "campsite", "villa", "bungalow"];
  const naturistTypes = ["clothing-optional", "fully-naturist", "naturist-friendly"];
  const allAmenities = ["Pool", "Spa", "Restaurant", "Bar", "Beach Access", "Gym", "Sauna", "Yoga Studio", "Tennis Court", "Hot Tub", "Garden", "Bike Rental", "Water Sports", "Nightclub", "Kids Club"];

  const filteredProperties = useMemo(() => {
    const result = venues.filter(venue => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch = 
          venue.name.toLowerCase().includes(term) ||
          venue.location.toLowerCase().includes(term) ||
          venue.country.toLowerCase().includes(term) ||
          (venue.description && venue.description.toLowerCase().includes(term));
        if (!matchesSearch) return false;
      }

      if (filters.propertyType && filters.propertyType.length > 0) {
        if (!filters.propertyType.includes(venue.accommodation_type)) return false;
      }

      return true;
    });

    if (sortBy === "rating") {
      result.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
    } else if (sortBy === "featured") {
      result.sort((a, b) => (b.total_reviews || 0) - (a.total_reviews || 0));
    }

    return result;
  }, [venues, filters, searchTerm, sortBy]);

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
        title="Search Naturist Hotels & Resorts - GO/NEWD"
        description="Browse and filter naturist accommodations worldwide. Find the perfect resort with our advanced search tools."
      />
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Search Header - Mobile First */}
        <div className="bg-white border-b sticky top-16 z-40">
          <div className="container mx-auto py-4 px-4">
            <div className="flex flex-col gap-3">
              {/* Search Input */}
              <div className="relative w-full">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <Input
                  placeholder="Search location, property name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 w-full"
                />
              </div>

              {/* Date and Guest Pickers - Mobile Optimized */}
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-12 justify-start text-left font-normal w-full">
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate text-sm">{checkIn ? format(checkIn, "MMM dd") : "Check-in"}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-12 justify-start text-left font-normal w-full">
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate text-sm">{checkOut ? format(checkOut, "MMM dd") : "Check-out"}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests and Search Button */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    type="number"
                    min="1"
                    value={filters.guests}
                    onChange={(e) => setFilters(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                    className="h-12 pl-10"
                    placeholder="Guests"
                  />
                </div>
                <Button className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shrink-0">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar - Mobile Drawer */}
            {showFilters && (
              <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowFilters(false)}>
                <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5" />
                      Filters
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <Label className="text-base font-semibold mb-3 block">Price per Night</Label>
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

                  <Button onClick={clearFilters} variant="outline" className="w-full">
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Desktop Filters */}
            <aside className="hidden lg:block w-80 shrink-0">
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

                {/* Property Type */}
                <div className="mb-6">
                  <Label className="text-base font-semibold mb-3 block">Property Type</Label>
                  <div className="space-y-3">
                    {propertyTypes.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`desktop-${type}`}
                          checked={filters.propertyType?.includes(type)}
                          onCheckedChange={() => togglePropertyType(type)}
                        />
                        <label htmlFor={`desktop-${type}`} className="text-sm capitalize cursor-pointer">
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
                          id={`desktop-nat-${type}`}
                          checked={filters.naturistType?.includes(type)}
                          onCheckedChange={() => toggleNaturistType(type)}
                        />
                        <label htmlFor={`desktop-nat-${type}`} className="text-sm capitalize cursor-pointer">
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
                          id={`desktop-amenity-${amenity}`}
                          checked={filters.amenities?.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <label htmlFor={`desktop-amenity-${amenity}`} className="text-sm cursor-pointer">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Results */}
            <main className="flex-1 min-w-0">
              <div className="bg-white rounded-xl p-4 md:p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold mb-1">
                      {loading ? "Loading..." : `${filteredProperties.length} Properties Found`}
                    </h1>
                    {searchTerm && (
                      <p className="text-sm md:text-base text-gray-600 truncate">
                        Results for "{searchTerm}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden flex-1 sm:flex-none"
                      onClick={() => setShowFilters(true)}
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-[180px]">
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
                {((filters.propertyType?.length ?? 0) > 0 || (filters.naturistType?.length ?? 0) > 0 || (filters.amenities?.length ?? 0) > 0) && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    {filters.propertyType?.map(type => (
                      <Button
                        key={type}
                        variant="secondary"
                        size="sm"
                        onClick={() => togglePropertyType(type)}
                        className="capitalize text-xs"
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
                        className="capitalize text-xs"
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
                        className="text-xs"
                      >
                        {amenity}
                        <X className="h-3 w-3 ml-2" />
                      </Button>
                    ))}
                    {filters.amenities && filters.amenities.length > 3 && (
                      <span className="text-xs text-gray-600 py-1">
                        +{filters.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Property Grid - Mobile First */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                      <div className="bg-gray-200 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {filteredProperties.map((venue) => (
                    <div key={venue.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{venue.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{venue.location}, {venue.country}</p>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{venue.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-semibold">{venue.average_rating?.toFixed(1) || "New"}</span>
                            {venue.total_reviews > 0 && (
                              <span className="text-gray-500 text-sm">({venue.total_reviews})</span>
                            )}
                          </div>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                            {venue.accommodation_type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 md:p-12 text-center">
                  <Search className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg md:text-xl font-bold mb-2">No properties found</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
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