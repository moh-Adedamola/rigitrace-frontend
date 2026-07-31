import type { TrustScore } from "@/lib/types/entities";

const scores: TrustScore[] = [];

export function addTrustScore(score: TrustScore): TrustScore {
  scores.push(score);
  return score;
}

export function getLatestTrustScore(productId: string): TrustScore | undefined {
  return getTrustScoreHistory(productId)[0];
}

export function getTrustScoreHistory(productId: string): TrustScore[] {
  return scores
    .filter((s) => s.productId === productId)
    .sort((a, b) => new Date(b.calculatedAt).getTime() - new Date(a.calculatedAt).getTime());
}