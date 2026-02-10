import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, MapPin } from "lucide-react";

interface PropertyCardProps {
  id: string;
  name: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  featured?: boolean;
  onClick?: () => void;
}

export function PropertyCard({ 
  id,
  name, 
  location, 
  image, 
  price, 
  rating, 
  reviews,
  featured = false,
  onClick 
}: PropertyCardProps) {
  return (
    <Card 
      className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 w-full"
      onClick={onClick}
    >
      <Link href={`/property/${id}`}>
        <div className="relative h-48 md:h-64 overflow-hidden w-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {featured && (
            <Badge className="absolute top-3 left-3 bg-orange-500 text-white border-0 z-10">
              Featured
            </Badge>
          )}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white z-10"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Heart className="h-4 w-4" style={{ color: '#FF6347' }} />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4 md:p-5">
        <div className="flex items-start justify-between mb-2 gap-2">
          <Link href={`/property/${id}`} className="flex-1 min-w-0">
            <h3 className="font-bold text-base md:text-lg line-clamp-1 hover:text-[#FF6347] transition-colors" style={{ color: '#1A1A1A' }}>
              {name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg shrink-0" style={{ backgroundColor: '#FFF5F3' }}>
            <Star className="h-3 w-3 md:h-4 md:w-4 fill-current" style={{ color: '#FF6347' }} />
            <span className="text-xs md:text-sm font-semibold" style={{ color: '#FF6347' }}>{rating}</span>
          </div>
        </div>

        <div className="flex items-center text-xs md:text-sm text-gray-600 mb-3">
          <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 shrink-0" style={{ color: '#FF6347' }} />
          <span className="truncate">{location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="text-xs text-white" style={{ backgroundColor: '#FF6347' }}>
            Resort
          </Badge>
          <Badge variant="outline" className="text-xs" style={{ borderColor: '#FF6347', color: '#FF6347' }}>
            Naturist
          </Badge>
        </div>

        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-4">
          Experience the freedom of nature...
        </p>

        <div className="flex items-center justify-end pt-4 border-t">
          <Link href={`/property/${id}`}>
            <Button className="text-xs md:text-sm px-3 md:px-4 h-9 md:h-10 text-white hover:opacity-90" style={{ backgroundColor: '#FF6347' }}>
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}