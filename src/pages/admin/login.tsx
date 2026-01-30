import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn, getCurrentUser } from "@/services/authService";
import { Loader2, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if already logged in as admin
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user?.role === "admin") {
        router.push("/admin/dashboard");
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user, error: authError } = await signIn(email, password);

      if (authError) {
        setError(authError);
        setLoading(false);
        return;
      }

      if (user) {
        // Check if user is admin
        if (user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          setError("Access denied. Admin credentials required.");
          setLoading(false);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Admin Login - GO/NEWD"
        description="Admin access for GO/NEWD venue management"
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-600 mt-2">Venue Management Portal</p>
          </div>

          <Card className="border-2">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription>
                Enter your admin credentials to continue
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@gonewd.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-11"
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full h-11 bg-brand hover:bg-brand/90 text-white font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Link href="/" className="text-sm text-center text-gray-600 hover:text-brand">
                  ← Back to main site
                </Link>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}