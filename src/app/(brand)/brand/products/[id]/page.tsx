import { ProductDetailClient } from "@/components/products/ProductDetailClient";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="section-y">
      <div className="mx-auto max-w-2xl px-4">
        <p className="mb-6 text-xs font-semibold uppercase tracking-wide text-eyebrow">
          Brand Portal
        </p>
        <ProductDetailClient productId={id} />
      </div>
    </main>
  );
}