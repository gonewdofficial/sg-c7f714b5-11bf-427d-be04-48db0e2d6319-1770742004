import { memo, useState, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Property } from "@/types";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface InteractiveMapProps {
  properties: Property[];
  selectedCountries: string[];
  onCountryClick: (country: string) => void;
}

const InteractiveMapComponent = ({ 
  properties, 
  selectedCountries = [],
  onCountryClick 
}: InteractiveMapProps) => {
  const [tooltipContent, setTooltipContent] = useState<{
    name: string;
    rating: number;
    x: number;
    y: number;
  } | null>(null);

  const handleCountryClick = useCallback((geo: any) => {
    const countryName = geo.properties.name || geo.properties.NAME || geo.properties.ADMIN;
    if (countryName) {
      const normalizedCountryName = countryName.toLowerCase();
      onCountryClick(normalizedCountryName);
    }
  }, [onCountryClick]);

  const getGeographyStyle = useCallback((geo: any) => {
    const countryName = geo.properties.name || geo.properties.NAME || geo.properties.ADMIN;
    const normalizedCountryName = countryName?.toLowerCase();
    const isSelected = selectedCountries.includes(normalizedCountryName);

    return {
      default: {
        fill: isSelected ? "#FF6347" : "#E5E7EB",
        stroke: "#FFFFFF",
        strokeWidth: 0.5,
        outline: "none",
      },
      hover: {
        fill: isSelected ? "#FF4500" : "#D1D5DB",
        stroke: "#FFFFFF",
        strokeWidth: 0.5,
        outline: "none",
        cursor: "pointer",
      },
      pressed: {
        fill: isSelected ? "#FF4500" : "#D1D5DB",
        stroke: "#FFFFFF",
        strokeWidth: 0.5,
        outline: "none",
      },
    };
  }, [selectedCountries]);

  return (
    <div 
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-50 rounded-lg overflow-hidden outline-none focus:outline-none"
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 147,
        }}
        style={{
          width: "100%",
          height: "100%",
          outline: "none",
        }}
      >
        <ZoomableGroup
          center={[0, 20]}
          zoom={1}
          minZoom={1}
          maxZoom={8}
          filterZoomEvent={(evt) => {
            return evt.type !== "wheel";
          }}
          style={{ outline: "none" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleCountryClick(geo)}
                  style={getGeographyStyle(geo)}
                />
              ))
            }
          </Geographies>

          {properties.map((property) => {
            if (!property.location?.coordinates) return null;
            
            return (
              <Marker
                key={property.id}
                coordinates={[
                  property.location.coordinates.lng,
                  property.location.coordinates.lat,
                ]}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipContent({
                    name: property.name,
                    rating: property.rating,
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  });
                }}
                onMouseLeave={() => setTooltipContent(null)}
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

      {tooltipContent && (
        <div
          className="absolute bg-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none z-50"
          style={{
            left: `${tooltipContent.x}px`,
            top: `${tooltipContent.y - 10}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-semibold">{tooltipContent.name}</div>
          <div className="flex items-center gap-1 text-yellow-500">
            ⭐ {tooltipContent.rating}
          </div>
        </div>
      )}
    </div>
  );
};

export const InteractiveMap = memo(InteractiveMapComponent);

InteractiveMap.displayName = "InteractiveMap";