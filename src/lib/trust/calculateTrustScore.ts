import type { Brand, Evidence, Product, TrustFactor, TrustScore, TrustStatus } from "@/lib/types/entities";

/**
 * Pure calculation — no fetching, no side effects, no storage access.
 * Per the PRD's Trust Engine Separation rule: evidence PROVIDES
 * information, this function EVALUATES it. Given the same inputs, it
 * always produces the same output — which is what makes a trust score
 * "always recalculatable from evidence," as the PRD requires.
 *
 * `reportCount` defaults to 0 for callers with no report data. Both live
 * call sites now pass `countReportsUnderReview()` (see `reportStore.ts`),
 * which only counts reports a person has moved to "under_investigation" —
 * a freshly submitted, unreviewed report must never lower a score, since
 * reporting requires no account and would otherwise be a free way to tank
 * a competitor. In practice this is still always 0 today: nothing can move
 * a report to "under_investigation" until Case Management (PRD Stage 6,
 * blocked on auth) ships a resolution endpoint.
 */
export function calculateTrustScore(
  product: Product,
  brand: Brand,
  evidence: Evidence[],
  reportCount = 0
): Omit<TrustScore, "id" | "productId" | "calculatedAt"> {
  const factors: TrustFactor[] = [];

  // No evidence at all is its own status, not just a low score.
  if (evidence.length === 0) {
    factors.push({
      label: "No evidence submitted",
      impact: "neutral",
      weight: 0,
      detail:
        "This product has not yet received any evidence from a brand, manufacturer, retailer, consumer, or regulator.",
    });
    return {
      score: 0,
      status: "unverified",
      explanation: "This product has not been verified yet — no evidence has been submitted.",
      factors,
    };
  }

  let score = 0;

  // Brand verification — up to 40 points
  if (brand.status === "approved") {
    score += 40;
    factors.push({
      label: "Brand verification",
      impact: "positive",
      weight: 40,
      detail: `${brand.name} is an approved, verified brand on RigiTrace.`,
    });
  } else {
    factors.push({
      label: "Brand verification",
      impact: "negative",
      weight: 0,
      detail: `${brand.name} is not currently an approved brand.`,
    });
  }

  // Product completeness — up to 20 points
  let completeness = 0;
  if (product.barcode) completeness += 10;
  if (product.images.length > 0) completeness += 10;
  score += completeness;
  factors.push({
    label: "Product completeness",
    impact: completeness >= 15 ? "positive" : completeness > 0 ? "neutral" : "negative",
    weight: completeness,
    detail:
      completeness === 20
        ? "Barcode and product images are both present."
        : completeness === 0
          ? "Missing barcode and product images."
          : "Missing either a barcode or product images.",
  });

  // Evidence volume + source diversity — up to 30 points
  const evidencePoints = Math.min(evidence.length * 8, 24);
  const uniqueSources = new Set(evidence.map((e) => e.source)).size;
  const diversityBonus = Math.min(uniqueSources * 2, 6);
  const totalEvidencePoints = evidencePoints + diversityBonus;
  score += totalEvidencePoints;
  factors.push({
    label: "Evidence on record",
    impact: "positive",
    weight: totalEvidencePoints,
    detail: `${evidence.length} piece(s) of evidence from ${uniqueSources} distinct source(s).`,
  });

  // Suspicious reports — penalty, currently always 0 since Case Management
  // (Stage 6) doesn't exist yet.
  const reportsPenalty = Math.min(reportCount * 15, 50);
  if (reportCount > 0) {
    score -= reportsPenalty;
    factors.push({
      label: "Suspicious product reports",
      impact: "negative",
      weight: -reportsPenalty,
      detail: `${reportCount} unresolved report(s) filed against this product.`,
    });
  }

  score = Math.max(0, Math.min(100, score));

  let status: TrustStatus;
  if (score >= 70) status = "high";
  else if (score >= 40) status = "medium";
  else status = "low";

  const explanation =
    status === "high"
      ? `Verified brand with ${evidence.length} piece(s) of supporting evidence and no unresolved reports.`
      : status === "medium"
        ? "Some verification signals present, but evidence or product information is incomplete."
        : "Limited verification signals — missing evidence, incomplete product information, or unresolved reports.";

  return { score, status, explanation, factors };
}