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
  onClearFilters?: () => void;
}

export function SearchBar({
  availableCountries,
  availableTags,
  selectedCountries,
  onCountrySelect,
  selectedTags = [],
  onTagToggle,
  onClearFilters
}: SearchBarProps) {
  const [showAllTags, setShowAllTags] = useState(false);

  const handleCountryChange = (value: string) => {
    if (value && value !== "placeholder") {
      onCountrySelect(value);
    }
  };

  const visibleTags = showAllTags ? availableTags : availableTags.slice(0, 8);

  const hasActiveFilters = selectedCountries.length > 0 || selectedTags.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
        
        {/* Country Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-orange-500" />
            Search for a country
          </label>
          <Select value="placeholder" onValueChange={handleCountryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a country to add" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder" disabled>
                Select a country to add
              </SelectItem>
              {availableCountries.map((country) => (
                <SelectItem key={country} value={country}>
                  <span className="capitalize">{country}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Selected Countries Display */}
          {selectedCountries.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedCountries.map((country) => (
                <div
                  key={country}
                  className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm"
                >
                  <span className="capitalize font-medium">{country}</span>
                  <button
                    onClick={() => onCountrySelect(country)}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
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

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="w-full border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            Clear All Filters
          </Button>
        )}

        {/* Search Button */}
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-xl text-lg font-semibold">
          <Search className="mr-2 h-5 w-5" />
          Start Exploring
        </Button>
      </div>
    </div>
  );
}