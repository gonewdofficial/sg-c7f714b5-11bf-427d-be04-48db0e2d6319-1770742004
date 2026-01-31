import { useState } from "react";
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
  onCountrySelect: (country: string) => void;
}

export function InteractiveMap({ properties, selectedCountries, onCountrySelect }: InteractiveMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleMoveEnd = (newPosition: { coordinates: [number, number]; zoom: number }) => {
    setPosition(newPosition);
  };

  const getCountryColor = (countryName: string) => {
    if (selectedCountries.includes(countryName)) {
      return "#FF6B35";
    }
    if (hoveredCountry === countryName) {
      return "#D1D5DB";
    }
    return "#E5E7EB";
  };

  const getMarkerColor = (property: Property) => {
    if (selectedCountries.includes(property.location.country)) {
      return "#1A1A1A";
    }
    return "#FF6B35";
  };

  return (
    <div className="relative w-full bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white hover:bg-gray-100 text-gray-700 font-bold w-10 h-10 rounded-lg shadow-md flex items-center justify-center transition-colors"
          aria-label="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white hover:bg-gray-100 text-gray-700 font-bold w-10 h-10 rounded-lg shadow-md flex items-center justify-center transition-colors"
          aria-label="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 80,
          center: [0, 20]
        }}
        width={800}
        height={400}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates as [number, number]}
          onMoveEnd={handleMoveEnd}
          maxZoom={4}
          minZoom={1}
          filterZoomEvent={(evt) => {
            return evt.type === "wheel" ? false : true;
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryColor(countryName)}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: selectedCountries.includes(countryName) ? "#FF6B35" : "#D1D5DB" },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={() => setHoveredCountry(countryName)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => onCountrySelect(countryName)}
                    className="cursor-pointer transition-colors duration-200"
                  />
                );
              })
            }
          </Geographies>

          {/* Property Markers */}
          {properties
            .filter((p) => p.location?.coordinates?.lat && p.location?.coordinates?.lng)
            .map((property) => {
              const isInSelectedCountry = selectedCountries.includes(property.location.country);
              const markerColor = selectedCountries.length > 0 && isInSelectedCountry ? "#1A1A1A" : "#FF6B35";

              return (
                <Marker
                  key={property.id}
                  coordinates={[property.location.coordinates.lng, property.location.coordinates.lat]}
                  onMouseEnter={() => setHoveredProperty(property)}
                  onMouseLeave={() => setHoveredProperty(null)}
                  onClick={() => setSelectedProperty(property)}
                >
                  <circle
                    r={4}
                    fill={markerColor}
                    stroke="#fff"
                    strokeWidth={1.5}
                    style={{ cursor: "pointer" }}
                  />
                  {hoveredProperty && hoveredProperty.id === property.id && (
                     <text
                       textAnchor="middle"
                       y={-10}
                       style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: "10px", fontWeight: "bold", pointerEvents: "none" }}
                     >
                       {property.name}
                     </text>
                  )}
                </Marker>
              );
            })}
        </ZoomableGroup>
      </ComposableMap>

      {selectedProperty && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm z-10">
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
          <h3 className="font-semibold text-lg mb-1">{selectedProperty.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{selectedProperty.location.city}, {selectedProperty.location.country}</p>
          <p className="text-sm">
            <span className="text-yellow-500">⭐ {selectedProperty.rating}</span>
            <span className="text-gray-500 ml-1">({selectedProperty.reviewCount})</span>
          </p>
        </div>
      )}
    </div>
  );
}