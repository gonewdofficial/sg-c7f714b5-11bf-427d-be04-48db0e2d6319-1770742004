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
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
      <Link href={`/property/${property.id}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={property.images[0]}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.preventDefault();
              // Handle favorite toggle
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
          {property.featured && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-600 border-0">
              Featured
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-2">
          <Link href={`/property/${property.id}`}>
            <h3 className="font-bold text-lg line-clamp-1 hover:text-emerald-600 transition-colors">
              {property.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
            <Star className="h-4 w-4 fill-emerald-600 text-emerald-600" />
            <span className="text-sm font-semibold">{property.rating}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location.city}, {property.location.country}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="text-xs">
            {property.propertyType}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {property.naturistType}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {property.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <span className="text-2xl font-bold">€{property.price.perNight}</span>
            <span className="text-sm text-gray-600"> / night</span>
          </div>
          <Link href={`/property/${property.id}`}>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}