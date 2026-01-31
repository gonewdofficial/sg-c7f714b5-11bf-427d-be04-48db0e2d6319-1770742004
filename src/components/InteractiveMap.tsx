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

    const countries = svg.querySelectorAll("path[data-name]");
    countries.forEach(path => {
      const countryName = path.getAttribute("data-name") || "";
      
      if (countriesWithVenues.includes(countryName)) {
        path.setAttribute("fill", selectedCountries.includes(countryName) ? "#FF6B35" : "#93C5FD");
        path.setAttribute("style", "cursor: pointer; transition: fill 0.3s ease;");

        const handleMouseEnter = () => {
          if (!selectedCountries.includes(countryName)) {
            path.setAttribute("fill", "#FDBA74");
          }
        };

        const handleMouseLeave = () => {
          if (!selectedCountries.includes(countryName)) {
            path.setAttribute("fill", "#93C5FD");
          }
        };

        const handleClick = () => {
          if (onCountryClick) {
            onCountryClick(countryName);
          }
        };

        path.addEventListener("mouseenter", handleMouseEnter);
        path.addEventListener("mouseleave", handleMouseLeave);
        path.addEventListener("click", handleClick);

        return () => {
          path.removeEventListener("mouseenter", handleMouseEnter);
          path.removeEventListener("mouseleave", handleMouseLeave);
          path.removeEventListener("click", handleClick);
        };
      } else {
        path.setAttribute("fill", "#E5E7EB");
      }
    });
  }, [countriesWithVenues, onCountryClick, selectedCountries]);

  return (
    <div className="relative w-full h-full bg-blue-50 rounded-lg" ref={mapRef}>
      <svg
        viewBox="0 0 2000 1000"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <style>{`
            .country { stroke: #fff; stroke-width: 1; }
            .marker { animation: pulse 2s infinite; cursor: pointer; }
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.7; transform: scale(1.2); }
            }
          `}</style>
        </defs>

        {/* Ocean background */}
        <rect width="2000" height="1000" fill="#E0F2FE" />

        {/* Simple world map - Major countries */}
        <g id="countries">
          {/* Europe */}
          <path className="country" data-name="France" d="M1050,350 L1070,340 L1090,345 L1100,360 L1095,380 L1075,390 L1055,385 L1045,370 Z" fill="#E5E7EB" />
          <path className="country" data-name="Spain" d="M1020,390 L1050,385 L1070,395 L1075,410 L1060,425 L1035,420 L1015,410 Z" fill="#E5E7EB" />
          <path className="country" data-name="Italy" d="M1110,370 L1130,365 L1140,380 L1145,400 L1135,430 L1125,445 L1115,440 L1110,420 L1105,400 Z" fill="#E5E7EB" />
          <path className="country" data-name="Greece" d="M1160,400 L1180,395 L1190,410 L1185,425 L1170,430 L1155,420 Z" fill="#E5E7EB" />
          <path className="country" data-name="Croatia" d="M1115,360 L1135,355 L1145,365 L1140,380 L1125,385 L1110,375 Z" fill="#E5E7EB" />
          <path className="country" data-name="Germany" d="M1080,310 L1110,305 L1130,315 L1135,335 L1120,350 L1095,345 L1075,335 Z" fill="#E5E7EB" />
          <path className="country" data-name="Portugal" d="M990,390 L1015,385 L1025,400 L1020,420 L1000,425 L985,410 Z" fill="#E5E7EB" />
          <path className="country" data-name="Netherlands" d="M1065,285 L1085,280 L1095,290 L1090,305 L1075,310 L1060,300 Z" fill="#E5E7EB" />
          <path className="country" data-name="United Kingdom" d="M1010,280 L1035,275 L1050,285 L1055,305 L1045,320 L1025,315 L1005,300 Z" fill="#E5E7EB" />
          <path className="country" data-name="Turkey" d="M1200,390 L1250,385 L1280,395 L1285,410 L1270,425 L1240,430 L1210,420 Z" fill="#E5E7EB" />
          
          {/* Americas */}
          <path className="country" data-name="United States" d="M200,300 L400,290 L450,310 L480,350 L470,400 L440,430 L380,440 L320,430 L250,410 L190,380 Z" fill="#E5E7EB" />
          <path className="country" data-name="Mexico" d="M250,440 L350,435 L380,450 L390,480 L370,510 L330,520 L280,505 L240,480 Z" fill="#E5E7EB" />
          <path className="country" data-name="Brazil" d="M600,600 L700,590 L750,620 L770,680 L750,740 L700,760 L640,750 L590,710 L580,650 Z" fill="#E5E7EB" />
          
          {/* Asia */}
          <path className="country" data-name="China" d="M1500,350 L1600,340 L1650,360 L1670,400 L1660,450 L1620,470 L1560,465 L1510,440 L1490,400 Z" fill="#E5E7EB" />
          <path className="country" data-name="Japan" d="M1720,350 L1750,345 L1770,360 L1775,390 L1765,420 L1745,430 L1720,420 L1710,390 Z" fill="#E5E7EB" />
          <path className="country" data-name="Thailand" d="M1550,500 L1580,495 L1600,510 L1605,540 L1590,560 L1565,555 L1545,535 Z" fill="#E5E7EB" />
          
          {/* Oceania */}
          <path className="country" data-name="Australia" d="M1550,700 L1700,690 L1760,710 L1780,750 L1770,800 L1720,830 L1640,835 L1570,820 L1530,780 L1525,730 Z" fill="#E5E7EB" />
          
          {/* Africa */}
          <path className="country" data-name="South Africa" d="M1150,750 L1220,745 L1260,760 L1270,790 L1250,820 L1210,825 L1170,810 L1145,780 Z" fill="#E5E7EB" />
        </g>

        {/* Markers for properties with coordinates */}
        {markers.map((marker, index) => {
          const x = ((marker.lng + 180) / 360) * 2000;
          const y = ((90 - marker.lat) / 180) * 1000;
          
          return (
            <g
              key={`${marker.id}-${index}`}
              className="marker"
              onClick={() => {
                const property = properties.find(p => p.id === marker.id);
                if (property) setSelectedProperty(property);
              }}
            >
              <circle
                cx={x}
                cy={y}
                r="8"
                fill="#FF6B35"
                stroke="white"
                strokeWidth="3"
              />
            </g>
          );
        })}
      </svg>

      {/* Property detail popup */}
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