import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import type { Property } from "@/types";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface InteractiveMapProps {
  properties: Property[];
  onCountryClick: (country: string) => void;
  selectedCountries: string[];
}

export function InteractiveMap({ properties, onCountryClick, selectedCountries }: InteractiveMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const countriesWithVenues = [...new Set(properties.map((p) => p.location.country))];

  const isCountrySelected = (countryName: string) => {
    return selectedCountries.includes(countryName);
  };

  const hasVenues = (countryName: string) => {
    return countriesWithVenues.includes(countryName);
  };

  return (
    <div className="relative w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: [15, 20],
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;
              const selected = isCountrySelected(countryName);
              const hasProperty = hasVenues(countryName);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onCountryClick(countryName)}
                  style={{
                    default: {
                      fill: selected ? "#FF6B35" : hasProperty ? "#60A5FA" : "#E5E7EB",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: selected ? "#FF6B35" : hasProperty ? "#3B82F6" : "#D1D5DB",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "#FF6B35",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>

        {properties
          .filter((property) => property.location.coordinates?.lat && property.location.coordinates?.lng)
          .map((property) => (
            <Marker
              key={property.id}
              coordinates={[property.location.coordinates.lng, property.location.coordinates.lat]}
              onClick={() => setSelectedProperty(property)}
            >
              <circle r={6} fill="#FF6B35" stroke="#fff" strokeWidth={2} className="cursor-pointer hover:r-8" />
            </Marker>
          ))}
      </ComposableMap>

      {selectedProperty && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm z-10">
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg mb-1">{selectedProperty.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{selectedProperty.location.city}, {selectedProperty.location.country}</p>
          <p className="text-sm mb-2">{selectedProperty.propertyType}</p>
          <p className="text-sm text-brand font-semibold">⭐ {selectedProperty.rating.toFixed(1)} ({selectedProperty.reviewCount} reviews)</p>
        </div>
      )}
    </div>
  );
}