import { BrandApprovalQueue } from "@/components/admin/BrandApprovalQueue";
import { RetailerApprovalQueue } from "@/components/admin/RetailerApprovalQueue";
import { EventTimeline } from "@/components/events/EventTimeline";

export default function AdminDashboardPage() {
  return (
    <main className="section-y">
      <div className="mx-auto max-w-3xl space-y-12 px-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-eyebrow">
            Admin Console
          </p>
          <h1 className="mb-1 text-2xl font-semibold text-foreground">Approvals</h1>
          <p className="text-sm text-muted-foreground">
            Review brands and retailers awaiting approval.
          </p>
        </div>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-eyebrow">
            Brand approvals
          </h2>
          <BrandApprovalQueue />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-eyebrow">
            Retailer approvals
          </h2>
          <RetailerApprovalQueue />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-eyebrow">
            Recent activity
          </h2>
          <EventTimeline limit={20} />
        </section>
      </div>
    </main>
  );
}