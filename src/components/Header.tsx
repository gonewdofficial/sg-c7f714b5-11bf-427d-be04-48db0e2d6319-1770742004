import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User, Heart, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/services/authService";

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <div className="relative h-10 w-auto">
            <Image
              src="/Untitled_design_20260127_163222_0000.png"
              alt="GO/NEWD Logo"
              width={120}
              height={40}
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-brand" style={{ color: '#1A1A1A' }}>
            Discover
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-brand" style={{ color: '#1A1A1A' }}>
            About
          </Link>
          <Link href="/list-property" className="text-sm font-medium transition-colors hover:text-brand" style={{ color: '#1A1A1A' }}>
            List Your Property
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Heart className="h-5 w-5" style={{ color: '#FF6347' }} />
          </Button>
          <Link href={isAuthenticated ? "/dashboard" : "/login"}>
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <User className="h-5 w-5" style={{ color: '#FF6347' }} />
            </Button>
          </Link>
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" style={{ color: '#FF6347' }} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-left font-bold" style={{ color: '#FF6347' }}>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                <Link href="/" className="text-lg font-medium transition-colors hover:text-brand">
                  Discover
                </Link>
                <Link href="/about" className="text-lg font-medium transition-colors hover:text-brand">
                  About
                </Link>
                <Link href="/list-property" className="text-lg font-medium transition-colors hover:text-brand">
                  List Your Property
                </Link>
                <div className="h-px bg-gray-200 my-2" />
                <Link href={isAuthenticated ? "/dashboard" : "/login"} className="text-lg font-medium transition-colors hover:text-brand flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {isAuthenticated ? "Dashboard" : "Login / Register"}
                </Link>
                <Link href="/favorites" className="text-lg font-medium transition-colors hover:text-brand flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favorites
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}