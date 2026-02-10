import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ADMIN_TOKEN = "admin_230420221301199210051994";

export default function OwnerSignupProtected() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if the admin token is present in the URL
    const { admin } = router.query;
    if (admin === ADMIN_TOKEN) {
      setIsAuthorized(true);
    }
  }, [router.query]);

  // If not authorized, show access denied message
  if (!isAuthorized) {
    return (
      <>
        <SEO 
          title="Owner Sign Up - Naturist Resort Marketplace"
          description="Owner account creation is managed by administrators"
        />
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
          <Header />
          <main className="container mx-auto px-4 sm:px-6 pt-20 pb-6 sm:pt-24 sm:pb-12">
            <div className="max-w-md mx-auto">
              <Card className="shadow-lg">
                <CardHeader className="space-y-1 px-4 pt-4 sm:px-6 sm:pt-6">
                  <CardTitle className="text-2xl font-bold text-center">Access Denied</CardTitle>
                  <CardDescription className="text-center">
                    This page is restricted
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                  <Alert className="bg-orange-50 border-orange-200">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      Owner accounts can only be created by administrators. If you need to list a property, 
                      please contact the platform administrator.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </>
    );
  }

  // If authorized, show the actual signup form (you'll need to implement this)
  return (
    <>
      <SEO 
        title="Create Owner Account - Naturist Resort Marketplace"
        description="Create an owner account to list your naturist resort or hotel"
      />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 pt-20 pb-6 sm:pt-24 sm:pb-12">
          <div className="max-w-md mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="space-y-1 px-4 pt-4 sm:px-6 sm:pt-6">
                <CardTitle className="text-2xl font-bold text-center">Create Owner Account</CardTitle>
                <CardDescription className="text-center">
                  Authorized access - You may proceed with account creation
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                <Alert className="bg-green-50 border-green-200">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Access granted. Please implement the signup form here or redirect to the admin dashboard 
                    to create owner accounts.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}