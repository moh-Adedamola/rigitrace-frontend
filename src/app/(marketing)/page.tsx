import Image from "next/image";
import Link from "next/link";
import { ProductSearch } from "@/components/consumer/ProductSearch";
import { TrustBadge } from "@/components/trust/TrustBadge";
import {
  HOW_IT_WORKS_STEPS,
  SAMPLE_TRUST_SCORE,
  TRANSPARENCY_RULES,
} from "@/components/marketing/sharedContent";

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
          <div className="mt-8 flex flex-col items-center gap-6 text-left md:flex-row md:items-start md:justify-center">
            <div>
              <TrustBadge trustScore={SAMPLE_TRUST_SCORE} />
              <p className="mt-2 text-xs text-muted-foreground">
                Example only — not a real product on RigiTrace.
              </p>
            </div>
            {/* Decorative — small supporting element, not a second source of information */}
            <div className="w-32 shrink-0 overflow-hidden rounded-lg border border-border sm:w-40">
              <Image
                src="/images/marketing/home-trust-drop.webp"
                alt=""
                width={800}
                height={1200}
                sizes="160px"
                className="h-auto w-full"
              />
            </div>
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
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-eyebrow">
              Why it matters
            </p>
            <h2 className="mx-auto mt-2 max-w-xl font-serif text-2xl font-semibold text-foreground md:text-3xl">
              Right now, checking a product means guessing.
            </h2>
          </div>
          <div className="mt-8 grid items-center gap-8 md:grid-cols-2">
            <p className="text-sm text-muted-foreground md:text-base">
              Counterfeit and mislabelled beauty products circulate in open markets and
              online, and a shopper standing in front of a shelf has no simple way to
              tell what&apos;s genuine before they pay. Brands lose sales and reputation
              to products they didn&apos;t make. RigiTrace gives everyone in that chain —
              brand, retailer, and buyer — the same record to check against.
            </p>
            {/* Decorative — the paragraph carries the point; a screen reader gains nothing from this image */}
            <div className="overflow-hidden rounded-lg border border-border">
              <Image
                src="/images/marketing/home-why-it-matters.webp"
                alt=""
                width={801}
                height={1200}
                sizes="(min-width: 768px) 45vw, 100vw"
                className="h-auto w-full"
              />
            </div>
          </div>
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

      {/* Banner — visual pause between the business cards and the closing rules */}
      <section className="pb-6 md:pb-8">
        <div className="mx-auto max-w-6xl px-4">
          {/* Decorative — a considered visual break, no information of its own */}
          <div className="overflow-hidden rounded-lg border border-border">
            <Image
              src="/images/marketing/home-banner-bottles.webp"
              alt=""
              width={1200}
              height={800}
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="h-auto w-full"
            />
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
