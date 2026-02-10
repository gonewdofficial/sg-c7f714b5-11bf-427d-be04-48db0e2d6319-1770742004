import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function OwnerSignupDisabled() {
  return (
    <>
      <SEO 
        title="Owner Sign Up Disabled - Naturist Resort Marketplace"
        description="Owner account creation is managed by administrators"
      />
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 pt-20 pb-6 sm:pt-24 sm:pb-12">
          <div className="max-w-md mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="space-y-1 px-4 pt-4 sm:px-6 sm:pt-6">
                <CardTitle className="text-2xl font-bold text-center">Owner Registration</CardTitle>
                <CardDescription className="text-center">
                  Account creation is managed by administrators
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                <Alert className="bg-orange-50 border-orange-200">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    Owner accounts can only be created by administrators. If you need to list a property, 
                    please contact the platform administrator to have an account created for you.
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