import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Property } from "@/types";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface InteractiveMapProps {
  properties: Property[];
  onCountryClick?: (countryName: string) => void;
  selectedCountry?: string | null;
}

export function InteractiveMap({ properties, onCountryClick, selectedCountry }: InteractiveMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Get unique coordinates for markers
  const markers = properties.map(property => ({
    coordinates: property.location.coordinates,
    name: property.name,
    country: property.location.country,
    id: property.id,
  }));

  return (
    <div className="w-full h-full bg-gray-50 rounded-2xl overflow-hidden shadow-lg">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 140,
          center: [10, 20],
        }}
        className="w-full h-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;
              const isSelected = selectedCountry === countryName;
              const isHovered = hoveredCountry === countryName;
              const hasProperties = properties.some(
                p => p.location.country.toLowerCase() === countryName.toLowerCase()
              );

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredCountry(countryName)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => {
                    if (hasProperties && onCountryClick) {
                      onCountryClick(countryName);
                    }
                  }}
                  style={{
                    default: {
                      fill: isSelected 
                        ? "#60A5FA" 
                        : hasProperties 
                        ? "#E5E7EB" 
                        : "#F9FAFB",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: hasProperties ? "#BFDBFE" : "#F9FAFB",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: hasProperties ? "pointer" : "default",
                    },
                    pressed: {
                      fill: "#60A5FA",
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
        {markers.map((marker) => (
          <Marker key={marker.id} coordinates={marker.coordinates}>
            <g>
              <circle
                r={4}
                fill="#FF6347"
                stroke="#FFFFFF"
                strokeWidth={2}
                className="animate-pulse"
              />
              <circle
                r={8}
                fill="#FF6347"
                fillOpacity={0.3}
                className="animate-ping"
                style={{ animationDuration: '2s' }}
              />
            </g>
          </Marker>
        ))}
      </ComposableMap>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-md">
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-brand animate-pulse" />
            <span style={{ color: '#1A1A1A' }}>Properties</span>
          </div>
          <div className="flex items-center gap-1.5 ml-3">
            <div className="w-3 h-3 rounded-sm bg-gray-200" />
            <span style={{ color: '#1A1A1A' }}>Available</span>
          </div>
        </div>
      </div>

      {hoveredCountry && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur rounded-lg px-4 py-2 shadow-md">
          <p className="text-sm font-semibold" style={{ color: '#FF6347' }}>{hoveredCountry}</p>
        </div>
      )}
    </div>
  );
}