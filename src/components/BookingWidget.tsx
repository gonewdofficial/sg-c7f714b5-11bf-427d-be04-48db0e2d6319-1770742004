import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CalendarIcon, Users, ShieldCheck } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { Property } from "@/types";

interface BookingWidgetProps {
  property: Property;
}

export function BookingWidget({ property }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const subtotal = nights * property.price.perNight;
  const serviceFee = subtotal * 0.12;
  const total = subtotal + serviceFee;

  const handleReserve = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }
    
    // Store booking data in localStorage
    const booking = {
      id: `booking-${Date.now()}`,
      propertyId: property.id,
      propertyName: property.name,
      propertyImage: property.images[0],
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      guests,
      totalPrice: total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    localStorage.setItem("bookings", JSON.stringify([...existingBookings, booking]));

    window.location.href = `/booking/confirm?id=${booking.id}`;
  };

  return (
    <Card className="sticky top-32 shadow-2xl">
      <CardHeader className="border-b">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">€{property.price.perNight}</span>
          <span className="text-gray-600">per night</span>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-600 mb-1">CHECK-IN</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-14"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "MMM dd") : "Select"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={setCheckIn}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-xs text-gray-600 mb-1">CHECK-OUT</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-14"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, "MMM dd") : "Select"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => !checkIn || date <= checkIn}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-600 mb-1">GUESTS</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="number"
              min="1"
              max={property.capacity.guests}
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="pl-10 h-14"
            />
          </div>
        </div>

        {nights > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>€{property.price.perNight} × {nights} nights</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service fee</span>
              <span>€{serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          onClick={handleReserve}
          disabled={!checkIn || !checkOut || nights <= 0}
        >
          Reserve Now
        </Button>
        <div className="flex items-center gap-2 text-xs text-gray-600 mt-3 justify-center">
          <ShieldCheck className="h-4 w-4" />
          <span>You won't be charged yet</span>
        </div>
      </CardFooter>
    </Card>
  );
}