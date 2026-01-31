import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, MapPin, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBarProps {
  availableCountries: string[];
  availableTags: string[];
  selectedCountries: string[];
  onCountrySelect: (country: string) => void;
  selectedTags?: string[];
  onTagToggle?: (tag: string) => void;
}

export function SearchBar({
  availableCountries,
  availableTags,
  selectedCountries,
  onCountrySelect,
  selectedTags = [],
  onTagToggle
}: SearchBarProps) {
  const [showAllTags, setShowAllTags] = useState(false);

  const handleCountryChange = (value: string) => {
    if (value === "all") {
      selectedCountries.forEach((country) => onCountrySelect(country));
    } else {
      onCountrySelect(value);
    }
  };

  const visibleTags = showAllTags ? availableTags : availableTags.slice(0, 8);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
        
        {/* Country Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-orange-500" />
            Search for a country
          </label>
          <Select onValueChange={handleCountryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {availableCountries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags/Facilities Filter */}
        {availableTags.length > 0 && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Filter by amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {visibleTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => onTagToggle?.(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            
            {availableTags.length > 8 && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                {showAllTags ? "Show Less" : `Show All (${availableTags.length})`}
              </button>
            )}
          </div>
        )}

        {/* Search Button */}
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-xl text-lg font-semibold">
          <Search className="mr-2 h-5 w-5" />
          Search Properties
        </Button>
      </div>
    </div>
  );
}