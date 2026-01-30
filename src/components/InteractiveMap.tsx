import { useEffect, useRef, useState } from "react";
import type { Property } from "@/types";

interface InteractiveMapProps {
  properties: Property[];
  onCountryClick?: (country: string) => void;
  selectedCountries?: string[];
}

export function InteractiveMap({ properties, onCountryClick, selectedCountries = [] }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const markers = properties
    .filter(p => p.location.coordinates.lat !== 0 && p.location.coordinates.lng !== 0)
    .map(property => ({
      lat: property.location.coordinates.lat,
      lng: property.location.coordinates.lng,
      name: property.name,
      country: property.location.country,
      id: property.id,
    }));

  const countriesWithVenues = Array.from(new Set(properties.map(p => p.location.country)));

  useEffect(() => {
    if (!mapRef.current) return;

    const svg = mapRef.current.querySelector("svg");
    if (!svg) return;

    const countries = svg.querySelectorAll("path");
    countries.forEach(path => {
      const countryName = path.getAttribute("data-name") || "";
      
      if (countriesWithVenues.includes(countryName)) {
        path.style.fill = selectedCountries.includes(countryName) ? "#FF6B35" : "#93C5FD";
        path.style.cursor = "pointer";
        path.style.transition = "fill 0.3s ease";

        path.addEventListener("mouseenter", () => {
          if (!selectedCountries.includes(countryName)) {
            path.style.fill = "#FDBA74";
          }
        });

        path.addEventListener("mouseleave", () => {
          if (!selectedCountries.includes(countryName)) {
            path.style.fill = "#93C5FD";
          }
        });

        path.addEventListener("click", () => {
          if (onCountryClick) {
            onCountryClick(countryName);
          }
        });
      } else {
        path.style.fill = "#E5E7EB";
      }
    });
  }, [countriesWithVenues, onCountryClick, selectedCountries]);

  return (
    <div className="relative w-full h-full" ref={mapRef}>
      <svg
        viewBox="0 0 1000 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <style>{`
            .country { stroke: #fff; stroke-width: 0.5; }
            .marker { animation: pulse 2s infinite; }
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.7; transform: scale(1.1); }
            }
          `}</style>
        </defs>

        <rect width="1000" height="500" fill="#E0F2FE" />

        <g id="countries">
          <path className="country" data-name="France" d="M 480 180 L 490 175 L 495 180 L 490 190 L 485 195 L 475 190 Z" />
          <path className="country" data-name="Spain" d="M 460 210 L 475 205 L 485 210 L 480 225 L 465 230 L 455 220 Z" />
          <path className="country" data-name="Italy" d="M 510 200 L 520 195 L 525 210 L 520 230 L 510 235 L 505 220 Z" />
          <path className="country" data-name="Greece" d="M 540 220 L 550 215 L 555 225 L 550 235 L 540 230 Z" />
          <path className="country" data-name="Croatia" d="M 520 185 L 530 180 L 535 190 L 530 200 L 520 195 Z" />
          <path className="country" data-name="Germany" d="M 500 160 L 515 155 L 520 165 L 515 175 L 500 170 Z" />
          <path className="country" data-name="Portugal" d="M 440 215 L 455 210 L 460 220 L 455 230 L 440 225 Z" />
          <path className="country" data-name="Netherlands" d="M 490 150 L 500 145 L 505 155 L 500 160 L 490 155 Z" />
          <path className="country" data-name="United Kingdom" d="M 470 140 L 480 135 L 485 145 L 480 155 L 470 150 Z" />
          <path className="country" data-name="Turkey" d="M 560 210 L 580 205 L 590 215 L 585 225 L 565 220 Z" />
        </g>

        {markers.map((marker, index) => (
          <g
            key={`${marker.id}-${index}`}
            className="marker cursor-pointer"
            onClick={() => {
              const property = properties.find(p => p.id === marker.id);
              if (property) setSelectedProperty(property);
            }}
          >
            <circle
              cx={marker.lng * 5 + 200}
              cy={marker.lat * 3.5 + 100}
              r="6"
              fill="#FF6B35"
              stroke="white"
              strokeWidth="2"
            />
          </g>
        ))}
      </svg>

      {selectedProperty && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-xl max-w-xs z-10">
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg mb-2">{selectedProperty.name}</h3>
          <p className="text-sm text-gray-600 mb-1">📍 {selectedProperty.location.country}</p>
          <p className="text-sm text-gray-600">⭐ {selectedProperty.rating.toFixed(1)} ({selectedProperty.reviewCount} reviews)</p>
        </div>
      )}
    </div>
  );
}