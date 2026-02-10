import { memo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Property } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Minus, RotateCcw } from "lucide-react";

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
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 20]);
  const [hasZoomedIn, setHasZoomedIn] = useState(false);

  const handleCountryClick = (geo: any) => {
    const countryName = geo.properties.name || geo.properties.NAME || geo.properties.ADMIN;
    if (countryName) {
      const normalizedCountryName = countryName.toLowerCase();
      onCountryClick(normalizedCountryName);
      setHoveredCountry(null);
    }
  };

  const handleZoomIn = () => {
    if (zoom < 8) {
      setZoom(zoom * 1.5);
      setHasZoomedIn(true);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 1) {
      setZoom(zoom / 1.5);
      if (zoom / 1.5 <= 1) {
        setHasZoomedIn(false);
      }
    }
  };

  const handleReset = () => {
    setZoom(1);
    setCenter([0, 20]);
    setHasZoomedIn(false);
  };

  const getCountryFill = (geo: any, isHovered: boolean) => {
    const countryName = geo.properties.name || geo.properties.NAME || geo.properties.ADMIN;
    const normalizedCountryName = countryName?.toLowerCase();
    const isSelected = selectedCountries.includes(normalizedCountryName);

    if (isSelected) {
      return "#FF6347";
    }
    return isHovered ? "#D1D5DB" : "#E5E7EB";
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-50 rounded-lg overflow-hidden">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          disabled={zoom >= 8}
          className="bg-white shadow-md hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          className="bg-white shadow-md hover:bg-gray-100"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleReset}
          className="bg-white shadow-md hover:bg-gray-100"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

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
          center={center}
          zoom={zoom}
          minZoom={1}
          maxZoom={8}
          onMoveEnd={(position) => {
            if (hasZoomedIn) {
              setCenter(position.coordinates);
              setZoom(position.zoom);
            }
          }}
          filterZoomEvent={(evt) => {
            return evt.type !== "wheel";
          }}
          translateExtent={hasZoomedIn ? undefined : [[0, 0], [0, 0]]}
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