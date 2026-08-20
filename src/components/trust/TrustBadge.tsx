import type { TrustScore } from "@/lib/types/entities";

/** Exported so TrustScoreHistory can use the exact same colour/label
 * mapping — one source of truth for "what does each status tier look
 * like," not a second copy that could drift. */
export const STATUS_STYLES: Record<TrustScore["status"], { bg: string; text: string; label: string }> = {
  high: { bg: "bg-trust-high/10", text: "text-trust-high", label: "Verified" },
  medium: { bg: "bg-trust-medium/10", text: "text-trust-medium", label: "Partially verified" },
  low: { bg: "bg-trust-low/10", text: "text-trust-low", label: "Low confidence" },
  unverified: { bg: "bg-trust-unverified/10", text: "text-trust-unverified", label: "Not yet verified" },
};

interface TrustBadgeProps {
  trustScore: TrustScore;
  /**
   * "large" is the /verify/[id] hero treatment — bigger type, and every
   * factor instead of just the top one. Omit this prop (or pass
   * "default") and the output is byte-for-byte what it always was, so
   * every other call site (home, /trust, /verify search, the brand
   * portal) is untouched by this.
   */
  size?: "default" | "large";
}

/**
 * Deliberately does NOT accept a "compact" prop that hides the explanation.
 * Per the PRD: never show "Verified" alone — always "Verified because...".
 * If you need a smaller footprint, use <TrustBadgeSummary> instead, which
 * still requires a one-line reason.
 */
export function TrustBadge({ trustScore, size = "default" }: TrustBadgeProps) {
  const style = STATUS_STYLES[trustScore.status];

  if (size === "large") {
    return (
      <div className={`rounded-lg border border-border p-6 sm:p-8 ${style.bg}`}>
        <div className="flex flex-wrap items-end gap-x-2">
          <span className={`font-mono text-4xl font-semibold leading-none sm:text-5xl ${style.text}`}>
            {trustScore.score}
          </span>
          <span className="font-mono text-base text-muted-foreground">/100</span>
        </div>
        <p className={`mt-2 text-lg font-semibold sm:text-xl ${style.text}`}>{style.label}</p>
        <p className="mt-3 max-w-xl text-sm text-foreground/90 sm:text-base">{trustScore.explanation}</p>
        {trustScore.factors.length > 0 && (
          <ul className="mt-6 space-y-3 border-t border-border/70 pt-6">
            {trustScore.factors.map((factor, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50"
                  aria-hidden="true"
                />
                <p className="text-foreground/90">
                  <span className="font-medium text-foreground">{factor.label}</span>
                  {factor.detail ? <span className="text-muted-foreground"> — {factor.detail}</span> : null}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

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