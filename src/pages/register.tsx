import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signUp, getCurrentUser } from "@/services/authService";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        router.push("/dashboard");
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const { user, error: authError } = await signUp(email, password, fullName);

      if (authError) {
        setError(authError);
        setLoading(false);
        return;
      }

      if (user) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Sign Up - GO/NEWD"
        description="Create your GO/NEWD account to book naturist resorts and manage your stays"
      />
      <div className="min-h-screen bg-white">
        <Header />
        
        <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="max-w-md mx-auto">
            <Card className="border-2">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-brand">
                  Create Account
                </CardTitle>
                <CardDescription className="text-base">
                  Join GO/NEWD to explore naturist destinations
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-50 text-green-900 border-green-200">
                      <AlertDescription>
                        Account created successfully! Redirecting...
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={loading}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
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
                      minLength={8}
                    />
                    <p className="text-xs text-gray-600">
                      Must be at least 8 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                    disabled={loading || success}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  <div className="text-center text-sm">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link href="/login" className="text-brand hover:underline font-semibold">
                      Sign In
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>By creating an account, you agree to our</p>
              <div className="space-x-2 mt-1">
                <Link href="/terms" className="text-brand hover:underline">
                  Terms of Service
                </Link>
                <span>and</span>
                <Link href="/privacy" className="text-brand hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}