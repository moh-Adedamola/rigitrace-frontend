import { NextResponse } from "next/server";
import type { Retailer } from "@/lib/types/entities";
import { updateRetailerStatus } from "@/lib/mock/retailerStore";

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

  return NextResponse.json(updated);
}