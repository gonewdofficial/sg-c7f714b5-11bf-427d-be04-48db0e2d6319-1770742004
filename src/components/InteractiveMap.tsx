import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import type { Property } from "@/types";

interface InteractiveMapProps {
  properties: Property[];
  onCountryClick: (countries: string[]) => void;
  selectedCountries: string[];
}

export function InteractiveMap({ properties, onCountryClick, selectedCountries }: InteractiveMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const countriesWithVenues = [...new Set(properties.map((p) => p.location.country))];

  const handleCountryClick = (countryName: string) => {
    let newSelection;
    if (selectedCountries.includes(countryName)) {
      newSelection = selectedCountries.filter((c) => c !== countryName);
    } else {
      newSelection = [...selectedCountries, countryName];
    }
    onCountryClick(newSelection);
  };

  return (
    <div className="relative w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 140
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;
              const isSelected = selectedCountries.includes(countryName);
              const hasProperties = properties.some(
                (p) => p.location.country === countryName
              );

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleCountryClick(countryName)}
                  style={{
                    default: {
                      fill: isSelected
                        ? "#FF6B35"
                        : hasProperties
                        ? "#60A5FA"
                        : "#E5E7EB",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: isSelected ? "#FF6B35" : "#FCA5A5",
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

        {/* Property Markers */}
        {properties.map((property) => {
          if (
            property.location.coordinates &&
            typeof property.location.coordinates.lat === "number" &&
            typeof property.location.coordinates.lng === "number"
          ) {
            return (
              <Marker
                key={property.id}
                coordinates={[
                  property.location.coordinates.lng,
                  property.location.coordinates.lat,
                ]}
              >
                <circle
                  r={6}
                  fill="#FF6B35"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProperty(property);
                  }}
                />
              </Marker>
            );
          }
          return null;
        })}
      </ComposableMap>

      {selectedProperty && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-xl max-w-sm z-10 border border-gray-100">
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg mb-1 pr-6">{selectedProperty.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{selectedProperty.location.city}, {selectedProperty.location.country}</p>
          <div className="flex items-center gap-2 mb-2">
             <span className="px-2 py-0.5 bg-gray-100 rounded text-xs uppercase font-medium tracking-wide">
               {selectedProperty.propertyType}
             </span>
             <span className="text-sm text-[#FF6B35] font-semibold">
               ⭐ {selectedProperty.rating.toFixed(1)} <span className="text-gray-400 font-normal">({selectedProperty.reviewCount})</span>
             </span>
          </div>
          <p className="text-sm font-medium">
             {selectedProperty.price.currency} {selectedProperty.price.perNight} <span className="font-normal text-gray-500">/ night</span>
          </p>
        </div>
      )}
    </div>
  );
}