import type { Evidence } from "@/lib/types/entities";

/**
 * Append-only, on purpose — there is no updateEvidence or deleteEvidence
 * function anywhere in this file. Corrections must be submitted as new
 * evidence with `supersedes` pointing at the old record, per the PRD:
 * evidence is never edited or deleted.
 */
const evidenceRecords: Evidence[] = [];

export function listEvidence(productId: string): Evidence[] {
  return evidenceRecords
    .filter((e) => e.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addEvidence(evidence: Evidence): Evidence {
  evidenceRecords.push(evidence);
  return evidence;
}