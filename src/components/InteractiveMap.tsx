import { memo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

interface Property {
  id: string;
  name: string;
  location: string;
  country: string;
  latitude: number;
  longitude: number;
  image: string;
  price: number;
  rating: number;
}

interface InteractiveMapProps {
  properties: Property[];
  selectedCountries: string[];
  onCountryClick?: (country: string) => void;
}

export function InteractiveMap({
  properties,
  selectedCountries,
  onCountryClick,
}: InteractiveMapProps) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 20]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleZoomIn = () => {
    if (zoom < 4) {
      setZoom(zoom * 1.5);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 1) {
      setZoom(zoom / 1.5);
    }
  };

  const handleMoveEnd = (position: { coordinates: [number, number]; zoom: number }) => {
    setCenter(position.coordinates);
    setZoom(position.zoom);
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-50 rounded-lg overflow-hidden">
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          onClick={handleZoomIn}
          size="icon"
          variant="secondary"
          className="bg-white shadow-md hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleZoomOut}
          size="icon"
          variant="secondary"
          className="bg-white shadow-md hover:bg-gray-100"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 147,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={handleMoveEnd}
          filterZoomEvent={(evt: WheelEvent | TouchEvent | MouseEvent) => {
            if (zoom <= 1) {
              return false;
            }
            return true;
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const isSelected = selectedCountries.includes(countryName);
                const hasProperties = properties.some(
                  (p) => p.country === countryName
                );

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onCountryClick?.(countryName)}
                    style={{
                      default: {
                        fill: isSelected
                          ? "#FF6B35"
                          : hasProperties
                          ? "#FFE5DC"
                          : "#E5E7EB",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: isSelected ? "#FF6B35" : "#FFD4C4",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#FF6B35",
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

          {properties.map((property) => (
            <Marker
              key={property.id}
              coordinates={[property.longitude, property.latitude]}
              onClick={() => setSelectedProperty(property)}
            >
              <circle
                r={8}
                fill="#FF6B35"
                stroke="#FFFFFF"
                strokeWidth={2}
                className="cursor-pointer hover:r-10 transition-all"
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10 max-w-sm">
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
          <img
            src={selectedProperty.image}
            alt={selectedProperty.name}
            className="w-full h-32 object-cover rounded-lg mb-2"
          />
          <h3 className="font-semibold text-lg">{selectedProperty.name}</h3>
          <p className="text-sm text-gray-600">{selectedProperty.location}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-orange-600 font-bold">
              ${selectedProperty.price}/night
            </span>
            <span className="text-sm text-gray-600">
              ⭐ {selectedProperty.rating}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}