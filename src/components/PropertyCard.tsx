import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, MapPin } from "lucide-react";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 w-full">
      <Link href={`/property/${property.id}`}>
        <div className="relative h-48 md:h-64 overflow-hidden w-full">
          <Image
            src={property.images[0]}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white z-10"
            onClick={(e) => {
              e.preventDefault();
              // Handle favorite toggle
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
          {property.featured && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 border-0">
              Featured
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4 md:p-5">
        <div className="flex items-start justify-between mb-2 gap-2">
          <Link href={`/property/${property.id}`} className="flex-1 min-w-0">
            <h3 className="font-bold text-base md:text-lg line-clamp-1 hover:text-blue-600 transition-colors">
              {property.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg shrink-0">
            <Star className="h-3 w-3 md:h-4 md:w-4 fill-blue-600 text-blue-600" />
            <span className="text-xs md:text-sm font-semibold">{property.rating}</span>
          </div>
        </div>

        <div className="flex items-center text-xs md:text-sm text-gray-600 mb-3">
          <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 shrink-0" />
          <span className="truncate">{property.location.city}, {property.location.country}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="text-xs">
            {property.propertyType}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {property.naturistType}
          </Badge>
        </div>

        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-4">
          {property.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t gap-4">
          <div className="min-w-0">
            <span className="text-xl md:text-2xl font-bold">€{property.price.perNight}</span>
            <span className="text-xs md:text-sm text-gray-600"> / night</span>
          </div>
          <Link href={`/property/${property.id}`}>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs md:text-sm px-3 md:px-4 h-9 md:h-10">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}