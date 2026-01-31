import { useEffect, useRef, useState } from "react";
import type { Property } from "@/types";

interface InteractiveMapProps {
  properties: Property[];
  onCountryClick?: (country: string) => void;
  selectedCountries?: string[];
}

export function InteractiveMap({ properties, onCountryClick, selectedCountries = [] }: InteractiveMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    // Cast to SVGPathElement to properly access style properties
    const countries = svg.querySelectorAll<SVGPathElement>("path[data-country]");

    // Get unique countries from properties
    const propertiesCountries = new Set(properties.map(p => p.location.country));

    countries.forEach(path => {
      const countryName = path.getAttribute("data-country");
      if (!countryName) return;

      const hasProperties = propertiesCountries.has(countryName);
      const isSelected = selectedCountries.includes(countryName);

      // Set base styles
      if (isSelected) {
        path.setAttribute("fill", "#ff6b35");
        path.setAttribute("stroke", "#ff6b35");
      } else if (hasProperties) {
        path.setAttribute("fill", "#3b82f6");
        path.setAttribute("stroke", "#2563eb");
      } else {
        path.setAttribute("fill", "#e5e7eb");
        path.setAttribute("stroke", "#d1d5db");
      }

      path.setAttribute("stroke-width", "0.5");
      path.style.cursor = hasProperties ? "pointer" : "default";

      // Reset event handlers to avoid duplicates
      path.onmouseenter = null;
      path.onmouseleave = null;
      path.onclick = null;

      // Hover and Click effects
      if (hasProperties) {
        path.onmouseenter = () => {
          if (!selectedCountries.includes(countryName)) {
            path.setAttribute("fill", "#ffa726");
          }
        };

        path.onmouseleave = () => {
          if (selectedCountries.includes(countryName)) {
            path.setAttribute("fill", "#ff6b35");
          } else {
            path.setAttribute("fill", "#3b82f6");
          }
        };

        path.onclick = () => {
          if (onCountryClick) {
            onCountryClick(countryName);
          }
        };
      }
    });
  }, [properties, onCountryClick, selectedCountries]);

  return (
    <div className="relative w-full h-[300px] md:h-[500px] bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
      <svg
        ref={svgRef}
        viewBox="0 0 2000 1000"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified world map with major countries */}
        <g id="countries">
          {/* North America */}
          <path data-country="United States" d="M 150 200 L 400 180 L 420 250 L 380 320 L 320 340 L 250 330 L 180 280 Z" />
          <path data-country="Canada" d="M 150 80 L 450 60 L 480 120 L 420 180 L 150 200 Z" />
          <path data-country="Mexico" d="M 200 350 L 350 340 L 380 380 L 340 420 L 280 410 Z" />
          
          {/* South America */}
          <path data-country="Brazil" d="M 450 550 L 550 520 L 600 580 L 580 700 L 500 720 L 440 680 Z" />
          <path data-country="Argentina" d="M 420 700 L 500 720 L 480 850 L 440 880 L 400 820 Z" />
          <path data-country="Colombia" d="M 380 480 L 450 470 L 470 520 L 440 550 L 400 530 Z" />
          
          {/* Europe */}
          <path data-country="Spain" d="M 850 280 L 920 270 L 940 310 L 900 330 L 850 320 Z" />
          <path data-country="France" d="M 920 250 L 980 240 L 1000 280 L 970 300 L 920 290 Z" />
          <path data-country="Germany" d="M 1000 220 L 1060 210 L 1080 250 L 1050 270 L 1000 260 Z" />
          <path data-country="Italy" d="M 1040 290 L 1080 280 L 1100 340 L 1070 360 L 1040 330 Z" />
          <path data-country="United Kingdom" d="M 900 200 L 950 190 L 960 230 L 930 240 L 900 230 Z" />
          <path data-country="Greece" d="M 1120 320 L 1160 310 L 1180 350 L 1150 370 L 1120 350 Z" />
          <path data-country="Croatia" d="M 1060 280 L 1100 270 L 1110 300 L 1080 310 L 1060 300 Z" />
          <path data-country="Portugal" d="M 820 290 L 860 280 L 870 320 L 840 330 L 820 310 Z" />
          
          {/* Africa */}
          <path data-country="Egypt" d="M 1140 380 L 1200 370 L 1220 420 L 1190 440 L 1140 420 Z" />
          <path data-country="South Africa" d="M 1100 700 L 1180 690 L 1200 750 L 1170 780 L 1100 760 Z" />
          <path data-country="Kenya" d="M 1180 520 L 1230 510 L 1250 550 L 1220 570 L 1180 550 Z" />
          <path data-country="Morocco" d="M 880 350 L 940 340 L 960 380 L 920 400 L 880 380 Z" />
          
          {/* Asia */}
          <path data-country="Thailand" d="M 1520 450 L 1570 440 L 1590 490 L 1560 510 L 1520 490 Z" />
          <path data-country="Indonesia" d="M 1600 580 L 1750 570 L 1770 630 L 1720 650 L 1600 620 Z" />
          <path data-country="India" d="M 1350 400 L 1450 390 L 1480 480 L 1430 510 L 1350 490 Z" />
          <path data-country="China" d="M 1500 200 L 1650 180 L 1680 280 L 1620 320 L 1500 300 Z" />
          <path data-country="Japan" d="M 1750 240 L 1820 230 L 1840 290 L 1810 310 L 1750 280 Z" />
          <path data-country="Turkey" d="M 1140 270 L 1220 260 L 1240 300 L 1200 320 L 1140 300 Z" />
          
          {/* Oceania */}
          <path data-country="Australia" d="M 1650 700 L 1850 680 L 1880 780 L 1820 820 L 1650 800 Z" />
          <path data-country="New Zealand" d="M 1880 840 L 1920 830 L 1940 880 L 1910 900 L 1880 870 Z" />
        </g>

        {/* Property markers */}
        {properties.map((property) => {
          // Properly access nested coordinates
          const lat = property.location.coordinates?.lat;
          const lng = property.location.coordinates?.lng;
          
          if (lat === undefined || lng === undefined) return null;
          
          // Convert lat/lng to SVG coordinates (simplified projection)
          const x = ((lng + 180) / 360) * 2000;
          const y = ((90 - lat) / 180) * 1000;

          return (
            <g key={property.id} transform={`translate(${x}, ${y})`}>
              <circle
                r="8"
                fill="#ff6b35"
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer hover:r-10 transition-all"
                onClick={() => setSelectedProperty(property)}
              />
            </g>
          );
        })}
      </svg>

      {/* Property popup */}
      {selectedProperty && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs z-10 border border-gray-100">
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg mb-1">{selectedProperty.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{selectedProperty.location.country}</p>
          <p className="text-sm">⭐ {selectedProperty.rating.toFixed(1)} ({selectedProperty.reviewCount} reviews)</p>
        </div>
      )}
    </div>
  );
}