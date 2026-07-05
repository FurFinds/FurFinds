import Link from "next/link";
import { ButtonHTMLAttributes } from "react";

type Variant = "solid" | "outline" | "ghost";

const variantClasses: Record<Variant, string> = {
  solid: "bg-light-blue text-white hover:bg-dark-blue",
  outline: "border-2 border-light-blue text-dark-blue bg-white hover:bg-bg-blue",
  ghost: "text-dark-blue hover:bg-bg-blue",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "solid",
  className = "",
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "solid",
  className = "",
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={`${base} ${variantClasses[variant]} ${className}`}>
      {children}
    </Link>
  );
}
