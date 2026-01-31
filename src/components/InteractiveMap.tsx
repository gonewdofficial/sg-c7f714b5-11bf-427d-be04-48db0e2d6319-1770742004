import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import { Property } from "@/types";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface InteractiveMapProps {
  properties: Property[];
  selectedCountries: string[];
  onCountryClick: (country: string) => void;
}

export function InteractiveMap({ properties, selectedCountries, onCountryClick }: InteractiveMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const countriesWithProperties = Array.from(new Set(properties.map((p) => p.location.country)));

  return (
    <div className="relative w-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 80,
          center: [0, 20]
        }}
        width={800}
        height={400}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;
              const isSelected = selectedCountries.includes(countryName);
              const hasProperties = countriesWithProperties.includes(countryName);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    if (hasProperties) {
                      onCountryClick(countryName);
                    }
                  }}
                  style={{
                    default: {
                      fill: isSelected ? "#FF6B35" : "#E5E7EB",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: hasProperties ? "pointer" : "default"
                    },
                    hover: {
                      fill: hasProperties ? (isSelected ? "#FF8C5A" : "#FFA07A") : "#E5E7EB",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: hasProperties ? "pointer" : "default"
                    },
                    pressed: {
                      fill: "#FF6B35",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none"
                    }
                  }}
                />
              );
            })
          }
        </Geographies>

        {properties.map((property) => {
          const isCountrySelected = selectedCountries.includes(property.location.country);
          const markerColor = isCountrySelected ? "#1A1A1A" : "#FF6B35";

          return (
            <Marker
              key={property.id}
              coordinates={[property.location.coordinates.lng, property.location.coordinates.lat]}
              onMouseEnter={() => setSelectedProperty(property)}
              onMouseLeave={() => setSelectedProperty(null)}
            >
              <circle r={4} fill={markerColor} stroke="#fff" strokeWidth={1.5} style={{ cursor: "pointer" }} />
            </Marker>
          );
        })}
      </ComposableMap>

      {selectedProperty && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs z-10">
          <h3 className="font-semibold text-lg">{selectedProperty.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{selectedProperty.location.city}, {selectedProperty.location.country}</p>
          <p className="text-sm mt-2">
            <span className="text-orange-600 font-medium">★ {selectedProperty.rating}</span>
            <span className="text-gray-500 ml-1">({selectedProperty.reviewCount})</span>
          </p>
        </div>
      )}
    </div>
  );
}