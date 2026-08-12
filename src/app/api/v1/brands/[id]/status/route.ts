import { NextResponse } from "next/server";
import type { Brand, EventLogEntry } from "@/lib/types/entities";
import { updateBrandStatus } from "@/lib/mock/brandStore";
import { addEvent } from "@/lib/mock/eventLogStore";

const VALID_STATUSES: Brand["status"][] = ["draft", "pending", "approved", "suspended", "revoked"];

// Next.js 16: `params` is a Promise now, must be awaited — this differs
// from older Next.js versions where it was a plain object.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  if (!VALID_STATUSES.includes(body.status)) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid status value." } },
      { status: 400 }
    );
  }

  const updated = updateBrandStatus(id, body.status);
  if (!updated) {
    return NextResponse.json(
      { error: { code: "BRAND_NOT_FOUND", message: "Brand not found." } },
      { status: 404 }
    );
  }

  const event: EventLogEntry = {
    id: crypto.randomUUID(),
    entityType: "brand",
    entityId: updated.id,
    action: `brand_${updated.status}`,
    // No auth yet — nothing sends a real actorId here. Accept one if a
    // future caller sends it; "unknown" until then, same fallback already
    // used in products/[id]/route.ts.
    actorId: body.actorId ?? "unknown",
    actorRole: "admin",
    description: `${updated.name} ${updated.status} by admin.`,
    createdAt: new Date().toISOString(),
  };
  addEvent(event);

  return NextResponse.json(updated);
}