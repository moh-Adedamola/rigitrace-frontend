import { RetailerRegistrationForm } from "@/components/forms/RetailerRegistrationForm";

export default function RetailerRegisterPage() {
  return (
    <main className="section-y">
      <div className="mx-auto max-w-2xl px-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-eyebrow">
          Retailer Portal
        </p>
        <h1 className="mb-1 text-2xl font-semibold text-foreground">Register your store</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Submit your store for review. Once approved, you can link the products you sell.
        </p>
        <RetailerRegistrationForm />
      </div>
    </main>
  );
}