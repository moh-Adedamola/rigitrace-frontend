import { BrandApprovalQueue } from "@/components/admin/BrandApprovalQueue";

export default function AdminDashboardPage() {
  return (
    <main className="section-y">
      <div className="mx-auto max-w-3xl px-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-eyebrow">
          Admin Console
        </p>
        <h1 className="mb-1 text-2xl font-semibold text-foreground">Brand approvals</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Review brands awaiting approval before they can publish products.
        </p>
        <BrandApprovalQueue />
      </div>
    </main>
  );
}