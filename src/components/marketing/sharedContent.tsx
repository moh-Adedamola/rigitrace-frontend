import type { TrustScore } from "@/lib/types/entities";

/**
 * Copy and sample data shared between "/" and "/verify" so the two pages
 * say exactly the same thing about how RigiTrace works — single source,
 * reused rather than re-typed. See AGENTS.md: no new claims invented here,
 * only what already existed on the homepage.
 */

// Illustrative only — not a real product record. Copy matches the trust
// explanation pattern in docs/ui-context.md Part 2 verbatim.
export const SAMPLE_TRUST_SCORE: TrustScore = {
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

export function SearchIcon() {
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

export function EvidenceIcon() {
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

export function ShieldIcon() {
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

export function FlagIcon() {
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

export const HOW_IT_WORKS_STEPS = [
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

export const TRANSPARENCY_RULES = [
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
