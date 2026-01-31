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

  const getCountryFillColor = (geo: any) => {
    const countryName = geo.properties.name;
    const isSelected = selectedCountries.includes(countryName);
    
    if (isSelected) {
      return "#FF6B35"; // Orange when selected
    }
    return "#E5E7EB"; // Gray by default
  };

  const getMarkerColor = (property: Property) => {
    const isCountrySelected = selectedCountries.includes(property.location.country);
    
    if (isCountrySelected) {
      return "#1A1A1A"; // Black when country is selected
    }
    return "#FF6B35"; // Orange by default
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
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
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryFillColor(geo)}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { 
                        fill: "#FFA07A",
                        outline: "none",
                        cursor: "pointer"
                      },
                      pressed: { 
                        fill: "#FF6B35",
                        outline: "none" 
                      }
                    }}
                    onClick={() => onCountryClick(countryName)}
                  />
                );
              })
            }
          </Geographies>

          {properties
            .filter(p => p.location.coordinates) // Only render markers for properties with coordinates
            .map((property) => (
            <Marker
              key={property.id}
              coordinates={[property.location.coordinates!.lng, property.location.coordinates!.lat]}
              onMouseEnter={() => setSelectedProperty(property)}
              onMouseLeave={() => setSelectedProperty(null)}
            >
              <circle
                r={4}
                fill={getMarkerColor(property)}
                stroke="#fff"
                strokeWidth={1.5}
                style={{ cursor: "pointer" }}
              />
            </Marker>
          ))}
        </ComposableMap>
      </div>

      {selectedProperty && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="font-semibold text-lg">{selectedProperty.name}</h3>
          <p className="text-sm text-gray-600">
            {selectedProperty.location.city}, {selectedProperty.location.country}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            ⭐ {selectedProperty.rating} ({selectedProperty.reviewCount})
          </p>
        </div>
      )}
    </div>
  );
}