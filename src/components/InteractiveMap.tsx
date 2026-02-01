import { memo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { Property } from "@/types";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface InteractiveMapProps {
  properties: Property[];
  onCountryClick?: (country: string) => void;
  onPropertyClick?: (property: Property) => void;
}

export const InteractiveMap = memo(function InteractiveMap({
  properties,
  onCountryClick,
  onPropertyClick
}: InteractiveMapProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);

  const handleCountryClick = (geo: any) => {
    const countryName = geo.properties.name;
    
    // Always notify parent of the click with the country name
    // The parent (index.tsx) handles the toggle logic (add/remove from list)
    onCountryClick?.(countryName);

    // Update local visual state
    if (selectedCountry === countryName) {
      setSelectedCountry(null);
    } else {
      setSelectedCountry(countryName);
    }
  };

  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-50 rounded-lg overflow-hidden relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: [10, 50]
        }}
      >
        <ZoomableGroup
          center={[10, 50]}
          zoom={1}
          minZoom={1}
          maxZoom={4}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isSelected = selectedCountry === geo.properties.name;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    style={{
                      default: {
                        fill: isSelected ? "#FF6347" : "#D1D5DB",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer"
                      },
                      hover: {
                        fill: isSelected ? "#FF6347" : "#9CA3AF",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer"
                      },
                      pressed: {
                        fill: "#FF6347",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* DATA POINTS - ALWAYS VISIBLE IN STATIC BLACK */}
          {properties.map((property) => {
            if (!property.location?.coordinates) return null;

            return (
              <Marker
                key={property.id}
                coordinates={[
                  property.location.coordinates.lng,
                  property.location.coordinates.lat
                ]}
                onMouseEnter={() => setHoveredProperty(property)}
                onMouseLeave={() => setHoveredProperty(null)}
                onClick={() => onPropertyClick?.(property)}
              >
                <circle
                  r={4}
                  fill="#000000"
                  stroke="#FFFFFF"
                  strokeWidth={1.5}
                  style={{ cursor: "pointer" }}
                />
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {hoveredProperty && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg max-w-xs z-10">
          <h3 className="font-bold text-sm text-gray-900">{hoveredProperty.name}</h3>
          <p className="text-xs text-gray-600 mt-1">
            {hoveredProperty.location.city}, {hoveredProperty.location.country}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-semibold text-[#FF6347]">
              ⭐ {hoveredProperty.rating}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});