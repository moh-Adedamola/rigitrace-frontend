import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/verify", label: "Verify" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/trust", label: "Trust" },
    ],
  },
  {
    heading: "Business",
    links: [
      { href: "/for-brands", label: "For brands" },
      { href: "/for-retailers", label: "For retailers" },
      { href: "/for-brands", label: "Pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-section-raised">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <p className="text-xs font-semibold uppercase tracking-wide text-eyebrow">
                {column.heading}
              </p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-border pt-8 text-center">
          <span className="text-base font-semibold text-foreground">RigiTrace</span>
          <p className="text-sm text-muted-foreground">Confidence in Every Product.</p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RigiTrace. Lagos, Nigeria.
          </p>
        </div>
      </div>
    </footer>
  );
}
