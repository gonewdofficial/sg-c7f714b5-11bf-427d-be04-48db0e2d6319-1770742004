import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { Loader2, Upload, X } from "lucide-react";

const AMENITIES_LIST = [
  "Wifi", "Pool", "Spa", "Restaurant", "Bar", "Parking", 
  "Air conditioning", "Beach access", "Gym", "Room service"
];

export default function AddListing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      // Create preview URLs
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const user = (await supabase.auth.getUser()).data.user;

      if (!user) throw new Error("You must be logged in");

      // 1. Create Venue
      const venueName = formData.get("name") as string;
      const venueSlug = venueName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      const { data: venue, error: venueError } = await supabase
        .from("venues")
        .insert({
          name: venueName,
          slug: venueSlug,
          description: formData.get("description"),
          location: formData.get("location"),
          country: formData.get("country"),
          accommodation_type: formData.get("type"),
          owner_id: user.id,
          facilities: selectedAmenities,
          status: "draft"
        })
        .select()
        .single();

      if (venueError) throw venueError;

      // 2. Upload Images
      if (images.length > 0 && venue) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${venue.id}/${crypto.randomUUID()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("venue-images")
            .upload(fileName, file);

          if (uploadError) {
            console.error("Error uploading image:", uploadError);
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from("venue-images")
            .getPublicUrl(fileName);

          await supabase
            .from("venue_images")
            .insert({
              venue_id: venue.id,
              url: publicUrl,
              display_order: i
            });
        }
      }

      router.push("/owner/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Add New Listing - Owner Dashboard" />
      <div className="min-h-screen bg-gray-50 pb-12">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Add New Listing</CardTitle>
                <CardDescription>Create a new property listing for the marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Property Name</Label>
                      <Input id="name" name="name" required placeholder="e.g. Sunny Beach Resort" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Property Type</Label>
                      <select 
                        id="type" 
                        name="type" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="resort">Resort</option>
                        <option value="hotel">Hotel</option>
                        <option value="camping">Camping</option>
                        <option value="guesthouse">Guesthouse</option>
                        <option value="villa">Villa</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      required 
                      placeholder="Describe your property..." 
                      className="min-h-[150px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Address / Location</Label>
                      <Input id="location" name="location" required placeholder="123 Beach Road, City" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" name="country" required placeholder="Spain" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border rounded-lg p-4 bg-white">
                      {AMENITIES_LIST.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`amenity-${amenity}`} 
                            checked={selectedAmenities.includes(amenity)}
                            onCheckedChange={() => toggleAmenity(amenity)}
                          />
                          <label 
                            htmlFor={`amenity-${amenity}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Photos</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-gray-100">
                          <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 cursor-pointer transition-colors bg-gray-50 hover:bg-orange-50">
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500 font-medium">Add Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          className="hidden" 
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => router.back()}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-orange-500 hover:bg-orange-600"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Listing"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}