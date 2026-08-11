import Link from "next/link";

export interface BusinessCasePageContent {
  eyebrow: string;
  heading: string;
  intro: string;
  solutionHeading: string;
  solutionBody: string;
  whatYouGet: { title: string; body: string }[];
  howItWorks: { title: string; body: string }[];
  faq: { question: string; answer: string }[];
  ctaHref: string;
  ctaLabel: string;
  ctaSupportingText: string;
}

const CTA_CLASSES =
  "inline-flex h-11 items-center justify-center rounded px-6 text-sm font-medium text-primary-foreground bg-primary transition-colors hover:bg-primary/90";

export function BusinessCasePage({ content }: { content: BusinessCasePageContent }) {
  return (
    <>
      {/* Problem */}
      <section className="section-y">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-eyebrow">
            {content.eyebrow}
          </p>
          <h1 className="mx-auto mt-2 font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            {content.heading}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            {content.intro}
          </p>
        </div>
      </section>

      {/* Solution */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            {content.solutionHeading}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            {content.solutionBody}
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-serif text-2xl font-semibold text-foreground md:text-3xl">
            What you get
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {content.whatYouGet.map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-serif text-2xl font-semibold text-foreground md:text-3xl">
            How it works
          </h2>
          <ol className="mx-auto mt-10 max-w-2xl space-y-6">
            {content.howItWorks.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing — shared copy: no number, pilot is free, set with founding partners after */}
      <section id="pricing" className="section-y">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-eyebrow">Pricing</p>
          <h2 className="mx-auto mt-2 font-serif text-2xl font-semibold text-foreground md:text-3xl">
            No price tag yet — and that&apos;s deliberate.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            Pilot partners join free. Once the pilot wraps, we&apos;ll set pricing with
            input from the founding partners who used it first — not a number decided
            before anyone had.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y bg-section-raised">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-center font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Questions
          </h2>
          <div className="mt-8 space-y-2">
            {content.faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-lg border border-border bg-card p-4"
              >
                <summary className="cursor-pointer list-none text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-y">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
            Ready to be one of the first?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            {content.ctaSupportingText}
          </p>
          <Link href={content.ctaHref} className={`mt-6 ${CTA_CLASSES}`}>
            {content.ctaLabel}
          </Link>
        </div>
      </section>
    </>
  );
}
