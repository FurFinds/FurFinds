import Link from "next/link";
import { Logo } from "./Logo";
import { Container } from "./Container";
import { SocialIcon, type SocialPlatform } from "./SocialIcon";

const navLinks = [
  { href: "/search", label: "Search" },
  { href: "/for-businesses", label: "For Businesses" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

const legalLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/pet-parent-guidelines", label: "Pet Parent Guidelines" },
  { href: "/review-guidelines", label: "User Review Guidelines" },
  { href: "/report", label: "Report a Complaint" },
];

const socialLinks: { href: string; label: string; platform: SocialPlatform }[] = [
  { href: "https://facebook.com", label: "Facebook", platform: "facebook" },
  { href: "https://instagram.com", label: "Instagram", platform: "instagram" },
  { href: "https://twitter.com", label: "Twitter / X", platform: "x" },
  { href: "https://youtube.com", label: "YouTube", platform: "youtube" },
];

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-dark-blue text-white">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="[&_span]:text-white" />
          <p className="mt-4 max-w-xs text-sm text-white/80">
            Making pet-friendly mean something. Discover verified pet-friendly businesses you can
            trust.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">
            Explore
          </h3>
          <ul className="space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/90 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">
            Legal
          </h3>
          <ul className="space-y-2.5">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/90 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">
            Follow Us
          </h3>
          <ul className="flex flex-col gap-3">
            {socialLinks.map(({ href, label, platform }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/90 hover:text-white"
                >
                  <SocialIcon platform={platform} size={18} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
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
