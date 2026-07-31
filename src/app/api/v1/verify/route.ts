import { NextResponse } from "next/server";
import { listProducts } from "@/lib/mock/productStore";

/**
 * Public, unauthenticated lookup. Only PUBLISHED products are searchable
 * here — draft/pending products aren't public information yet.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const barcode = searchParams.get("barcode");
  const query = searchParams.get("query");

  const published = listProducts().filter((p) => p.status === "published");

  if (barcode) {
    const match = published.find((p) => p.barcode === barcode);
    const results = match ? [match] : [];
    return NextResponse.json({ data: results, page: 1, limit: results.length, total: results.length });
  }

  if (query) {
    const q = query.toLowerCase();
    const results = published.filter(
      (p) => p.name.toLowerCase().includes(q) || p.barcode?.toLowerCase().includes(q)
    );
    return NextResponse.json({ data: results, page: 1, limit: results.length, total: results.length });
  }

  return NextResponse.json(
    { error: { code: "VALIDATION_ERROR", message: "Provide a barcode or query parameter." } },
    { status: 400 }
  );
}