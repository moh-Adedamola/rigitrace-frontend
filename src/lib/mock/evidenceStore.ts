import type { Evidence } from "@/lib/types/entities";
import { SEED_ENABLED, SEED_EVIDENCE } from "@/lib/mock/seedData";

/**
 * Append-only, on purpose — there is no updateEvidence or deleteEvidence
 * function anywhere in this file. Corrections must be submitted as new
 * evidence with `supersedes` pointing at the old record, per the PRD:
 * evidence is never edited or deleted.
 *
 * Seeded with demo data at module init — see seedData.ts.
 */
const evidenceRecords: Evidence[] = SEED_ENABLED ? [...SEED_EVIDENCE] : [];

export function listEvidence(productId: string): Evidence[] {
  return evidenceRecords
    .filter((e) => e.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addEvidence(evidence: Evidence): Evidence {
  evidenceRecords.push(evidence);
  return evidence;
}