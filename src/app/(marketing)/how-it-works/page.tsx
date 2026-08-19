import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { ProductSearch } from "@/components/consumer/ProductSearch";

export const metadata: Metadata = {
  title: "How it works — RigiTrace",
  description:
    "How a product gets an identity on RigiTrace, what counts as evidence, how a trust score is calculated and why it changes, how a consumer verifies something, and what happens when someone reports a suspicious product.",
};

export default function HowItWorksPage() {
  return (
    <>
      <MarketingHero
        eyebrow="How it works"
        heading="How RigiTrace works"
        intro="Five things happen between a product being registered and a shopper deciding whether to trust it. Here's exactly what each one does."
      />

      {/* 1. Identity */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            A product&apos;s identity
          </h2>
          <div className="mt-6 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-start">
            <div className="space-y-4 text-sm text-muted-foreground md:text-base">
              <p>
                A brand registers on RigiTrace with its business details, and every brand is
                reviewed before it can publish anything. An unreviewed brand can&apos;t put a
                product on the platform.
              </p>
              <p>
                Once approved, the brand registers each product — a name, a category, and, where
                one exists, a barcode. That record is the product&apos;s identity: a single,
                permanent anchor that everything else — evidence, trust status, reports — attaches
                to.
              </p>
              <p>
                A product stays in draft while the brand is still filling it in, and only becomes
                publicly searchable once the brand publishes it. A jar of body cream gets
                registered by its brand before anyone can look it up — identity comes first,
                before any proof is attached.
              </p>
            </div>
            {/* Decorative — illustrates the section, adds no fact beyond the text */}
            <div className="overflow-hidden rounded-lg border border-border">
              <Image
                src="/images/marketing/how-it-works-identity.webp"
                alt=""
                width={1200}
                height={800}
                sizes="(min-width: 768px) 35vw, 100vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Evidence */}
      <section className="section-y">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Evidence, and who supplies it
          </h2>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground md:text-base">
            <p>
              Evidence is anything submitted to support a product&apos;s authenticity —
              certificates, registration numbers, retailer confirmations, photos, or a written
              account of where something came from.
            </p>
            <p>
              It can come from five kinds of sources: the brand itself, a manufacturer, a
              retailer stocking the product, a consumer who bought it, or a regulator. A product
              backed by more than one kind of source is harder to fake convincingly than one only
              the brand vouches for.
            </p>
            <p>
              Evidence is never edited or deleted. If something needs correcting, the correction
              is added as a new entry that points back at the one it replaces — the original
              stays visible. Nothing quietly disappears from a product&apos;s record.
            </p>
            <p>
              Right now, supporting documents are referenced by link rather than uploaded
              directly to RigiTrace — direct file upload is planned, not built yet.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Trust */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            How a trust score is calculated — and why it moves
          </h2>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground md:text-base">
            <p>
              Every product has a trust score, and it&apos;s never shown as a bare number.
              Alongside the score is a plain-language explanation and the specific factors
              behind it — you can always see why a score is what it is, not just what it is.
            </p>
            <p>
              A handful of things genuinely move a score: whether the brand behind it has been
              reviewed and approved, whether the product record itself is complete, and how much
              evidence supports it — more evidence counts, and evidence from a wider range of
              source types counts for more than the same volume from just one. We don&apos;t
              publish the exact weighting: it would only hand people a formula to game, and it
              changes as the system learns.
            </p>
            <p>
              A product with no evidence at all isn&apos;t scored low — it&apos;s marked
              &quot;not yet verified,&quot; which is a different thing. A brand that
              hasn&apos;t added evidence yet isn&apos;t being flagged as suspicious; it just
              hasn&apos;t been checked.
            </p>
            <p>
              Reports factor in too, but only once one&apos;s been reviewed and confirmed —
              and that review process isn&apos;t built yet, so no report currently affects a
              score. More on that below.
            </p>
            <p>
              Scores aren&apos;t fixed at registration. Every time new evidence comes in, the
              score is recalculated from everything on record at that moment — a product can
              move from unverified to well-supported as its brand builds up its record.
            </p>
            <p>
              <strong className="font-medium text-foreground">
                Brands cannot buy a higher score.
              </strong>{" "}
              The calculation looks at evidence, the product record, and reports — nothing else.
              There&apos;s no payment or subscription tier anywhere in that calculation, so
              there&apos;s nothing to buy. Evidence that reflects badly on a product isn&apos;t
              removed for money either — as above, nothing is ever removed.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Verification */}
      <section className="section-y">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            What a consumer actually does
          </h2>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground md:text-base">
            <p>
              Go to RigiTrace and search for a product by name or barcode. That&apos;s it — no
              account, no sign-up, no login, at any point.
            </p>
            <p>
              One matching product takes you straight to its page. More than one match shows a
              short list — product, brand, and trust status — so you pick the right one at a
              glance, not a scroll.
            </p>
            <p>
              No match doesn&apos;t mean fake. It means nobody has registered that product on
              RigiTrace yet, and the page says exactly that rather than implying anything about
              the product itself.
            </p>
            <p>
              On a product&apos;s page: what it is and who makes it, its trust status with the
              explanation behind it, which verified retailers carry it, the evidence on record,
              and the option to report something that looks wrong.
            </p>
          </div>
          <div className="mt-6 rounded-lg border-l-4 border-primary bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-eyebrow">
              Worth knowing
            </p>
            <p className="mt-2 text-sm text-foreground">
              Nothing about searching is tracked. No account is created, and no analytics or
              advertising script watches what you look up. You come, you check, you leave —
              that&apos;s the whole interaction.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Reports */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            What happens when someone reports something
          </h2>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground md:text-base">
            <p>
              Anyone can report a product — no account needed. Leaving contact details is
              optional; they&apos;re recorded with the report, not acted on yet.
            </p>
            <p>
              A report gets recorded against the product. Filing one doesn&apos;t move a score
              by itself: reporting requires no account, so counting every submission
              automatically would make it trivial to file reports against a competitor and drag
              their score down instead.
            </p>
            <p>
              The scoring system only counts a report once it&apos;s been reviewed and
              confirmed — but reviewing reports isn&apos;t built yet, so as things stand, no
              report affects any product&apos;s score. That&apos;s planned, not live.
            </p>
            <p>
              Until it is, filing a report doesn&apos;t touch a score in either direction —
              which also means no one can use a false report to damage a competitor&apos;s
              standing today.
            </p>
          </div>
        </div>
      </section>

      {/* Closing — the real search, not a description of one */}
      <section className="section-y">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            See it for yourself
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Search any beauty product on RigiTrace — free, and no account needed.
          </p>
          <div className="mt-8">
            <ProductSearch />
          </div>
          <Link
            href="/trust"
            className="mt-6 inline-block text-sm text-eyebrow underline-offset-4 hover:underline"
          >
            Read the full breakdown of how scores are calculated
          </Link>
        </div>
      </section>
    </>
  );
}
