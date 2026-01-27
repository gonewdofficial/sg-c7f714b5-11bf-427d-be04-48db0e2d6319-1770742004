import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Calendar, Users, MapPin, ChevronRight } from "lucide-react";
import { Booking } from "@/types";
import { format } from "date-fns";
import { SEO } from "@/components/SEO";

export default function BookingConfirmation() {
  const router = useRouter();
  const { id } = router.query;
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (id) {
      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      const foundBooking = bookings.find((b: Booking) => b.id === id);
      setBooking(foundBooking);
    }
  }, [id]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Booking Confirmed - NaturEscape" />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-emerald-600 p-8 text-center text-white">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Booking Requested!</h1>
              <p className="text-emerald-100">
                Your reservation request has been sent to the host.
              </p>
            </div>

            <div className="p-8">
              <div className="flex gap-6 mb-8 border-b pb-8">
                <div 
                  className="w-32 h-24 rounded-xl bg-gray-200 bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url(${booking.propertyImage})` }}
                />
                <div>
                  <h2 className="text-xl font-bold mb-2">{booking.propertyName}</h2>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Location details will be sent via email</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Check-in</label>
                  <div className="flex items-center gap-2 mt-2 text-lg font-medium">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    {format(new Date(booking.checkIn), "EEE, MMM d, yyyy")}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Check-out</label>
                  <div className="flex items-center gap-2 mt-2 text-lg font-medium">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    {format(new Date(booking.checkOut), "EEE, MMM d, yyyy")}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-bold mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-bold text-lg">€{booking.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Payment Status</span>
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium uppercase">
                      Pending
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/dashboard">
                  <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-lg">
                    Manage My Booking
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost" className="w-full">
                    Return Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}