/**
 * Shared page-top hero: eyebrow, h1, intro paragraph, centered. Matches
 * /trust's hero and BusinessCasePage's "Problem" section byte-for-byte —
 * extracted here so /how-it-works and /about don't each duplicate it a
 * third and fourth time. One h1 per page — this renders it, so a page
 * using this component should have no other <h1>.
 */
export function MarketingHero({
  eyebrow,
  heading,
  intro,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
}) {
  return (
    <section className="section-y">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-eyebrow">{eyebrow}</p>
        <h1 className="mx-auto mt-2 font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl">
          {heading}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">{intro}</p>
      </div>
    </section>
  );
}
