import { memo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapProperty {
  id: string;
  name: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  image: string;
  price: number;
  rating: number;
}

interface InteractiveMapProps {
  properties: MapProperty[];
  selectedCountries: string[];
  onCountryClick: (country: string) => void;
}

export const InteractiveMap = memo(function InteractiveMap({
  properties,
  selectedCountries,
  onCountryClick,
}: InteractiveMapProps) {
  const [hoveredProperty, setHoveredProperty] = useState<MapProperty | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  return (
    <div className="relative w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white rounded-lg shadow-md hover:bg-gray-50 flex items-center justify-center text-xl font-bold"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white rounded-lg shadow-md hover:bg-gray-50 flex items-center justify-center text-xl font-bold"
          aria-label="Zoom out"
        >
          −
        </button>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 147,
        }}
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={zoom}
          center={[0, 20]}
          disablePanning={zoom === 1}
          minZoom={1}
          maxZoom={4}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const isSelected = selectedCountries.includes(countryName);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onCountryClick(countryName)}
                    style={{
                      default: {
                        fill: isSelected ? "#FF6347" : "#E5E7EB",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: isSelected ? "#FF6347" : "#D1D5DB",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#FF6347",
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
            const isCountrySelected = selectedCountries.includes(property.country);
            
            return (
              <Marker
                key={property.id}
                coordinates={[property.lng, property.lat]}
                onMouseEnter={() => setHoveredProperty(property)}
                onMouseLeave={() => setHoveredProperty(null)}
              >
                <circle
                  r={6}
                  fill={isCountrySelected ? "#000000" : "#FF6347"}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  style={{ cursor: "pointer" }}
                />
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Property Hover Card */}
      {hoveredProperty && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-xl p-4 max-w-xs z-20">
          <h3 className="font-bold text-lg mb-1">{hoveredProperty.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{hoveredProperty.location}</p>
          <div className="flex items-center justify-between">
            <span className="text-orange-600 font-bold">
              ${hoveredProperty.price}/night
            </span>
            <span className="text-sm text-gray-700">
              ⭐ {hoveredProperty.rating}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});