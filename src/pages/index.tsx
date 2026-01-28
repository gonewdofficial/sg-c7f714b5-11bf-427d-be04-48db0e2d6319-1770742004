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
        title="GO/NEWD - Discover Naturist Hotels & Resorts Worldwide"
        description="Explore authentic naturist hotels, resorts, and retreats worldwide. Browse reviews, compare amenities, and connect with your perfect clothing-optional destination."
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />

        {/* Hero Section - Mobile First */}
        <section className="relative pt-12 md:pt-20 pb-20 md:pb-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-60" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                Discover Freedom<br />in Natural Settings
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 md:mb-8 font-light px-4">
                Explore authentic naturist hotels, resorts, and retreats worldwide
              </p>
            </div>

            <SearchBar />

            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-8 md:mt-12 px-4">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 md:px-4 py-2 rounded-full shadow-md">
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-blue-600 shrink-0" />
                <span className="text-xs md:text-sm font-medium whitespace-nowrap">500+ Properties</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 md:px-4 py-2 rounded-full shadow-md">
                <Shield className="h-4 w-4 md:h-5 md:w-5 text-blue-600 shrink-0" />
                <span className="text-xs md:text-sm font-medium whitespace-nowrap">Verified Reviews</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 md:px-4 py-2 rounded-full shadow-md">
                <Globe className="h-4 w-4 md:h-5 md:w-5 text-blue-600 shrink-0" />
                <span className="text-xs md:text-sm font-medium whitespace-nowrap">50+ Countries</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties - Mobile First */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-10 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Featured Destinations</h2>
                <p className="text-sm md:text-base text-gray-600">Handpicked premium naturist locations</p>
              </div>
              <Button variant="outline" className="w-full md:w-auto">
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us - Mobile First */}
        <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Why GO/NEWD?</h2>
              <p className="text-sm md:text-base lg:text-lg text-gray-600">The trusted platform for naturist accommodations</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center p-4 md:p-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-7 w-7 md:h-8 md:w-8 text-blue-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">Verified Properties</h3>
                <p className="text-sm md:text-base text-gray-600">All listings verified for authenticity and quality</p>
              </div>

              <div className="text-center p-4 md:p-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-7 w-7 md:h-8 md:w-8 text-blue-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">Real Reviews</h3>
                <p className="text-sm md:text-base text-gray-600">Honest feedback from verified guests</p>
              </div>

              <div className="text-center p-4 md:p-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-7 w-7 md:h-8 md:w-8 text-blue-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">Global Network</h3>
                <p className="text-sm md:text-base text-gray-600">Properties in over 50 countries worldwide</p>
              </div>

              <div className="text-center p-4 md:p-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-7 w-7 md:h-8 md:w-8 text-blue-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">Curated Selection</h3>
                <p className="text-sm md:text-base text-gray-600">Handpicked destinations for the best experience</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Mobile First */}
        <section className="py-16 md:py-20 px-4">
          <div className="container mx-auto">
            <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Ready for Your Next Adventure?</h2>
              <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 opacity-90">Explore thousands of naturist destinations worldwide</p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 w-full sm:w-auto">
                  Browse All Destinations
                </Button>
                <Button size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 bg-transparent text-white border-white hover:bg-white/10 w-full sm:w-auto">
                  List Your Property
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Mobile First */}
        <footer className="bg-gray-900 text-gray-300 py-10 md:py-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
              <div className="col-span-2 md:col-span-1">
                <h4 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4">GO/NEWD</h4>
                <p className="text-xs md:text-sm">The world's leading naturist accommodation marketplace</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">Company</h4>
                <ul className="space-y-2 text-xs md:text-sm">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Press</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">Support</h4>
                <ul className="space-y-2 text-xs md:text-sm">
                  <li>Help Center</li>
                  <li>Safety</li>
                  <li>Contact Us</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3 md:mb-4 text-sm md:text-base">Legal</h4>
                <ul className="space-y-2 text-xs md:text-sm">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Cookie Policy</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 md:pt-8 text-center text-xs md:text-sm">
              <p>&copy; 2026 GO/NEWD. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}