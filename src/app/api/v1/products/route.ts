import { NextResponse } from "next/server";
import type { EventLogEntry, Product } from "@/lib/types/entities";
import { addProduct, listProducts } from "@/lib/mock/productStore";
import { findBrand } from "@/lib/mock/brandStore";
import { addEvent } from "@/lib/mock/eventLogStore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brandId") ?? undefined;
  const results = listProducts(brandId);
  return NextResponse.json({ data: results, page: 1, limit: results.length, total: results.length });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.brandId || !body.name || !body.category) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Missing required fields." } },
      { status: 400 }
    );
  }

  const brand = findBrand(body.brandId);
  if (!brand || brand.status !== "approved") {
    return NextResponse.json(
      { error: { code: "BRAND_NOT_APPROVED", message: "Only approved brands can create products." } },
      { status: 403 }
    );
  }

  const product: Product = {
    id: crypto.randomUUID(),
    brandId: body.brandId,
    name: body.name,
    category: body.category,
    barcode: body.barcode || undefined,
    images: body.images ?? [],
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  addProduct(product);

  const event: EventLogEntry = {
    id: crypto.randomUUID(),
    entityType: "product",
    entityId: product.id,
    action: "product_created",
    // No actorId sent yet — the approved brand that just passed the check
    // above is who acted, even without a session to name a specific user.
    actorId: body.actorId ?? body.brandId,
    actorRole: "brand",
    description: `${product.name} created by ${brand.name}.`,
    createdAt: new Date().toISOString(),
  };
  addEvent(event);

  return NextResponse.json(product, { status: 201 });
}