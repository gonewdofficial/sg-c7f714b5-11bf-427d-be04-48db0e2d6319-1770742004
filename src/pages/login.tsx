import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function LoginPage() {
  const router = useRouter();
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [error, setError] = useState("");

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!guestEmail || !guestPassword) {
      setError("Please fill in all fields");
      return;
    }

    const user = {
      id: `user-${Date.now()}`,
      email: guestEmail,
      name: guestEmail.split("@")[0],
      role: "guest",
      favorites: [],
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("currentUser", JSON.stringify(user));
    router.push("/dashboard");
  };

  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!ownerEmail || !ownerPassword) {
      setError("Please fill in all fields");
      return;
    }

    const owner = {
      id: `owner-${Date.now()}`,
      email: ownerEmail,
      name: ownerEmail.split("@")[0],
      role: "owner",
      properties: [],
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("currentUser", JSON.stringify(owner));
    router.push("/owner/dashboard");
  };

  return (
    <>
      <SEO title="Login - GO/NEWD" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-2xl font-bold text-white">G</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">GO/NEWD</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue your journey</p>
          </div>

          <Tabs defaultValue="guest" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="guest">Guest Login</TabsTrigger>
              <TabsTrigger value="owner">Property Owner</TabsTrigger>
            </TabsList>

            <TabsContent value="guest">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Guest Account</CardTitle>
                  <CardDescription>
                    Explore naturist destinations worldwide
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGuestLogin}>
                    <div className="space-y-4">
                      {error && (
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{error}</span>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="guest-email">Email</Label>
                        <Input
                          id="guest-email"
                          type="email"
                          placeholder="you@example.com"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guest-password">Password</Label>
                        <Input
                          id="guest-password"
                          type="password"
                          placeholder="••••••••"
                          value={guestPassword}
                          onChange={(e) => setGuestPassword(e.target.value)}
                          className="h-12"
                        />
                      </div>
                      <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        Sign In
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Link href="/signup" className="text-sm text-blue-600 hover:underline">
                    Don't have an account? Sign up
                  </Link>
                  <Link href="/forgot-password" className="text-sm text-gray-600 hover:underline">
                    Forgot password?
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="owner">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Property Owner</CardTitle>
                  <CardDescription>
                    Manage your naturist property listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleOwnerLogin}>
                    <div className="space-y-4">
                      {error && (
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{error}</span>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="owner-email">Email</Label>
                        <Input
                          id="owner-email"
                          type="email"
                          placeholder="owner@property.com"
                          value={ownerEmail}
                          onChange={(e) => setOwnerEmail(e.target.value)}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="owner-password">Password</Label>
                        <Input
                          id="owner-password"
                          type="password"
                          placeholder="••••••••"
                          value={ownerPassword}
                          onChange={(e) => setOwnerPassword(e.target.value)}
                          className="h-12"
                        />
                      </div>
                      <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        Sign In as Owner
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Link href="/owner/signup" className="text-sm text-blue-600 hover:underline">
                    List your property
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}