import type { TrustScore } from "@/lib/types/entities";
import type { TrustScoreHistoryPoint } from "@/lib/trust/reconstructTrustScoreAt";
import { STATUS_STYLES } from "@/components/trust/TrustBadge";

// Tailwind's scanner needs literal class strings, not `` `stroke-trust-${status}` ``
// template interpolation — it can't see inside a runtime-built string, so those
// classes would silently never make it into the generated CSS. Lookup maps keep
// every class name fully static in the source.
const TRUST_STROKE: Record<TrustScore["status"], string> = {
  high: "stroke-trust-high",
  medium: "stroke-trust-medium",
  low: "stroke-trust-low",
  unverified: "stroke-trust-unverified",
};
const TRUST_FILL: Record<TrustScore["status"], string> = {
  high: "fill-trust-high",
  medium: "fill-trust-medium",
  low: "fill-trust-low",
  unverified: "fill-trust-unverified",
};
const TRUST_DOT_BG: Record<TrustScore["status"], string> = {
  high: "bg-trust-high",
  medium: "bg-trust-medium",
  low: "bg-trust-low",
  unverified: "bg-trust-unverified",
};

/**
 * A score is constant until an input changes, then it jumps — it does not
 * glide. A smoothed or interpolated line between two points would claim
 * the score moved gradually in between, which never happened: the same
 * dishonesty the reconstruction helper refuses to commit with dates, drawn
 * instead of dated. So this renders a STEP chart (SVG, no library) — flat
 * while a state holds, vertical exactly at the instant it changed — never
 * a diagonal.
 *
 * Chart points are spaced evenly by index, not by elapsed time. A rich
 * product's evidence can arrive across three weeks and then say nothing
 * for three months before a status change; spacing by real time would
 * compress the interesting part into a sliver and stretch the silence
 * across most of the width. Every transition gets equal room to be seen.
 * Nothing is lost — the real dates are printed in the list below, which is
 * also the only place a screen reader gets this content; the chart itself
 * is `aria-hidden`, decorative alongside the text it duplicates visually.
 *
 * `established: false` points are never plotted and never given a score,
 * a zero, or a point on the line — see the type in reconstructTrustScoreAt
 * for why that branch has no score field to begin with.
 */

type EstablishedPoint = Extract<TrustScoreHistoryPoint, { established: true }>;

const CHART_WIDTH = 340;
const CHART_HEIGHT = 150;
const PLOT_LEFT = 34;
const PLOT_RIGHT = 330;
const PLOT_TOP = 14;
const PLOT_BOTTOM = 116;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function scoreToY(score: number): number {
  return PLOT_BOTTOM - (score / 100) * (PLOT_BOTTOM - PLOT_TOP);
}

function indexToX(index: number, count: number): number {
  if (count <= 1) return PLOT_LEFT;
  return PLOT_LEFT + (index / (count - 1)) * (PLOT_RIGHT - PLOT_LEFT);
}

function StepChart({ points }: { points: EstablishedPoint[] }) {
  const n = points.length;

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className="h-auto w-full"
      role="img"
      aria-hidden="true"
    >
      {/* Zero baseline — the only reference line; deliberately no 40/70 tier
          markers, which would start explaining the engine's thresholds
          rather than just showing what happened. */}
      <line
        x1={PLOT_LEFT}
        y1={PLOT_BOTTOM}
        x2={PLOT_RIGHT}
        y2={PLOT_BOTTOM}
        className="stroke-border"
        strokeWidth="1"
      />
      <text x={0} y={PLOT_TOP + 4} className="fill-muted-foreground font-mono text-[9px]">
        100
      </text>
      <text x={0} y={PLOT_BOTTOM + 3} className="fill-muted-foreground font-mono text-[9px]">
        0
      </text>

      {/* Vertical jumps — the instant something changed. Neutral colour:
          the jump itself isn't a state, so it doesn't get a status colour. */}
      {points.slice(0, -1).map((point, i) => {
        const next = points[i + 1];
        const x = indexToX(i + 1, n);
        return (
          <line
            key={`jump-${point.asOf}`}
            x1={x}
            y1={scoreToY(point.score)}
            x2={x}
            y2={scoreToY(next.score)}
            className="stroke-muted-foreground/50"
            strokeWidth="2"
          />
        );
      })}

      {/* Horizontal holds — one per point, coloured by that point's own
          status, so the shape of the chart alone shows which stretches
          were high/medium/low/unverified without reading the list below. */}
      {points.map((point, i) => {
        const x1 = indexToX(i, n);
        const x2 = i === n - 1 ? PLOT_RIGHT : indexToX(i + 1, n);
        return (
          <line
            key={`hold-${point.asOf}`}
            x1={x1}
            y1={scoreToY(point.score)}
            x2={x2}
            y2={scoreToY(point.score)}
            className={TRUST_STROKE[point.status]}
            strokeWidth="2.5"
          />
        );
      })}

      {points.map((point, i) => (
        <circle
          key={`dot-${point.asOf}`}
          cx={indexToX(i, n)}
          cy={scoreToY(point.score)}
          r="3.5"
          className={`${TRUST_FILL[point.status]} stroke-card`}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

function PointRow({ point }: { point: TrustScoreHistoryPoint }) {
  if (!point.established) {
    return (
      <li className="border-l-2 border-border pl-3 text-sm text-muted-foreground">
        <p className="text-xs font-semibold uppercase tracking-wide">Not established</p>
        <p className="mt-1">{point.reason}</p>
      </li>
    );
  }

  const style = STATUS_STYLES[point.status];

  return (
    <li className="border-l-2 border-border pl-3">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-xs text-muted-foreground">{formatDate(point.asOf)}</span>
        <span className="font-mono text-sm font-semibold text-foreground">{point.score}/100</span>
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${style.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${TRUST_DOT_BG[point.status]}`} aria-hidden="true" />
          {style.label}
        </span>
      </div>
      {point.triggers.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {point.triggers.map((trigger, i) => (
            <li key={i} className="text-sm text-foreground/90">
              {trigger.detail}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-1 text-sm text-muted-foreground">{point.explanation}</p>
      <details className="group mt-1.5">
        <summary className="cursor-pointer list-none text-xs font-medium text-eyebrow underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Full factor breakdown
        </summary>
        <ul className="mt-2 space-y-2">
          {point.factors.map((factor, i) => (
            <li key={i} className="flex items-start gap-2 text-xs">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" aria-hidden="true" />
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{factor.label}</span>
                {factor.detail ? ` — ${factor.detail}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </details>
    </li>
  );
}

export function TrustScoreHistory({ points }: { points: TrustScoreHistoryPoint[] }) {
  const established = points.filter((p): p is EstablishedPoint => p.established);

  if (points.length === 0) {
    return <p className="text-sm text-muted-foreground">No trust history is available for this product.</p>;
  }

  if (points.length === 1) {
    const [point] = points;
    if (!point.established) {
      return <p className="text-sm text-muted-foreground">{point.reason}</p>;
    }
    return (
      <p className="text-sm text-muted-foreground">
        <span className="font-mono text-foreground">{point.score}/100</span> as of{" "}
        {formatDate(point.asOf)}. No change recorded since.
      </p>
    );
  }

  return (
    <div>
      {established.length >= 3 && (
        <div className="mb-4">
          <StepChart points={established} />
        </div>
      )}
      <ol className="space-y-4">
        {points.map((point) => (
          <PointRow key={point.asOf} point={point} />
        ))}
      </ol>
    </div>
  );
}
