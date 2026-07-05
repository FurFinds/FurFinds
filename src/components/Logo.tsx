import Link from "next/link";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="26" cy="26" r="21" fill="#D3EEFF" stroke="#395EA1" strokeWidth="3" />
      <circle cx="26" cy="26" r="16" fill="#D3EEFF" stroke="#395EA1" strokeWidth="1.5" opacity="0.6" />
      <line
        x1="40.5"
        y1="40.5"
        x2="56"
        y2="56"
        stroke="#395EA1"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* paw print */}
      <g fill="#88C7E8" stroke="#395EA1" strokeWidth="1.5">
        <ellipse cx="19" cy="19" rx="3.4" ry="4.4" transform="rotate(-15 19 19)" />
        <ellipse cx="27" cy="16.5" rx="3.4" ry="4.4" />
        <ellipse cx="35" cy="19" rx="3.4" ry="4.4" transform="rotate(15 35 19)" />
        <path d="M27 24c6 0 9 4.2 9 8.2 0 4.4-4 6.3-9 6.3s-9-1.9-9-6.3c0-4 3-8.2 9-8.2z" />
      </g>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark />
      <span className="font-display text-2xl font-medium tracking-tight text-dark-blue">
        FurFinds
      </span>
    </Link>
  );
}
