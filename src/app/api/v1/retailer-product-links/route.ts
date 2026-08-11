import { NextResponse } from "next/server";
import type { RetailerProductLink } from "@/lib/types/entities";
import { addLink } from "@/lib/mock/retailerProductLinkStore";
import { findRetailer } from "@/lib/mock/retailerStore";
import { findProduct } from "@/lib/mock/productStore";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.retailerId || !body.productId) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Retailer and product are required." } },
      { status: 400 }
    );
  }

  const retailer = findRetailer(body.retailerId);
  if (!retailer || retailer.status !== "approved") {
    return NextResponse.json(
      { error: { code: "RETAILER_NOT_APPROVED", message: "Only approved retailers can link products." } },
      { status: 403 }
    );
  }

  const product = findProduct(body.productId);
  if (!product || product.status !== "published") {
    return NextResponse.json(
      { error: { code: "PRODUCT_NOT_AVAILABLE", message: "Product must be published to link a retailer." } },
      { status: 400 }
    );
  }

  const link: RetailerProductLink = {
    id: crypto.randomUUID(),
    retailerId: body.retailerId,
    productId: body.productId,
    status: "verified",
    createdAt: new Date().toISOString(),
  };

  addLink(link);
  return NextResponse.json(link, { status: 201 });
}