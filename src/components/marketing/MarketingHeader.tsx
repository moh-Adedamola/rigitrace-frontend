"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/trust", label: "Trust" },
  { href: "/for-brands", label: "For brands" },
  { href: "/for-retailers", label: "For retailers" },
  { href: "/about", label: "About" },
];

// No display utility baked in here — "inline-flex" and "hidden" on the same
// element fight each other regardless of className string order, since the
// cascade follows Tailwind's generated stylesheet order, not source order.
// Each call site adds its own display utility instead.
const CTA_CLASSES =
  "h-11 items-center justify-center rounded px-4 text-sm font-medium text-primary-foreground bg-primary transition-colors hover:bg-primary/90";

export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 4);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    // The mobile sheet is a sibling, not a child, of <header>: backdrop-blur
    // sets backdrop-filter, which establishes a new containing block for
    // position:fixed descendants. Nested inside <header>, the sheet's
    // top-16/bottom-0 would resolve against the header's own 64px box instead
    // of the viewport, collapsing it to zero height.
    <>
      <header
        className={`sticky top-0 z-50 bg-background/95 backdrop-blur transition-colors ${
          scrolled ? "border-b border-border" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-foreground"
            onClick={() => setMenuOpen(false)}
          >
            RigiTrace
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/verify" className={`hidden md:inline-flex ${CTA_CLASSES}`}>
            Verify a product
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col bg-background md:hidden">
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center rounded px-3 text-base font-medium text-foreground hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-border p-4">
            <Link
              href="/verify"
              onClick={() => setMenuOpen(false)}
              className={`inline-flex w-full ${CTA_CLASSES}`}
            >
              Verify a product
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function HamburgerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 5h14M3 10h14M3 15h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}
