type Status = "draft" | "pending" | "approved" | "published" | "under_review" | "suspended" | "revoked" | "archived" | "rejected";

const STYLES: Record<Status, string> = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-accent text-accent-foreground",
  approved: "bg-success/10 text-success",
  published: "bg-success/10 text-success",
  under_review: "bg-accent text-accent-foreground",
  suspended: "bg-destructive/10 text-destructive",
  revoked: "bg-destructive/10 text-destructive",
  rejected: "bg-destructive/10 text-destructive",
  archived: "bg-muted text-muted-foreground",
};

const LABELS: Record<Status, string> = {
  draft: "Draft",
  pending: "Pending review",
  approved: "Approved",
  published: "Published",
  under_review: "Under review",
  suspended: "Suspended",
  revoked: "Revoked",
  rejected: "Rejected",
  archived: "Archived",
};

export function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm border border-current/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}