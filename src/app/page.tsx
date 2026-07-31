import { ProductSearch } from "@/components/consumer/ProductSearch";

export default function ConsumerHomePage() {
  return (
    <main className="section-y">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-eyebrow">
          RigiTrace
        </p>
        <h1 className="mb-3 text-3xl font-semibold text-foreground">
          Verify a product in seconds
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Search by product name or barcode — no account needed.
        </p>
        <ProductSearch />
      </div>
    </main>
  );
}