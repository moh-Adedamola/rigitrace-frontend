import { NextResponse } from "next/server";
import type { EventLogEntry } from "@/lib/types/entities";
import { listEvents } from "@/lib/mock/eventLogStore";

const VALID_ENTITY_TYPES: EventLogEntry["entityType"][] = ["brand", "product", "retailer", "report", "evidence"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entityTypeParam = searchParams.get("entityType");
  const entityId = searchParams.get("entityId") ?? undefined;

  if (entityTypeParam && !VALID_ENTITY_TYPES.includes(entityTypeParam as EventLogEntry["entityType"])) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid entityType." } },
      { status: 400 }
    );
  }

  const entityType = (entityTypeParam as EventLogEntry["entityType"] | null) ?? undefined;
  const results = listEvents(entityType, entityId);
  return NextResponse.json({ data: results, page: 1, limit: results.length, total: results.length });
}
