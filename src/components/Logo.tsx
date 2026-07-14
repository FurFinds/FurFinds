import Link from "next/link";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className ?? ""}`}>
      <Image
        src="/images/logo.png"
        alt="FurFinds"
        width={160}
        height={120}
        className="h-12 w-auto"
        priority
      />
    </Link>
  );
}
