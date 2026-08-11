import { NextResponse } from "next/server";
import { findProduct } from "@/lib/mock/productStore";
import { findBrand } from "@/lib/mock/brandStore";
import { listEvidence } from "@/lib/mock/evidenceStore";
import { countReportsUnderReview } from "@/lib/mock/reportStore";
import { calculateTrustScore } from "@/lib/trust/calculateTrustScore";
import { addTrustScore, getLatestTrustScore } from "@/lib/mock/trustStore";
import type { TrustScore } from "@/lib/types/entities";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const existing = getLatestTrustScore(id);
  if (existing) {
    return NextResponse.json(existing);
  }

  // Lazily calculate on first request if nothing's been computed yet.
  const product = findProduct(id);
  if (!product) {
    return NextResponse.json(
      { error: { code: "PRODUCT_NOT_FOUND", message: "Product not found." } },
      { status: 404 }
    );
  }
  const brand = findBrand(product.brandId);
  if (!brand) {
    return NextResponse.json(
      { error: { code: "BRAND_NOT_FOUND", message: "Brand not found." } },
      { status: 404 }
    );
  }

  const evidence = listEvidence(id);
  const reportCount = countReportsUnderReview(id);
  const result = calculateTrustScore(product, brand, evidence, reportCount);

  const trustScore: TrustScore = {
    id: crypto.randomUUID(),
    productId: id,
    calculatedAt: new Date().toISOString(),
    ...result,
  };
  addTrustScore(trustScore);

  return NextResponse.json(trustScore);
}