"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "./Container";
import { ButtonLink } from "./Button";

const navLinks = [
  { href: "/search", label: "Search" },
  { href: "/for-businesses", label: "For Businesses" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
      <Container className="flex h-18 items-center justify-between py-3">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-black/80 transition-colors hover:text-dark-blue"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ButtonLink href="/login" variant="ghost" className="px-4 py-2">
            Log In
          </ButtonLink>
          <ButtonLink href="/signup" variant="solid" className="px-5 py-2">
            Sign Up
          </ButtonLink>
        </div>

        <button
          className="p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-black/5 bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-black/80 hover:bg-bg-blue"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-3 px-3">
              <ButtonLink href="/login" variant="outline" className="flex-1">
                Log In
              </ButtonLink>
              <ButtonLink href="/signup" variant="solid" className="flex-1">
                Sign Up
              </ButtonLink>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
