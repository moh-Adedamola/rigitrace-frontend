import { NextResponse } from "next/server";
import type { Brand } from "@/lib/types/entities";
import { updateBrandStatus } from "@/lib/mock/brandStore";

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

  return NextResponse.json(updated);
}