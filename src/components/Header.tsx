import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/Untitled_design_20260127_163222_0000.png"
            alt="GO/NEWD"
            width={120}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </Link>
        
        <Link href="/owner/login">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Login</span>
            <span className="sm:hidden">Login</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}