import Link from "next/link";
import { Logo } from "./Logo";
import { Container } from "./Container";

const legalLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/pet-parent-guidelines", label: "Pet Parent Guidelines" },
  { href: "/review-guidelines", label: "User Review Guidelines" },
  { href: "/report", label: "Report a Complaint" },
];

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-dark-blue text-white">
      <Container className="flex flex-col items-center gap-6 py-14 text-center">
        <Logo className="[&_span]:text-white" />
        <p className="max-w-md text-sm text-white/80">Making pet-friendly mean something.</p>

        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {legalLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm text-white/70 hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container>
          <p className="text-center text-xs text-white/60">
            © {new Date().getFullYear()} FurFinds. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
