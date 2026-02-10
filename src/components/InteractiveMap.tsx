import { memo, useState } from "react";
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
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const handleCountryClick = (geo: any) => {
    const countryName = geo.properties.name || geo.properties.NAME || geo.properties.ADMIN;
    if (countryName) {
      const normalizedCountryName = countryName.toLowerCase();
      onCountryClick(normalizedCountryName);
      setHoveredCountry(null);
    }
  };

  const getCountryFill = (geo: any, isHovered: boolean) => {
    const countryName = geo.properties.name || geo.properties.NAME || geo.properties.ADMIN;
    const normalizedCountryName = countryName?.toLowerCase();
    const isSelected = selectedCountries.includes(normalizedCountryName);

    if (isSelected) {
      return isHovered ? "#FF4500" : "#FF6347";
    }
    return isHovered ? "#D1D5DB" : "#E5E7EB";
  };

  return (
    <div 
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-50 rounded-lg overflow-hidden"
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 147,
        }}
        style={{
          width: "100%",
          height: "100%",
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
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name || geo.properties.NAME || geo.properties.ADMIN;
                const normalizedCountryName = countryName?.toLowerCase();
                const isHovered = hoveredCountry === normalizedCountryName;
                const fillColor = getCountryFill(geo, isHovered);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    onMouseEnter={() => setHoveredCountry(normalizedCountryName)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{
                      default: {
                        fill: fillColor,
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: fillColor,
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: fillColor,
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

          {properties.map((property) => {
            if (!property.location?.coordinates) return null;
            
            return (
              <Marker
                key={property.id}
                coordinates={[
                  property.location.coordinates.lng,
                  property.location.coordinates.lat,
                ]}
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
    </div>
  );
};

export const InteractiveMap = memo(InteractiveMapComponent, (prev, next) => {
  return (
    prev.selectedCountries.length === next.selectedCountries.length &&
    prev.selectedCountries.every((country, idx) => country === next.selectedCountries[idx]) &&
    prev.properties.length === next.properties.length
  );
});

InteractiveMap.displayName = "InteractiveMap";