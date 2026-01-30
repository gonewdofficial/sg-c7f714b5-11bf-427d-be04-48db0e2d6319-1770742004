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
import { getCurrentUser, signOut } from "@/services/authService";
import { getVenues, createVenue, updateVenue, deleteVenue } from "@/services/venueService";
import { Loader2, Plus, Edit, Trash2, LogOut } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Venue = Database["public"]["Tables"]["venues"]["Row"];

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    country: "",
    accommodation_type: "",
    website_url: "",
    booking_link: "",
    lat: "",
    lng: "",
    description: "",
    facilities: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
        location: venue.location,
        country: venue.country,
        accommodation_type: venue.accommodation_type,
        website_url: venue.website_url || "",
        booking_link: venue.booking_link || "",
        description: venue.description || "",
        facilities: Array.isArray(venue.facilities) ? venue.facilities.join(", ") : "",
      });
    } else {
      setEditingVenue(null);
      setFormData({
        name: "",
        location: "",
        country: "",
        accommodation_type: "",
        website_url: "",
        booking_link: "",
        description: "",
        facilities: "",
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
        facilities: formData.facilities.split(",").map((f) => f.trim()).filter(Boolean),
        lat: formData.lat ? parseFloat(formData.lat) : null,
        lng: formData.lng ? parseFloat(formData.lng) : null,
      };

      if (editingVenue) {
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
    } catch (e) {
      setError("An error occurred while submitting the form.");
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
          <div className="flex justify-between items-center mb-6">
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
                      <Label htmlFor="location">Full Location Address</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                        placeholder="e.g. Carrer de la Platja, 07660 Cala d'Or, Spain"
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
                      <Label htmlFor="facilities">Facilities (comma-separated)</Label>
                      <Textarea
                        id="facilities"
                        value={formData.facilities}
                        onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
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
        </main>
      </div>
    </>
  );
}