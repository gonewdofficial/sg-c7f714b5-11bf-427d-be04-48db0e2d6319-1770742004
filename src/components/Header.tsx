import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User, Heart, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <div className="relative h-16 w-16 overflow-hidden rounded-full flex-shrink-0">
            <Image 
              src="/Untitled_design_20260127_163222_0000.png" 
              alt="GO/NEWD Logo" 
              fill
              className="object-cover"
              priority
            />
          </div>
        </Link>

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
          <Link href="/login">
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <User className="h-5 w-5" style={{ color: '#FF6347' }} />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" style={{ color: '#FF6347' }} />
          </Button>
        </div>
      </div>
    </header>
  );
}