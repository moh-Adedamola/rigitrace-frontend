import { NextResponse } from "next/server";
import type { EventLogEntry, Retailer } from "@/lib/types/entities";
import { updateRetailerStatus } from "@/lib/mock/retailerStore";
import { addEvent } from "@/lib/mock/eventLogStore";

const VALID_STATUSES: Retailer["status"][] = ["draft", "pending", "approved", "suspended", "revoked"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  if (!VALID_STATUSES.includes(body.status)) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid status value." } },
      { status: 400 }
    );
  }

  const updated = updateRetailerStatus(id, body.status);
  if (!updated) {
    return NextResponse.json(
      { error: { code: "RETAILER_NOT_FOUND", message: "Retailer not found." } },
      { status: 404 }
    );
  }

  const event: EventLogEntry = {
    id: crypto.randomUUID(),
    entityType: "retailer",
    entityId: updated.id,
    action: `retailer_${updated.status}`,
    actorId: body.actorId ?? "unknown",
    actorRole: "admin",
    description: `${updated.name} ${updated.status} by admin.`,
    createdAt: new Date().toISOString(),
  };
  addEvent(event);

  return NextResponse.json(updated);
}