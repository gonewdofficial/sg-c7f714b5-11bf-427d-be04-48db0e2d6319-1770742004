import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, Star, MapPin, LogOut, User as UserIcon } from "lucide-react";
import { Booking, Property } from "@/types";
import { properties } from "@/lib/mockData";
import { format } from "date-fns";
import { SEO } from "@/components/SEO";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  favorites: string[];
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<Property[]>([]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(currentUser);
    setUser(userData);

    // Load user bookings
    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const userBookings = allBookings.filter((b: Booking) => b.userId === userData.id);
    setBookings(userBookings);

    // Load favorites
    const favoriteProperties = properties.filter(p => userData.favorites.includes(p.id));
    setFavorites(favoriteProperties);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <>
      <SEO title="My Dashboard - NaturEscape" />
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white">
                      {user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                    <p className="text-gray-600">{user.email}</p>
                    <Badge variant="secondary" className="mt-2">
                      {user.role === "guest" ? "Guest Account" : "Property Owner"}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <Tabs defaultValue="bookings" className="space-y-6">
              <TabsList className="bg-white p-1 h-auto">
                <TabsTrigger value="bookings" className="gap-2 px-6 py-3">
                  <Calendar className="h-4 w-4" />
                  My Bookings
                </TabsTrigger>
                <TabsTrigger value="favorites" className="gap-2 px-6 py-3">
                  <Heart className="h-4 w-4" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="reviews" className="gap-2 px-6 py-3">
                  <Star className="h-4 w-4" />
                  My Reviews
                </TabsTrigger>
                <TabsTrigger value="profile" className="gap-2 px-6 py-3">
                  <UserIcon className="h-4 w-4" />
                  Profile Settings
                </TabsTrigger>
              </TabsList>

              {/* Bookings Tab */}
              <TabsContent value="bookings" className="space-y-4">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div 
                            className="w-48 h-32 rounded-xl bg-gray-200 bg-cover bg-center shrink-0"
                            style={{ backgroundImage: `url(${booking.propertyImage})` }}
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold mb-1">{booking.propertyName}</h3>
                                <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                                  {booking.status}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold">€{booking.totalPrice.toFixed(2)}</div>
                                <div className="text-sm text-gray-500">Total</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <div className="text-sm text-gray-500">Check-in</div>
                                <div className="font-medium">{format(new Date(booking.checkIn), "MMM dd, yyyy")}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Check-out</div>
                                <div className="font-medium">{format(new Date(booking.checkOut), "MMM dd, yyyy")}</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/property/${booking.propertyId}`}>
                                <Button variant="outline" size="sm">View Property</Button>
                              </Link>
                              <Button variant="ghost" size="sm">Cancel Booking</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="p-12 text-center">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Bookings Yet</h3>
                    <p className="text-gray-600 mb-4">Start planning your naturist getaway</p>
                    <Link href="/search">
                      <Button>Browse Properties</Button>
                    </Link>
                  </Card>
                )}
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="space-y-4">
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((property) => (
                      <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-48">
                          <Image
                            src={property.images[0]}
                            alt={property.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg mb-2">{property.name}</h3>
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            {property.location.city}, {property.location.country}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xl font-bold">€{property.price.perNight}</span>
                              <span className="text-sm text-gray-600"> / night</span>
                            </div>
                            <Link href={`/property/${property.id}`}>
                              <Button size="sm">View</Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Favorites Yet</h3>
                    <p className="text-gray-600 mb-4">Save properties you love for later</p>
                    <Link href="/search">
                      <Button>Browse Properties</Button>
                    </Link>
                  </Card>
                )}
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <Card className="p-12 text-center">
                  <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600">Share your experiences after your stay</p>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <input
                        type="text"
                        value={user.name}
                        className="w-full mt-1 px-4 py-2 border rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        className="w-full mt-1 px-4 py-2 border rounded-lg"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Member Since</label>
                      <input
                        type="text"
                        value={format(new Date(user.createdAt), "MMMM yyyy")}
                        className="w-full mt-1 px-4 py-2 border rounded-lg"
                        readOnly
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
}