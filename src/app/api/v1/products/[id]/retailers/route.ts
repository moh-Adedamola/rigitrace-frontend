import { NextResponse } from "next/server";
import { listLinksByProduct } from "@/lib/mock/retailerProductLinkStore";
import { findRetailer } from "@/lib/mock/retailerStore";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const links = listLinksByProduct(id, "verified");
  const retailers = links
    .map((link) => findRetailer(link.retailerId))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return NextResponse.json({ data: retailers, page: 1, limit: retailers.length, total: retailers.length });
}