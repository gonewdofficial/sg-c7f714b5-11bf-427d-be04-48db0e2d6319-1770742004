import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center">
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
      </div>
    </header>
  );
}