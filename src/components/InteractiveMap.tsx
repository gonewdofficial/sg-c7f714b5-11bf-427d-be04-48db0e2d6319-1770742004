import { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Property {
  id: string;
  name: string;
  location: {
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  price: {
    perNight: number;
    currency: string;
  };
  rating: number;
}

interface InteractiveMapProps {
  properties: Property[];
  selectedCountry?: string;
  onCountryClick?: (country: string) => void;
  hoveredProperty?: string | null;
}

export const InteractiveMap = memo(({ 
  properties, 
  selectedCountry,
  onCountryClick,
  hoveredProperty 
}: InteractiveMapProps) => {
  const handleCountryClick = (geo: any) => {
    const countryName = geo.properties.name || geo.properties.NAME || geo.properties.ADMIN;
    if (onCountryClick && countryName) {
      onCountryClick(countryName);
    }
  };

  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-50 rounded-lg overflow-hidden relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 147,
          center: [0, 20],
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          center={[0, 20]}
          zoom={1}
          minZoom={1}
          maxZoom={8}
          translateExtent={[
            [-1000, -500],
            [1000, 500],
          ]}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name || geo.properties.NAME || geo.properties.ADMIN;
                const isSelected = selectedCountry === countryName;

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
                      },
                      hover: {
                        fill: isSelected ? "#FF6347" : "#9CA3AF",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      pressed: {
                        fill: "#FF6347",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                    }}
                    className="cursor-pointer transition-colors duration-200"
                  />
                );
              })
            }
          </Geographies>

          {/* DATA POINTS - ALWAYS VISIBLE IN STATIC BLACK */}
          {properties
            .filter((property) => property.location.coordinates)
            .map((property) => (
              <Marker
                key={property.id}
                coordinates={[
                  property.location.coordinates!.lng,
                  property.location.coordinates!.lat,
                ]}
              >
                <circle
                  r={hoveredProperty === property.id ? 8 : 6}
                  fill="#000000"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  className="transition-all duration-200 cursor-pointer"
                  style={{
                    filter: hoveredProperty === property.id ? "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" : "none",
                  }}
                />
              </Marker>
            ))}
        </ZoomableGroup>
      </ComposableMap>

      {hoveredProperty && properties.find((p) => p.id === hoveredProperty) && (
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-10 max-w-xs">
          <div className="font-semibold text-sm">
            {properties.find((p) => p.id === hoveredProperty)?.name}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {properties.find((p) => p.id === hoveredProperty)?.location.city},{" "}
            {properties.find((p) => p.id === hoveredProperty)?.location.country}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-bold" style={{ color: "#FF6347" }}>
              ${properties.find((p) => p.id === hoveredProperty)?.price.perNight}/night
            </span>
            <span className="text-xs text-gray-600">
              ⭐ {properties.find((p) => p.id === hoveredProperty)?.rating}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

InteractiveMap.displayName = "InteractiveMap";