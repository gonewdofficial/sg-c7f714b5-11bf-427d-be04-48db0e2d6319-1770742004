import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { Loader2, Upload, X } from "lucide-react";

const AMENITIES_LIST = [
  "Wifi",
  "Pool",
  "Spa",
  "Restaurant",
  "Bar",
  "Parking",
  "Air conditioning",
  "Beach access",
  "Gym",
  "Room service"
];

const CLOTHING_POLICIES = [
  "Fully naturist",
  "Clothing optional",
  "Textile friendly"
];

export default function AddListing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [hasPermission, setHasPermission] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
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
    
    if (!hasPermission) {
      setError("Please confirm you have permission to use these photos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const user = (await supabase.auth.getUser()).data.user;

      if (!user) throw new Error("You must be logged in");

      const venueName = formData.get("name") as string;
      const venueSlug = venueName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      const { data: venue, error: venueError } = await supabase
        .from("venues")
        .insert({
          name: venueName,
          slug: venueSlug,
          description: formData.get("description") as string,
          location: formData.get("location") as string,
          country: formData.get("country") as string,
          accommodation_type: formData.get("type") as string,
          clothing_policy: formData.get("clothing_policy") as string,
          website: formData.get("website") as string,
          contact_email: formData.get("contact_email") as string || null,
          contact_phone: formData.get("contact_phone") as string || null,
          owner_id: user.id,
          facilities: selectedAmenities,
          status: "draft"
        })
        .select()
        .single();

      if (venueError) throw venueError;

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
        <main className="container mx-auto px-4 py-6 md:py-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Add New Listing</CardTitle>
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
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                      placeholder="What makes your venue special?" 
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
                    <Label htmlFor="website">Website *</Label>
                    <Input 
                      id="website" 
                      name="website" 
                      type="url" 
                      required 
                      placeholder="https://yourwebsite.com" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Contact Email (optional)</Label>
                      <Input 
                        id="contact_email" 
                        name="contact_email" 
                        type="email" 
                        placeholder="contact@venue.com" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">Contact Phone (optional)</Label>
                      <Input 
                        id="contact_phone" 
                        name="contact_phone" 
                        type="tel" 
                        placeholder="+1 234 567 8900" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clothing_policy">Clothing Policy *</Label>
                    <select 
                      id="clothing_policy" 
                      name="clothing_policy" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    >
                      {CLOTHING_POLICIES.map((policy) => (
                        <option key={policy} value={policy.toLowerCase()}>
                          {policy}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <Label>Amenities</Label>
                    <div className="border rounded-lg p-4 bg-white space-y-3">
                      {AMENITIES_LIST.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-3">
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
                    <Label>Upload photos</Label>
                    
                    {imageUrls.length === 0 ? (
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-orange-500 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-12 h-12 text-gray-400 mb-4" />
                          <p className="mb-2 text-sm text-gray-700 font-medium">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, WEBP (max 5MB)</p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          className="hidden" 
                          onChange={handleImageChange}
                        />
                      </label>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {imageUrls.map((url, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border bg-gray-100">
                              <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                              {index === 0 && (
                                <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                                  Primary
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-black/70 rounded-full text-white hover:bg-black transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 cursor-pointer transition-colors bg-gray-50 hover:bg-orange-50">
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500 font-medium">Add More</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              multiple 
                              className="hidden" 
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">First photo will be used as the primary image</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <Checkbox 
                      id="permission" 
                      checked={hasPermission}
                      onCheckedChange={(checked) => setHasPermission(checked as boolean)}
                      className="mt-1"
                    />
                    <label 
                      htmlFor="permission"
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      I own or manage this venue and have permission to use these photos
                    </label>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => router.back()}
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
                      disabled={loading || !hasPermission}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        "Publish Listing"
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