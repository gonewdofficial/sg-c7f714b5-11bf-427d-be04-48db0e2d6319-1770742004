import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Property } from "@/types";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Map GeoJSON country names to our property data country names
const countryNameMap: Record<string, string> = {
  "United States of America": "United States",
  "United States": "United States",
  "USA": "United States",
  "Spain": "Spain",
  "France": "France",
  "Greece": "Greece",
  "Croatia": "Croatia",
  "Australia": "Australia",
  "Brazil": "Brazil",
  "Thailand": "Thailand",
  "Austria": "Austria",
  "Portugal": "Portugal",
  "Switzerland": "Switzerland",
};

const normalizeCountryName = (countryName: string): string => {
  return countryNameMap[countryName] || countryName;
};

interface InteractiveMapProps {
  properties: Property[];
  onCountryClick?: (countryName: string) => void;
  selectedCountry?: string | null;
}

export function InteractiveMap({ properties, onCountryClick, selectedCountry }: InteractiveMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Get unique coordinates for markers
  const markers = properties
    .filter(p => p.location.coordinates && (p.location.coordinates.lat !== 0 || p.location.coordinates.lng !== 0))
    .map(property => ({
      coordinates: [property.location.coordinates!.lng, property.location.coordinates!.lat] as [number, number],
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
              const normalizedCountryName = normalizeCountryName(countryName);
              const isSelected = selectedCountry === normalizedCountryName;
              const isHovered = hoveredCountry === countryName;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredCountry(countryName)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => {
                    if (onCountryClick) {
                      onCountryClick(countryName);
                    }
                  }}
                  style={{
                    default: {
                      fill: isSelected ? "#93C5FD" : "#E5E7EB",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: isHovered ? "#BFDBFE" : "#E5E7EB",
                      stroke: "#FFFFFF",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "#93C5FD",
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

        {/* Property Markers - Orange Dots */}
        {markers.map((marker) => (
          <Marker key={marker.id} coordinates={marker.coordinates}>
            <g>
              <circle
                r={4}
                fill="#FF8C42"
                stroke="#FFFFFF"
                strokeWidth={2}
                className="animate-pulse"
              />
              <circle
                r={8}
                fill="#FF8C42"
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
            <div className="w-3 h-3 rounded-full bg-[#FF8C42] animate-pulse" />
            <span style={{ color: '#1A1A1A' }}>Naturist Locations</span>
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