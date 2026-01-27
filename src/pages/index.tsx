import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { properties } from "@/lib/mockData";
import { Sparkles, Shield, Globe, Award } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function Home() {
  const featuredProperties = properties.filter(p => p.featured);

  return (
    <>
      <SEO 
        title="NaturEscape - Discover Naturist Hotels & Resorts Worldwide"
        description="Book authentic naturist hotels, resorts, and retreats worldwide. Browse reviews, compare prices, and find your perfect clothing-optional getaway."
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />

        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 opacity-60" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                Discover Freedom<br />in Natural Settings
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 font-light">
                Book authentic naturist hotels, resorts, and retreats worldwide
              </p>
            </div>

            <SearchBar />

            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-md">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium">500+ Properties</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-md">
                <Shield className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium">Verified Reviews</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-md">
                <Globe className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium">50+ Countries</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Resorts</h2>
                <p className="text-gray-600">Handpicked premium naturist destinations</p>
              </div>
              <Button variant="outline" className="hidden md:inline-flex">
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why NaturEscape?</h2>
              <p className="text-gray-600 text-lg">The trusted platform for naturist accommodations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Verified Properties</h3>
                <p className="text-gray-600">All listings verified for authenticity and quality</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real Reviews</h3>
                <p className="text-gray-600">Honest feedback from verified guests</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Global Network</h3>
                <p className="text-gray-600">Properties in over 50 countries worldwide</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Best Prices</h3>
                <p className="text-gray-600">Competitive rates with no hidden fees</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-3xl p-12 text-center text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready for Your Next Adventure?</h2>
              <p className="text-xl mb-8 opacity-90">Join thousands of happy naturists worldwide</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Browse All Resorts
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent text-white border-white hover:bg-white/10">
                  List Your Property
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-white font-bold text-lg mb-4">NaturEscape</h4>
                <p className="text-sm">The world's leading naturist accommodation marketplace</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Press</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li>Help Center</li>
                  <li>Safety</li>
                  <li>Contact Us</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Cookie Policy</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-sm">
              <p>&copy; 2026 NaturEscape. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}