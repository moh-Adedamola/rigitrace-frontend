import type { Metadata } from "next";
import Image from "next/image";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";

export const metadata: Metadata = {
  title: "About — RigiTrace",
  description:
    "RigiTrace is product trust infrastructure for African commerce — what we're building, what we deliberately aren't, the revenue rules we bind ourselves to, and why beauty in Nigeria comes first.",
};

export default function AboutPage() {
  return (
    <>
      <MarketingHero
        eyebrow="About"
        heading="Confidence in every product."
        intro="RigiTrace is product trust infrastructure for African commerce — a shared, evidence-based record that consumers, brands, and retailers can all check against, instead of each one guessing on their own."
      />

      {/* The problem */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            The problem
          </h2>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground md:text-base">
            <p>
              Right now, product trust is fragmented. A shopper standing in front of a shelf has
              no way to check what they&apos;re buying before they pay. A legitimate brand has
              no way to prove that a fake carrying its name isn&apos;t theirs. A retailer
              stocking genuine goods has no way to show that. A regulator trying to understand
              what&apos;s actually circulating has no visibility into any of it.
            </p>
            <p>
              Each of those groups holds one piece of the picture, and none of them are connected
              to each other. RigiTrace exists to connect them through one shared product record,
              instead of four separate, disconnected guesses.
            </p>
          </div>
        </div>
      </section>

      {/* What we're building / what we aren't */}
      <section className="section-y">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            What we&apos;re building — and what we&apos;re not
          </h2>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground md:text-base">
            <p>
              RigiTrace is a platform, not a single app: a product identity system that a public
              verification search sits on top of today, with a brand portal, a retailer portal,
              and an admin console being built on the same record underneath it.
            </p>
            <p>
              A physical product becomes one digital record: who made it, what proof supports it,
              a trust score that explains itself, and a history of what&apos;s happened to it.
              That&apos;s the record a shopper checks, a brand builds, and — eventually — a
              regulator can see into.
            </p>
            <p>
              What it deliberately isn&apos;t: not AI-based verification, not blockchain or NFT
              identities, not supply-chain or batch tracking, not a marketplace, not a social
              network. Blockchain and NFTs in particular aren&apos;t on a someday list — we
              looked at them and decided they don&apos;t strengthen the actual job, which is
              evidence and proof, not a ledger.
            </p>
            <p>
              A mobile app, a public API, and deeper integrations are on the roadmap once the web
              platform&apos;s foundations are solid. They&apos;re planned, not built — we&apos;re
              not describing them as if they already exist.
            </p>
          </div>
        </div>
      </section>

      {/* Revenue rules */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            The rules we don&apos;t bend
          </h2>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            Because trust is the entire product, a few rules are non-negotiable, not aspirational:
          </p>
          <ul className="mx-auto mt-6 max-w-xl space-y-3 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Consumers never pay</span> to verify
              a product, and never need an account to do it.
            </li>
            <li>
              <span className="font-medium text-foreground">We never sell consumer data.</span>
            </li>
            <li>
              <span className="font-medium text-foreground">
                A brand cannot buy a higher trust score.
              </span>{" "}
              Payment and subscription tier play no part in how a score is calculated.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Evidence that reflects badly on a product is never removed for payment.
              </span>{" "}
              It isn&apos;t removed at all — a correction is a new record, not an edit.
            </li>
            <li>
              <span className="font-medium text-foreground">
                If a feature would raise revenue but lower trust, it doesn&apos;t get built.
              </span>
            </li>
          </ul>
          <p className="mx-auto mt-6 max-w-xl text-sm text-muted-foreground md:text-base">
            These aren&apos;t a values statement bolted on afterward — they constrain what gets
            written into the product.
          </p>
        </div>
      </section>

      {/* Why beauty, Nigeria, first */}
      <section className="section-y">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Why beauty, why Nigeria, first
          </h2>
          <div className="mt-6 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-start">
            <div className="space-y-4 text-sm text-muted-foreground md:text-base">
              <p>
                We started with beauty in Nigeria because the conditions make the problem sharp and
                solvable at once: counterfeit risk in the category is high, packaging carries
                strong visual identity that&apos;s easy to compare, people buy often rather than
                rarely, buying decisions increasingly happen on social media, and thousands of
                small independent brands are entering the market with no way to prove who they are.
              </p>
              <p>
                Trust already decides most beauty purchases. RigiTrace makes that trust checkable
                instead of assumed.
              </p>
              <p>
                The system underneath isn&apos;t built specifically for beauty or specifically for
                Nigeria. Category and country are both just data — nothing in the identity,
                evidence, or trust model is hardcoded to either, so extending to other product
                categories and other markets doesn&apos;t mean rebuilding the foundations.
              </p>
            </div>
            {/* Decorative — illustrates the section, adds no fact beyond the text */}
            <div className="overflow-hidden rounded-lg border border-border">
              <Image
                src="/images/marketing/about-why-nigeria.webp"
                alt=""
                width={800}
                height={1200}
                sizes="(min-width: 768px) 35vw, 100vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Where it goes from here */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Where it goes from here
          </h2>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground md:text-base">
            <p>
              We&apos;re currently working with a small group of founding brands and retailers by
              hand, before RigiTrace opens up more broadly.
            </p>
            <p>
              After the pilot, the plan is a public beta with more brands and retailers, then a
              wider launch — each stage adding capability once the one before it is solid, not
              before.
            </p>
          </div>
        </div>
      </section>

      <MarketingCTA
        heading="Read the case for your side of it"
        body="For brands and retailers, here's exactly what joining means today."
        primaryHref="/join-pilot"
        primaryLabel="Join the pilot"
        secondaryLinks={[
          { label: "For brands", href: "/for-brands" },
          { label: "For retailers", href: "/for-retailers" },
          { label: "How trust scores work", href: "/trust" },
        ]}
      />
    </>
  );
}
