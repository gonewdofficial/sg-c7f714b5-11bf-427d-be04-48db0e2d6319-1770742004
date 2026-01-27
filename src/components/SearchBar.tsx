import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, MapPin, CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";

export function SearchBar() {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Where to?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 h-14 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-14 justify-start text-left font-normal border-0 hover:bg-gray-50"
            >
              <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
              {checkIn ? format(checkIn, "MMM dd") : "Check-in"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-14 justify-start text-left font-normal border-0 hover:bg-gray-50"
            >
              <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
              {checkOut ? format(checkOut, "MMM dd") : "Check-out"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="pl-10 h-14 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}