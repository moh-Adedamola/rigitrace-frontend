import Link from "next/link";
import { ProductSearch } from "@/components/consumer/ProductSearch";
import { TrustBadge } from "@/components/trust/TrustBadge";
import type { TrustScore } from "@/lib/types/entities";

// Illustrative only — not a real product record. Copy matches the trust
// explanation pattern in docs/ui-context.md Part 2 verbatim.
const SAMPLE_TRUST_SCORE: TrustScore = {
  id: "sample",
  productId: "sample",
  score: 82,
  status: "high",
  explanation:
    "Aduke Naturals is an approved brand, and four pieces of evidence from three independent sources support this product. No unresolved reports.",
  factors: [
    {
      label: "Brand verification",
      impact: "positive",
      weight: 40,
      detail: "Aduke Naturals is an approved brand on RigiTrace",
    },
    {
      label: "Evidence volume and source diversity",
      impact: "positive",
      weight: 30,
      detail: "Four pieces of evidence from three independent sources",
    },
  ],
  calculatedAt: "2026-08-01T09:00:00Z",
};

const HOW_IT_WORKS_STEPS = [
  {
    icon: SearchIcon,
    title: "Search",
    body: "Type a product name or scan its barcode.",
  },
  {
    icon: EvidenceIcon,
    title: "See the evidence",
    body: "View what the brand, retailers, and others have submitted on record.",
  },
  {
    icon: ShieldIcon,
    title: "See the trust status",
    body: "Read the score and the reasons behind it — never just a number.",
  },
  {
    icon: FlagIcon,
    title: "Report if something's wrong",
    body: "Flag a suspicious product in a few taps, no account needed.",
  },
];

const TRANSPARENCY_RULES = [
  {
    title: "Consumers never pay",
    body: "Verifying a product is free, and it stays free.",
  },
  {
    title: "Scores can't be bought",
    body: "Brand status, payment, and subscription tier never influence a trust score — only evidence and reports do.",
  },
  {
    title: "Evidence is never deleted",
    body: "Corrections are added as new records. The original stays on view.",
  },
];

export default function MarketingHomePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-16 pb-10 md:pt-24 md:pb-14">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="mx-auto max-w-3xl font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            Know what you&apos;re buying.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            Search any beauty product to see who made it, what proof exists, and how
            much confidence that evidence supports. Free, and no account needed.
          </p>
          <div className="mt-8">
            <ProductSearch />
          </div>
          <a
            href="#how-it-works"
            className="mt-12 inline-flex flex-col items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-eyebrow animate-fade-up"
          >
            <span>How it works</span>
            <ChevronDownIcon />
          </a>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="section-y bg-section-raised">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-eyebrow">
            How it works
          </p>
          <h2 className="mx-auto mt-2 max-w-2xl text-center font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Four steps, no account needed.
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <div key={step.title} className="text-center sm:text-left">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary sm:mx-0">
                  <step.icon />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-eyebrow">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 text-base font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What a trust score means */}
      <section className="section-y">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-eyebrow">
            What a trust score means
          </p>
          <h2 className="mx-auto mt-2 max-w-xl font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Every score comes with its reasons.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            RigiTrace never shows a bare score. Every trust status is paired with the
            evidence and factors behind it — here&apos;s an example.
          </p>
          <div className="mt-8 text-left">
            <TrustBadge trustScore={SAMPLE_TRUST_SCORE} />
            <p className="mt-2 text-xs text-muted-foreground">
              Example only — not a real product on RigiTrace.
            </p>
          </div>
          <Link
            href="/trust"
            className="mt-4 inline-block text-sm text-eyebrow underline-offset-4 hover:underline"
          >
            See how trust scores work
          </Link>
        </div>
      </section>

      {/* Why it matters */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-eyebrow">
            Why it matters
          </p>
          <h2 className="mx-auto mt-2 max-w-xl font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Right now, checking a product means guessing.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            Counterfeit and mislabelled beauty products circulate in open markets and
            online, and a shopper standing in front of a shelf has no simple way to
            tell what&apos;s genuine before they pay. Brands lose sales and reputation
            to products they didn&apos;t make. RigiTrace gives everyone in that chain —
            brand, retailer, and buyer — the same record to check against.
          </p>
        </div>
      </section>

      {/* For brands / For retailers */}
      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-8">
              <h3 className="font-serif text-xl font-semibold text-foreground">
                Your products, provably yours.
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Register your brand, publish your products, and attach the evidence
                that proves they&apos;re genuine. When a customer checks, they see your
                record — not a guess.
              </p>
              <Link
                href="/for-brands"
                className="mt-6 inline-flex items-center justify-center rounded bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                Register your brand
              </Link>
            </div>
            <div className="rounded-lg border border-border bg-card p-8">
              <h3 className="font-serif text-xl font-semibold text-foreground">
                Your store, on the record.
              </h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Get verified and appear in the &quot;Available at&quot; list on every
                product page you carry — so a shopper checking a product also sees
                they can trust where they&apos;re buying it from.
              </p>
              <Link
                href="/for-retailers"
                className="mt-6 inline-flex items-center justify-center rounded bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                Get your store verified
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust and transparency */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-eyebrow">
            Trust and transparency
          </p>
          <h2 className="mx-auto mt-2 max-w-xl text-center font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Rules we don&apos;t bend.
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {TRANSPARENCY_RULES.map((rule) => (
              <div key={rule.title} className="text-center sm:text-left">
                <h3 className="text-base font-semibold text-foreground">{rule.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{rule.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 8l5 5 5-5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="6" />
      <path d="M17 17l-3.5-3.5" />
    </svg>
  );
}

function EvidenceIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 3h7l3 3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <path d="M7 9h6M7 12h6M7 15h3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 2l7 3v5c0 4.5-3 7-7 8-4-1-7-3.5-7-8V5l7-3z" />
      <path d="M7 10l2 2 4-4" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 17V3" />
      <path d="M5 4h9l-2 3 2 3H5" />
    </svg>
  );
}
