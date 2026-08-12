import { NextResponse } from "next/server";
import type { EventLogEntry } from "@/lib/types/entities";
import { findProduct, updateProduct } from "@/lib/mock/productStore";
import { addEvent } from "@/lib/mock/eventLogStore";

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
  const actorId = body.actorId ?? "unknown";

  const updated = updateProduct(id, body.changes ?? {}, body.changeType ?? "info_change", body.summary ?? "Product updated", actorId);

  if (!updated) {
    return NextResponse.json(
      { error: { code: "PRODUCT_NOT_FOUND", message: "Product not found." } },
      { status: 404 }
    );
  }

  // Publishing is the milestone worth its own action name; any other
  // status change is still notable; anything else is a routine info edit.
  const newStatus = body.changes?.status;
  const action =
    newStatus === "published" ? "product_published" : newStatus ? "product_status_changed" : "product_updated";

  const event: EventLogEntry = {
    id: crypto.randomUUID(),
    entityType: "product",
    entityId: updated.id,
    action,
    actorId,
    actorRole: "brand",
    description:
      action === "product_published"
        ? `${updated.name} published.`
        : action === "product_status_changed"
          ? `${updated.name} status changed to ${newStatus}.`
          : `${updated.name} updated.`,
    createdAt: new Date().toISOString(),
  };
  addEvent(event);

  return NextResponse.json(updated);
}