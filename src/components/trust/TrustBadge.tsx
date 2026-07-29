import type { TrustScore } from "@/lib/types/entities";

const STATUS_STYLES: Record<TrustScore["status"], { bg: string; text: string; label: string }> = {
  high: { bg: "bg-trust-high/10", text: "text-trust-high", label: "Verified" },
  medium: { bg: "bg-trust-medium/10", text: "text-trust-medium", label: "Partially verified" },
  low: { bg: "bg-trust-low/10", text: "text-trust-low", label: "Low confidence" },
  unverified: { bg: "bg-trust-unverified/10", text: "text-trust-unverified", label: "Not yet verified" },
};

/**
 * Deliberately does NOT accept a "compact" prop that hides the explanation.
 * Per the PRD: never show "Verified" alone — always "Verified because...".
 * If you need a smaller footprint, use <TrustBadgeSummary> instead, which
 * still requires a one-line reason.
 */
export function TrustBadge({ trustScore }: { trustScore: TrustScore }) {
  const style = STATUS_STYLES[trustScore.status];
  const topFactor = trustScore.factors[0];

  return (
    <div className={`rounded-lg border border-border p-4 ${style.bg}`}>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${style.text}`}>{style.label}</span>
        <span className="text-xs text-muted-foreground">Score {trustScore.score}/100</span>
      </div>
      <p className="mt-1 text-sm text-foreground/80">{trustScore.explanation}</p>
      {topFactor && (
        <p className="mt-2 text-xs text-muted-foreground">
          Main factor: {topFactor.label}
          {topFactor.detail ? ` — ${topFactor.detail}` : ""}
        </p>
      )}
    </div>
  );
}

/** Compact variant — still carries a mandatory one-line reason. */
export function TrustBadgeSummary({ trustScore }: { trustScore: TrustScore }) {
  const style = STATUS_STYLES[trustScore.status];
  return (
    <span className={`inline-flex flex-col ${style.text}`}>
      <span className="text-sm font-semibold">{style.label}</span>
      <span className="text-xs text-muted-foreground">{trustScore.explanation}</span>
    </span>
  );
}