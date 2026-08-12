import Link from "next/link";

const CTA_CLASSES =
  "inline-flex h-11 items-center justify-center rounded px-6 text-sm font-medium text-primary-foreground bg-primary transition-colors hover:bg-primary/90";

interface SecondaryLink {
  label: string;
  href: string;
}

/**
 * Shared closing-CTA section: heading, body, one primary button — matches
 * BusinessCasePage's CTA section byte-for-byte, extracted so /how-it-works
 * and /about don't duplicate it. Optional secondaryLinks render as small
 * text links beneath the button (the small-link style already used for
 * "See how trust scores work" on the homepage), for pages that need to
 * point at more than one real destination without competing primaries —
 * "one primary CTA per page" still holds, these are secondary by design.
 */
export function MarketingCTA({
  heading,
  body,
  primaryHref,
  primaryLabel,
  secondaryLinks,
}: {
  heading: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryLinks?: SecondaryLink[];
}) {
  return (
    <section className="section-y">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">{heading}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">{body}</p>
        <Link href={primaryHref} className={`mt-6 ${CTA_CLASSES}`}>
          {primaryLabel}
        </Link>
        {secondaryLinks && secondaryLinks.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-eyebrow underline-offset-4 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
