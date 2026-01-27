import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Heart, Calendar, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600">
            <span className="text-xl font-bold text-white">N</span>
          </div>
          <span className="text-xl font-bold tracking-tight">NaturEscape</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/search" className="text-sm font-medium transition-colors hover:text-emerald-600">
            Browse Resorts
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-emerald-600">
            About
          </Link>
          <Link href="/list-property" className="text-sm font-medium transition-colors hover:text-emerald-600">
            List Your Property
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Calendar className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}