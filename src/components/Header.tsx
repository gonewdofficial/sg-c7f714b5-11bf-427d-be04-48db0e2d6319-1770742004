import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <div className="relative h-12 w-auto">
            <Image
              src="/Untitled_design_20260127_163212_0000.png"
              alt="Go/Newd Logo"
              width={140}
              height={48}
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-orange-600" style={{ color: "#1A1A1A" }}>
            Discover
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-orange-600" style={{ color: "#1A1A1A" }}>
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-orange-600" style={{ color: "#1A1A1A" }}>
            Contact
          </Link>
        </nav>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" style={{ color: "#FF6347" }} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="text-left font-bold" style={{ color: "#FF6347" }}>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4 mt-6">
              <Link href="/" className="text-lg font-medium transition-colors hover:text-orange-600">
                Discover
              </Link>
              <Link href="/about" className="text-lg font-medium transition-colors hover:text-orange-600">
                About
              </Link>
              <Link href="/contact" className="text-lg font-medium transition-colors hover:text-orange-600">
                Contact
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}