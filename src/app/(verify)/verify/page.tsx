import Image from "next/image";
import Link from "next/link";
import { ProductSearch } from "@/components/consumer/ProductSearch";
import { TrustBadge } from "@/components/trust/TrustBadge";
import {
  HOW_IT_WORKS_STEPS,
  SAMPLE_TRUST_SCORE,
  TRANSPARENCY_RULES,
} from "@/components/marketing/sharedContent";

export default function VerifySearchPage() {
  return (
    <>
      {/* Hero — untouched: speed-first, nothing added above or beside the search itself */}
      <div className="section-y">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h1 className="mb-3 text-3xl font-semibold text-foreground">
            Verify a product in seconds
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Search by product name or barcode — no account needed.
          </p>
          <ProductSearch />
        </div>
      </div>

      {/* Four steps — same copy as the homepage, reused rather than restated */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-eyebrow">
            How it works
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Four steps, no account needed.
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-start">
            <ol className="space-y-5">
              {HOW_IT_WORKS_STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-eyebrow">
                      Step {index + 1}
                    </p>
                    <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            {/* Decorative — the list already states each step; nothing here is informational */}
            <div className="overflow-hidden rounded-lg border border-border">
              <Image
                src="/images/marketing/verify-steps-lineup.webp"
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

      {/* What a trust score means — same copy and sample data as the homepage */}
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
                src="/images/marketing/verify-trust-bottle.webp"
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

      {/* Trust and transparency — text only, same copy as the homepage */}
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
