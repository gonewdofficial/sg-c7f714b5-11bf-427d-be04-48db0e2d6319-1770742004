import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { getCurrentUser, signOut } from "@/services/authService";
import { getVenues, createVenue, updateVenue, deleteVenue } from "@/services/venueService";
import type { VenueWithStats } from "@/services/venueService";
import { Loader2, Plus, Edit, Trash2, LogOut, Star } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Venue = Database["public"]["Tables"]["venues"]["Row"];

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [venues, setVenues] = useState<VenueWithStats[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    country: "",
    accommodation_type: "",
    website_url: "",
    booking_link: "",
    lat: "",
    lng: "",
    description: "",
    amenities: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [togglingFeatured, setTogglingFeatured] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadVenues();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      router.push("/admin/login");
    }
    setLoading(false);
  };

  const loadVenues = async () => {
    const { venues: data, error } = await getVenues();
    if (!error && data) {
      setVenues(data);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  const openDialog = (venue?: Venue) => {
    if (venue) {
      setEditingVenue(venue);
      setFormData({
        name: venue.name,
        city: venue.city || "",
        country: venue.country,
        accommodation_type: venue.accommodation_type || "",
        website_url: venue.website_url || "",
        booking_link: venue.booking_link || "",
        lat: venue.lat?.toString() || "",
        lng: venue.lng?.toString() || "",
        description: venue.description || "",
        amenities: Array.isArray(venue.amenities) ? venue.amenities.join(", ") : "",
      });
    } else {
      setEditingVenue(null);
      setFormData({
        name: "",
        city: "",
        country: "",
        accommodation_type: "",
        website_url: "",
        booking_link: "",
        lat: "",
        lng: "",
        description: "",
        amenities: "",
      });
    }
    setIsDialogOpen(true);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const venueData = {
        ...formData,
        address: `${formData.city}, ${formData.country}`, // Construct address
        amenities: formData.amenities.split(",").map((f) => f.trim()).filter(Boolean),
        latitude: formData.lat ? parseFloat(formData.lat) : null,
        longitude: formData.lng ? parseFloat(formData.lng) : null,
        venue_type: "resort" as const, // Default to resort for admin creation
        bathrooms: 1,
        bedrooms: 1,
        max_guests: 4, // Default
        price_per_night: 100, // Default
      };

      if (editingVenue) {
        // Only include fields that exist in VenueUpdate
        const updates: any = { ...venueData };
        delete updates.city; // if not in update type
        delete updates.lat; // Remove local form field
        delete updates.lng; // Remove local form field
        
        const { error: updateError } = await updateVenue(editingVenue.id, venueData);
        if (updateError) {
          setError(updateError);
        } else {
          setSuccess("Venue updated successfully!");
          await loadVenues();
          setTimeout(() => setIsDialogOpen(false), 1500);
        }
      } else {
        const { error: createError } = await createVenue(venueData);
        if (createError) {
          setError(createError);
        } else {
          setSuccess("Venue created successfully!");
          await loadVenues();
          setTimeout(() => setIsDialogOpen(false), 1500);
        }
      }
    } catch (e: any) {
      setError(e.message || "An error occurred while submitting the form.");
    }

    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this venue?")) return;

    const { error } = await deleteVenue(id);
    if (!error) {
      await loadVenues();
    }
  };

  const handleToggleFeatured = async (venue: Venue) => {
    setTogglingFeatured(venue.id);
    
    const { error } = await updateVenue(venue.id, {
      featured: !venue.featured,
    });

    if (!error) {
      await loadVenues();
    }
    
    setTogglingFeatured(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <>
      <SEO title="Admin Dashboard - GO/NEWD" description="Manage venue listings" />
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-brand">GO/NEWD Admin</h1>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="venues" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="venues">Venues</TabsTrigger>
              <TabsTrigger value="featured">Featured Properties</TabsTrigger>
            </TabsList>

            <TabsContent value="venues" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Venue Management</h2>
                  <p className="text-gray-600 mt-1">{venues.length} venues listed</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openDialog()} className="bg-brand hover:bg-brand/90">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Venue
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingVenue ? "Edit Venue" : "Add New Venue"}</DialogTitle>
                      <DialogDescription>
                        {editingVenue ? "Update venue information" : "Add a new naturist venue to the marketplace"}
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4 py-4">
                        {error && (
                          <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}

                        {success && (
                          <Alert className="bg-green-50 text-green-900 border-green-200">
                            <AlertDescription>{success}</AlertDescription>
                          </Alert>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="name">Venue Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            disabled={submitting}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">City</Label>
                          <Input
                            id="location"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                            placeholder="e.g. Cala d'Or"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="lat">Latitude</Label>
                            <Input
                              id="lat"
                              type="number"
                              step="any"
                              value={formData.lat}
                              onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                              placeholder="e.g. 39.3758"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lng">Longitude</Label>
                            <Input
                              id="lng"
                              type="number"
                              step="any"
                              value={formData.lng}
                              onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                              placeholder="e.g. 3.2267"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">Country *</Label>
                          <Input
                            id="country"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            required
                            disabled={submitting}
                            placeholder="e.g., France, Spain, Croatia"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="accommodation_type">Accommodation Type *</Label>
                          <Input
                            id="accommodation_type"
                            value={formData.accommodation_type}
                            onChange={(e) => setFormData({ ...formData, accommodation_type: e.target.value })}
                            required
                            disabled={submitting}
                            placeholder="e.g., Resort, Hotel, Campsite, Villa"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website_url">Website URL</Label>
                          <Input
                            id="website_url"
                            type="url"
                            value={formData.website_url}
                            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                            disabled={submitting}
                            placeholder="https://example.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="booking_link">Booking Link</Label>
                          <Input
                            id="booking_link"
                            type="url"
                            value={formData.booking_link}
                            onChange={(e) => setFormData({ ...formData, booking_link: e.target.value })}
                            disabled={submitting}
                            placeholder="https://booking.example.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={submitting}
                            rows={4}
                            placeholder="Describe the venue, its atmosphere, and what makes it special..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                          <Textarea
                            id="amenities"
                            value={formData.amenities}
                            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                            disabled={submitting}
                            rows={3}
                            placeholder="Pool, Restaurant, Spa, Beach Access, WiFi"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-brand hover:bg-brand/90" disabled={submitting}>
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {editingVenue ? "Updating..." : "Creating..."}
                            </>
                          ) : editingVenue ? (
                            "Update Venue"
                          ) : (
                            "Create Venue"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {venues.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No venues yet. Click "Add Venue" to create your first listing.
                          </TableCell>
                        </TableRow>
                      ) : (
                        venues.map((venue) => (
                          <TableRow key={venue.id}>
                            <TableCell className="font-medium">{venue.name}</TableCell>
                            <TableCell>{venue.country}</TableCell>
                            <TableCell>{venue.accommodation_type}</TableCell>
                            <TableCell>
                              {venue.average_rating ? `⭐ ${venue.average_rating.toFixed(1)}` : "No reviews"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => openDialog(venue)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(venue.id)}>
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="featured" className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold">Featured Properties</h2>
                <p className="text-gray-600 mt-1">Manage which venues appear as featured in search results</p>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Venue Name</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-center">Featured Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {venues.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            No venues available. Add venues first to manage featured status.
                          </TableCell>
                        </TableRow>
                      ) : (
                        venues.map((venue) => (
                          <TableRow key={venue.id} className={venue.featured ? "bg-orange-50" : ""}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {venue.featured && <Star className="h-4 w-4 fill-orange-500 text-orange-500" />}
                                {venue.name}
                              </div>
                            </TableCell>
                            <TableCell>{venue.country}</TableCell>
                            <TableCell>{venue.accommodation_type}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-3">
                                <span className="text-sm text-gray-600">
                                  {venue.featured ? "Featured" : "Not Featured"}
                                </span>
                                <Switch
                                  checked={venue.featured || false}
                                  onCheckedChange={() => handleToggleFeatured(venue)}
                                  disabled={togglingFeatured === venue.id}
                                  className="data-[state=checked]:bg-orange-500"
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}