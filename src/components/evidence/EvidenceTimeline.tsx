import type { Evidence } from "@/lib/types/entities";

const SOURCE_LABELS: Record<Evidence["source"], string> = {
  brand: "Brand",
  manufacturer: "Manufacturer",
  retailer: "Retailer",
  consumer: "Consumer",
  regulator: "Regulator",
};

/**
 * Read-only, on purpose — this component has no edit or delete affordance
 * anywhere in it. Evidence is a history, not a list of editable rows.
 */
export function EvidenceTimeline({ evidence }: { evidence: Evidence[] }) {
  if (evidence.length === 0) {
    return <p className="text-sm text-muted-foreground">No evidence submitted yet.</p>;
  }

  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {evidence.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute -left-[1.6rem] top-1 h-2 w-2 rounded-full bg-primary" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-eyebrow">
              {SOURCE_LABELS[item.source]}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground">{item.description}</p>
          {item.supersedes && (
            <p className="mt-1 text-xs italic text-muted-foreground">
              Correction of an earlier entry — the original remains on record.
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}