import type { Brand, BrandStatus, EventLogEntry, Product, TrustScore } from "@/lib/types/entities";
import { calculateTrustScore } from "@/lib/trust/calculateTrustScore";
import { listProductVersions } from "@/lib/mock/productStore";
import { listEvidence } from "@/lib/mock/evidenceStore";
import { listReports } from "@/lib/mock/reportStore";
import { listEvents } from "@/lib/mock/eventLogStore";

/**
 * Step one of trust score history: reconstruct the engine's four inputs as
 * they stood at a past instant, then run the SAME `calculateTrustScore` —
 * unmodified, signature and body — against them. Trust Engine Separation
 * holds: this file decides what to feed the engine, never how the engine
 * evaluates it.
 *
 * Nothing here is stored. Every call recomputes from the evidence, report,
 * and event records that already exist. There is no cache and no new
 * persistence — see docs/progress-tracker.md Known Issue #1 for why that's
 * deliberate: a stored series would inherit the exact per-serverless-
 * instance amnesia that was just fixed for seed IDs, except silently,
 * because it would *look* authoritative while varying by which instance
 * answered.
 */

const VALID_BRAND_STATUSES: readonly BrandStatus[] = ["draft", "pending", "approved", "suspended", "revoked"];
const REPORT_STATUS_ACTIONS = ["report_under_investigation", "report_resolved", "report_dismissed"] as const;

export interface ReconstructionTrigger {
  type: "evidence_added" | "brand_status_changed" | "report_status_changed" | "product_state_changed";
  detail: string;
}

export type TrustScoreHistoryPoint =
  | {
      asOf: string;
      established: true;
      triggers: ReconstructionTrigger[];
      score: number;
      status: TrustScore["status"];
      explanation: string;
      factors: TrustScore["factors"];
      /** What the reconstruction actually used, so a caller can audit the
       * computation, not just trust the score. */
      reconstruction: {
        evidenceCount: number;
        evidenceSourceCount: number;
        brandStatus: BrandStatus;
        reportCountUnderReview: number;
      };
    }
  | {
      asOf: string;
      established: false;
      /** Deliberately no score/status/explanation/factors fields at all on
       * this branch — an absent field can't be mistaken for a computed
       * one. See the honesty constraints in the task this shipped under. */
      reason: string;
    };

/**
 * Latest brand_<status> event at or before `asOf`, strictly. Only events
 * whose action is exactly `brand_` + a real BrandStatus value count —
 * `brand_registered` does NOT (its suffix isn't a status), so registration
 * alone never implies "pending" or any other status. If no qualifying
 * event exists yet, this returns null and the caller must treat that
 * instant as unestablished, never default to a guessed status.
 */
function brandStatusAt(brandId: string, asOf: Date): BrandStatus | null {
  const events = listEvents("brand", brandId); // eventLogStore sorts newest-first already
  for (const event of events) {
    if (new Date(event.createdAt) > asOf) continue;
    const suffix = event.action.replace(/^brand_/, "");
    if ((VALID_BRAND_STATUSES as readonly string[]).includes(suffix)) {
      return suffix as BrandStatus;
    }
  }
  return null;
}

/**
 * Reports under review at `asOf`. A report with no status-transition event
 * yet at or before `asOf` is NOT a gap — "filed but not yet reviewed" is a
 * real, known state (see reportStore.ts's countReportsUnderReview, which
 * applies the same rule to the present moment), not missing data. It
 * simply doesn't count, honestly, same as it wouldn't count today.
 */
function reportCountUnderReviewAt(productId: string, asOf: Date): number {
  const reports = listReports(productId);
  let count = 0;
  for (const report of reports) {
    const events = listEvents("report", report.id);
    const statusEvent = events.find(
      (e) => new Date(e.createdAt) <= asOf && (REPORT_STATUS_ACTIONS as readonly string[]).includes(e.action)
    );
    if (statusEvent?.action === "report_under_investigation") count += 1;
  }
  return count;
}

/**
 * Product state at `asOf`, via ProductVersion. Each version's `snapshot`
 * is the state BEFORE the edit that produced it, so the version to use is
 * the earliest one created AFTER `asOf`. If none exists — true for every
 * seeded product today, since `versions` is never seeded and nothing in
 * this app has ever called `updateProduct` on them — the current live
 * record is not a guess here, it's a proven fact: zero ProductVersion
 * rows for a product is only possible if it has never been edited, so its
 * current (barcode, images) state is what it has always been since
 * creation. That's a real logical guarantee, not an assumption standing
 * in for missing history.
 */
function productStateAt(product: Product, asOf: Date): Product {
  const versions = [...listProductVersions(product.id)].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const applicable = versions.find((v) => new Date(v.createdAt) > asOf);
  return applicable ? { ...product, ...applicable.snapshot } : product;
}

/** Reconstruct and score a single instant. `product` and `brand` must already be resolved by the caller. */
export function reconstructTrustScoreAt(product: Product, brand: Brand, asOf: Date): TrustScoreHistoryPoint {
  const asOfIso = asOf.toISOString();

  const brandStatus = brandStatusAt(brand.id, asOf);
  if (brandStatus === null) {
    return {
      asOf: asOfIso,
      established: false,
      reason: `No status event exists for ${brand.name} at or before this instant — the earliest establishable brand status is later than this date.`,
    };
  }

  const evidenceAsOf = listEvidence(product.id).filter((e) => new Date(e.createdAt) <= asOf);
  const reportCount = reportCountUnderReviewAt(product.id, asOf);
  const productAsOf = productStateAt(product, asOf);
  const brandAsOf: Brand = { ...brand, status: brandStatus };

  const result = calculateTrustScore(productAsOf, brandAsOf, evidenceAsOf, reportCount);

  return {
    asOf: asOfIso,
    established: true,
    triggers: [], // filled in by the route, which already knows what changed at this instant
    score: result.score,
    status: result.status,
    explanation: result.explanation,
    factors: result.factors,
    reconstruction: {
      evidenceCount: evidenceAsOf.length,
      evidenceSourceCount: new Set(evidenceAsOf.map((e) => e.source)).size,
      brandStatus,
      reportCountUnderReview: reportCount,
    },
  };
}

/**
 * Every instant where at least one of the engine's inputs genuinely
 * changed for this product: an evidence submission, a brand status
 * transition, a report status transition, or a product-version boundary
 * (empty today — see productStateAt). Instants sharing an exact timestamp
 * collapse into one point carrying every trigger that fired then.
 */
export function listHistoryInstants(
  product: Product,
  brand: Brand
): { asOf: Date; triggers: ReconstructionTrigger[] }[] {
  const byInstant = new Map<string, ReconstructionTrigger[]>();

  function record(iso: string, trigger: ReconstructionTrigger) {
    const list = byInstant.get(iso) ?? [];
    list.push(trigger);
    byInstant.set(iso, list);
  }

  for (const evidence of listEvidence(product.id)) {
    record(evidence.createdAt, {
      type: "evidence_added",
      detail: `Evidence added — ${evidence.source}: ${evidence.description}`,
    });
  }

  const brandStatusEvents: EventLogEntry[] = listEvents("brand", brand.id).filter((e) =>
    (VALID_BRAND_STATUSES as readonly string[]).includes(e.action.replace(/^brand_/, ""))
  );
  for (const event of brandStatusEvents) {
    record(event.createdAt, { type: "brand_status_changed", detail: event.description });
  }

  for (const report of listReports(product.id)) {
    const statusEvents = listEvents("report", report.id).filter((e) =>
      (REPORT_STATUS_ACTIONS as readonly string[]).includes(e.action)
    );
    for (const event of statusEvents) {
      record(event.createdAt, { type: "report_status_changed", detail: event.description });
    }
  }

  for (const version of listProductVersions(product.id)) {
    record(version.createdAt, { type: "product_state_changed", detail: version.summary });
  }

  return [...byInstant.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([iso, triggers]) => ({ asOf: new Date(iso), triggers }));
}
