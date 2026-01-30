import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-auto aspect-[3/1]">
              <Image
                src="/Untitled_design_20260127_163212_0000.png"
                alt="Go/Newd Logo"
                width={180}
                height={60}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-orange-500 transition-colors">
              Discover
            </Link>
            <Link href="/#about" className="text-sm font-medium hover:text-orange-500 transition-colors">
              About
            </Link>
            <Link href="/#contact" className="text-sm font-medium hover:text-orange-500 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium hover:text-orange-500 transition-colors">
                  Discover
                </Link>
                <Link href="/#about" className="text-lg font-medium hover:text-orange-500 transition-colors">
                  About
                </Link>
                <Link href="/#contact" className="text-lg font-medium hover:text-orange-500 transition-colors">
                  Contact
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}