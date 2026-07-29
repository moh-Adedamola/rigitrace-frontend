import { BrandRegistrationForm } from "@/components/forms/BrandRegistrationForm";

export default function BrandRegisterPage() {
  return (
    <main className="section-y">
      <div className="mx-auto max-w-2xl px-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-eyebrow">
          Brand Portal
        </p>
        <h1 className="mb-1 text-2xl font-semibold text-foreground">Register your brand</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Submit your brand for review. Once approved, you can start creating verified
          product identities.
        </p>
        <BrandRegistrationForm />
      </div>
    </main>
  );
}