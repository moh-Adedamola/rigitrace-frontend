import { NextResponse } from "next/server";
import { findProduct, updateProduct } from "@/lib/mock/productStore";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = findProduct(id);
  if (!product) {
    return NextResponse.json(
      { error: { code: "PRODUCT_NOT_FOUND", message: "Product not found." } },
      { status: 404 }
    );
  }
  return NextResponse.json(product);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const updated = updateProduct(
    id,
    body.changes ?? {},
    body.changeType ?? "info_change",
    body.summary ?? "Product updated",
    body.actorId ?? "unknown"
  );

  if (!updated) {
    return NextResponse.json(
      { error: { code: "PRODUCT_NOT_FOUND", message: "Product not found." } },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}