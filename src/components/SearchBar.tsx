import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearch: () => void;
  selectedCountries: string[];
  onCountrySelect: (country: string) => void;
  availableCountries: string[];
  availableTags: string[];
}

export function SearchBar({ 
  onSearch, 
  selectedCountries, 
  onCountrySelect, 
  availableCountries,
  availableTags 
}: SearchBarProps) {
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-[2fr,auto] gap-4 items-start">
        {/* Country Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Where to?
          </label>
          <Select onValueChange={onCountrySelect}>
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

        {/* Search Button */}
        <Button
          onClick={onSearch}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-[56px] mt-7"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Admin Tags Section - Only shown when tags exist */}
      {availableTags.length > 0 && (
        <div className="mt-4 space-y-2">
          <label className="text-sm font-medium text-gray-700">Filter by Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}