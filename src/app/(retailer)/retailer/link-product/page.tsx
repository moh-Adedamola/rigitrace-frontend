import { RetailerProductLinkForm } from "@/components/forms/RetailerProductLinkForm";

export default function LinkProductPage() {
  return (
    <main className="section-y">
      <div className="mx-auto max-w-2xl px-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-eyebrow">
          Retailer Portal
        </p>
        <h1 className="mb-1 text-2xl font-semibold text-foreground">Link a product you sell</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Only approved retailers can link products. Linked products will show your store in
          their &quot;Available at&quot; list.
        </p>
        <RetailerProductLinkForm />
      </div>
    </main>
  );
}