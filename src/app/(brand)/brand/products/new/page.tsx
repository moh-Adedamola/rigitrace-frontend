import { ProductCreationForm } from "@/components/forms/ProductCreationForm";

export default function NewProductPage() {
  return (
    <main className="section-y">
      <div className="mx-auto max-w-2xl px-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-eyebrow">
          Brand Portal
        </p>
        <h1 className="mb-1 text-2xl font-semibold text-foreground">Create a product</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Only approved brands can create products. Once created, publish it to make it
          visible for verification.
        </p>
        <ProductCreationForm />
      </div>
    </main>
  );
}