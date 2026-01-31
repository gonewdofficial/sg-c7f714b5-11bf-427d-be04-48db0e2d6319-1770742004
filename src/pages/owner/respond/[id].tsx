import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { Loader2, Star, ArrowLeft } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Review = Tables<"reviews"> & {
  profiles: { full_name: string } | null;
  venues: { name: string } | null;
};

export default function RespondToReview() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [review, setReview] = useState<Review | null>(null);
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (id) {
      loadReview();
    }
  }, [id]);

  const loadReview = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/owner/login");
        return;
      }

      const reviewId = typeof id === "string" ? id : id?.[0];
      if (!reviewId) return;

      // Check ownership via the venue linked to the review
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles:user_id (full_name),
          venues:venue_id (name, owner_id)
        `)
        .eq("id", reviewId)
        .single();

      if (error) throw error;
      
      // Verify the current user owns the venue
      // @ts-ignore - Supabase types join workaround
      if (data.venues?.owner_id !== user.id) {
        throw new Error("You don't have permission to respond to this review");
      }

      setReview(data as unknown as Review);
    } catch (err: any) {
      setError(err.message || "Failed to load review");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in");

      const { error: submitError } = await supabase
        .from("review_responses")
        .insert({
          review_id: id as string,
          owner_id: user.id,
          response: response
        });

      if (submitError) throw submitError;

      router.push("/owner/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to submit response");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!review) return null;

  return (
    <>
      <SEO title="Respond to Review - Owner Dashboard" />
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => router.back()} 
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Respond to Review</CardTitle>
                <CardDescription>
                  Your response will be public and visible on the listing page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="bg-white p-4 rounded-lg border space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {review.venues?.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < (review.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          by {review.profiles?.full_name || "Guest"}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="response">Your Response</Label>
                    <Textarea
                      id="response"
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Thank the guest for their review and address any concerns..."
                      className="min-h-[150px]"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-orange-500 hover:bg-orange-600"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        "Publish Response"
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