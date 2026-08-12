import { TrustBadge } from "@/components/trust/TrustBadge";
import type { TrustScore } from "@/lib/types/entities";

// Illustrative only — not real products on RigiTrace. Built to match what
// src/lib/trust/calculateTrustScore.ts actually generates for each status,
// not marketing copy dressed up to look nicer. See that file for the real
// logic; point weights are deliberately not published here (see below).
const EXAMPLE_UNVERIFIED: TrustScore = {
  id: "example-unverified",
  productId: "example-unverified",
  score: 0,
  status: "unverified",
  explanation: "This product has not been verified yet — no evidence has been submitted.",
  factors: [
    {
      label: "No evidence submitted",
      impact: "neutral",
      weight: 0,
      detail:
        "This product has not yet received any evidence from a brand, manufacturer, retailer, consumer, or regulator.",
    },
  ],
  calculatedAt: "2026-08-01T09:00:00Z",
};

const EXAMPLE_LOW: TrustScore = {
  id: "example-low",
  productId: "example-low",
  score: 10,
  status: "low",
  explanation:
    "Limited verification signals — missing evidence, incomplete product information, or unresolved reports.",
  factors: [
    {
      label: "Brand verification",
      impact: "negative",
      weight: 0,
      detail: "This brand is not currently approved on RigiTrace.",
    },
    {
      label: "Product completeness",
      impact: "negative",
      weight: 0,
      detail: "Missing barcode and product images.",
    },
    {
      label: "Evidence on record",
      impact: "positive",
      weight: 10,
      detail: "1 piece(s) of evidence from 1 distinct source(s).",
    },
  ],
  calculatedAt: "2026-08-01T09:00:00Z",
};

const EXAMPLE_MEDIUM: TrustScore = {
  id: "example-medium",
  productId: "example-medium",
  score: 60,
  status: "medium",
  explanation: "Some verification signals present, but evidence or product information is incomplete.",
  factors: [
    {
      label: "Brand verification",
      impact: "positive",
      weight: 40,
      detail: "This brand is approved and verified on RigiTrace.",
    },
    {
      label: "Product completeness",
      impact: "neutral",
      weight: 10,
      detail: "Missing either a barcode or product images.",
    },
    {
      label: "Evidence on record",
      impact: "positive",
      weight: 10,
      detail: "1 piece(s) of evidence from 1 distinct source(s).",
    },
  ],
  calculatedAt: "2026-08-01T09:00:00Z",
};

const EXAMPLE_HIGH: TrustScore = {
  id: "example-high",
  productId: "example-high",
  score: 90,
  status: "high",
  explanation: "Verified brand with 5 piece(s) of supporting evidence and no unresolved reports.",
  factors: [
    {
      label: "Brand verification",
      impact: "positive",
      weight: 40,
      detail: "Aduke Naturals is an approved, verified brand on RigiTrace.",
    },
    {
      label: "Product completeness",
      impact: "positive",
      weight: 20,
      detail: "Barcode and product images are both present.",
    },
    {
      label: "Evidence on record",
      impact: "positive",
      weight: 30,
      detail: "5 piece(s) of evidence from 3 distinct source(s).",
    },
  ],
  calculatedAt: "2026-08-01T09:00:00Z",
};

const EXAMPLES = [
  {
    trustScore: EXAMPLE_UNVERIFIED,
    caption: "Just registered. No evidence has been submitted for it yet.",
  },
  {
    trustScore: EXAMPLE_LOW,
    caption: "The brand isn't currently approved, and only one piece of evidence exists.",
  },
  {
    trustScore: EXAMPLE_MEDIUM,
    caption: "The brand is approved, but the product record is missing a barcode or photos.",
  },
  {
    trustScore: EXAMPLE_HIGH,
    caption: "Approved brand, a complete record, and evidence from three different kinds of sources.",
  },
];

export default function TrustPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-y">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-eyebrow">Trust</p>
          <h1 className="mx-auto mt-2 font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            How trust scores work
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            No black box. This page describes exactly what raises a score, what lowers
            it, and what it doesn&apos;t mean — written for anyone deciding whether to
            trust it, including the brands it scores.
          </p>
        </div>
      </section>

      {/* What a score is / isn't */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-center font-serif text-2xl font-semibold text-foreground md:text-3xl">
            What a trust score is — and isn&apos;t
          </h2>
          <p className="mt-4 text-center text-sm text-muted-foreground md:text-base">
            A trust score is RigiTrace&apos;s assessment of how much evidence supports a
            product&apos;s authenticity, and how strong that evidence is. It is not:
          </p>
          <ul className="mx-auto mt-6 max-w-xl space-y-3 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Not a safety guarantee.</span>{" "}
              A high score means the record behind a product is strong — not that the
              product is safe to use.
            </li>
            <li>
              <span className="font-medium text-foreground">Not a quality rating.</span>{" "}
              It says nothing about how good a product is, only how well its
              authenticity is documented.
            </li>
            <li>
              <span className="font-medium text-foreground">Not an endorsement.</span>{" "}
              RigiTrace scoring a product doesn&apos;t mean we recommend it.
            </li>
            <li>
              <span className="font-medium text-foreground">Not permanent.</span> Scores
              are recalculated as evidence changes — more on that below.
            </li>
          </ul>
        </div>
      </section>

      {/* Prominent callout — the most likely misreading */}
      <section className="section-y">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-lg border-l-4 border-trust-unverified bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-eyebrow">
              Read this first
            </p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">
              A score of zero is not an accusation.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              A product with a score of zero and &quot;not yet verified&quot; status
              hasn&apos;t failed anything — it means no one has submitted evidence for
              it yet. That&apos;s true of every product the moment it&apos;s
              registered, before a single certificate or photo has been attached. It
              says nothing about whether the product is genuine. Treating an unverified
              product as suspicious would punish brands for the order in which they
              upload evidence, not for anything they did wrong.
            </p>
          </div>
        </div>
      </section>

      {/* What raises a score */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-center font-serif text-2xl font-semibold text-foreground md:text-3xl">
            What raises a score
          </h2>
          <ul className="mx-auto mt-8 max-w-xl space-y-4 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Verified brand status.</span>{" "}
              The brand is approved on RigiTrace, meaning we&apos;ve checked their
              registration details before letting them publish anything under their
              name. This carries the most weight of any single factor.
            </li>
            <li>
              <span className="font-medium text-foreground">Product completeness.</span>{" "}
              The product record includes a barcode and photos. A bare listing with just
              a name scores lower than one a brand has filled in properly.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Evidence volume and source diversity.
              </span>{" "}
              More evidence raises a score, and evidence from different kinds of
              sources — brand, manufacturer, retailer, consumer, regulator — raises it
              further than the same number of submissions from just one. A product
              backed by three different kinds of sources is harder to fake convincingly
              than one supported only by a brand vouching for itself.
            </li>
            <li>
              <span className="font-medium text-foreground">
                No reports counted against it.
              </span>{" "}
              This doesn&apos;t add points on top of everything else — but once report
              review is built, a reviewed and confirmed report would subtract from the
              score. See below for where that stands today.
            </li>
          </ul>
        </div>
      </section>

      {/* What lowers a score */}
      <section className="section-y">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-center font-serif text-2xl font-semibold text-foreground md:text-3xl">
            What lowers a score
          </h2>
          <ul className="mx-auto mt-8 max-w-xl space-y-4 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Missing information.</span>{" "}
              No barcode, no photos — an incomplete product record scores lower than a
              complete one, even for a fully verified brand.
            </li>
            <li>
              <span className="font-medium text-foreground">Reports, once reviewed.</span>{" "}
              Filing a report never moves a score by itself — it&apos;s recorded against
              the product, nothing more. Reporting requires no account, so counting every
              submission automatically would make it trivial to file reports against a
              competitor and drag their score down instead. The scoring system only
              counts a report once it&apos;s been reviewed and confirmed — reviewing
              reports is planned, but that process isn&apos;t built yet, so as things
              stand, no report currently affects any product&apos;s score.
            </li>
          </ul>
        </div>
      </section>

      {/* Recalculation */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Scores are recalculated, not permanent
          </h2>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            A trust score isn&apos;t a one-time grade. Every time new evidence is
            submitted, the score is recalculated from everything on record at that
            moment. A product that started with no evidence and a score of zero can
            move to a strong score as its brand and others add support — and, in
            principle, a score can move the other way too, if that&apos;s what the
            evidence shows. Nothing about a score is locked in.
          </p>
        </div>
      </section>

      {/* Cannot be bought */}
      <section className="section-y">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Trust cannot be bought
          </h2>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            No brand&apos;s status, payment, or subscription tier ever factors into a
            trust score — the calculation only looks at evidence, product information,
            and reports. There&apos;s no way to pay for a higher score, and no way to
            pay to have unfavourable evidence removed. Evidence is never deleted, not
            even when it&apos;s wrong: a correction is added as a new record that
            references the old one, and the original stays visible. If something was
            inaccurate, you can see that it was corrected — not pretend it never
            happened.
          </p>
        </div>
      </section>

      {/* How to improve */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-center font-serif text-2xl font-semibold text-foreground md:text-3xl">
            How to improve your score
          </h2>
          <ol className="mx-auto mt-8 max-w-xl space-y-4 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">1. Get your brand approved</span>,
              if it isn&apos;t already — this is the single largest factor.
            </li>
            <li>
              <span className="font-medium text-foreground">2. Complete your product record</span>{" "}
              — a barcode and real photos, not placeholders.
            </li>
            <li>
              <span className="font-medium text-foreground">3. Submit more evidence</span>,
              and from more than one kind of source where you can — a manufacturer&apos;s
              certificate and a retailer&apos;s confirmation count for more, together,
              than either alone.
            </li>
            <li>
              <span className="font-medium text-foreground">4. Reports aren&apos;t worth
                acting on for your score yet</span>{" "}
              — reviewing reports so they can count isn&apos;t built, so right now, filed
              reports have no effect on any product&apos;s score, resolved or not. Once
              that&apos;s live, this is designed to reward addressing a problem, not just
              avoiding one.
            </li>
          </ol>
        </div>
      </section>

      {/* Examples */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center font-serif text-2xl font-semibold text-foreground md:text-3xl">
            What this looks like
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted-foreground">
            Four illustrative examples — not real products on RigiTrace.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {EXAMPLES.map((example) => (
              <div key={example.trustScore.id}>
                <TrustBadge trustScore={example.trustScore} />
                <p className="mt-2 text-xs text-muted-foreground">{example.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
