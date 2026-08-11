import { ProductSearch } from "@/components/consumer/ProductSearch";

// Placeholder home for block 1 — hero only. Remaining sections (how it
// works, trust explainer, why it matters, business block, transparency
// rules) land in block 2 per docs/ui-context.md Part 1.
export default function MarketingHomePage() {
  return (
    <section className="section-y">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h1 className="mx-auto max-w-3xl font-serif text-3xl font-semibold leading-tight text-foreground md:text-5xl">
          Know what you&apos;re buying.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
          Search any beauty product to see who made it, what proof exists, and how much
          confidence that evidence supports. Free, and no account needed.
        </p>
        <div className="mt-8">
          <ProductSearch />
        </div>
      </div>
    </section>
  );
}
