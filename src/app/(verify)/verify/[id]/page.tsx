import { ProductVerificationView } from "@/components/consumer/ProductVerificationView";

export default async function VerifyProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    // Deliberately not `section-y` here — that padding is tuned for
    // marketing sections. This page is reached mid-task (search already
    // happened), and the trust status needs to clear the fold on mobile
    // (docs/ui-context.md, Responsive rules #2), so the top gap is tight.
    <div className="pt-6 pb-16 sm:pt-10 sm:pb-20">
      <div className="mx-auto max-w-2xl px-4">
        <ProductVerificationView productId={id} />
      </div>
    </div>
  );
}
