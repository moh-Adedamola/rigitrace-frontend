import { ProductVerificationView } from "@/components/consumer/ProductVerificationView";

export default async function VerifyProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="section-y">
      <div className="mx-auto max-w-2xl px-4">
        <ProductVerificationView productId={id} />
      </div>
    </div>
  );
}
