import Link from "next/link";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className ?? ""}`}>
      <Image
        src="/logo.png"
        alt="FurFinds"
        width={800}
        height={600}
        className="h-12 w-auto"
        priority
      />
    </Link>
  );
}
