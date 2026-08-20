import { NextResponse } from "next/server";
import { findProduct } from "@/lib/mock/productStore";
import { findBrand } from "@/lib/mock/brandStore";
import { listHistoryInstants, reconstructTrustScoreAt } from "@/lib/trust/reconstructTrustScoreAt";

/**
 * Recomputed on every request, nothing stored — see
 * reconstructTrustScoreAt.ts for why. Two modes:
 *
 *   GET .../trust-score/history            → the full series: one point
 *     per instant where an engine input genuinely changed (each evidence
 *     submission, each brand/report status transition).
 *   GET .../trust-score/history?asOf=<ISO> → a single reconstructed point
 *     at an arbitrary instant, established or not. Exists so a specific
 *     date can be probed directly — including dates before this product's
 *     event-log coverage begins, to see the honest-gap response shape —
 *     without needing a second endpoint for the same computation.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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

  const { searchParams } = new URL(request.url);
  const asOfParam = searchParams.get("asOf");

  if (asOfParam) {
    const asOf = new Date(asOfParam);
    if (Number.isNaN(asOf.getTime())) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "asOf must be a valid ISO date string." } },
        { status: 400 }
      );
    }
    const point = reconstructTrustScoreAt(product, brand, asOf);
    return NextResponse.json({ productId: id, points: [point] });
  }

  const instants = listHistoryInstants(product, brand);
  const points = instants.map(({ asOf, triggers }) => {
    const point = reconstructTrustScoreAt(product, brand, asOf);
    return point.established ? { ...point, triggers } : point;
  });

  return NextResponse.json({ productId: id, points });
}
