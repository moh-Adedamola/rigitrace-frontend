import { NextResponse } from "next/server";
import type { Brand } from "@/lib/types/entities";

/**
 * LOCAL MOCK ONLY.
 *
 * Stands in for the real backend until your colleague has one running.
 * Path is /api/v1/brands — the exact path in docs/API_CONTRACT.md — so
 * switching to the real backend later is just changing
 * NEXT_PUBLIC_API_BASE_URL, not touching any frontend code.
 */
export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.registrationNumber || !body.contactEmail) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Missing required fields." } },
      { status: 400 }
    );
  }

  const brand: Brand = {
    id: crypto.randomUUID(),
    name: body.name,
    registrationNumber: body.registrationNumber,
    contactEmail: body.contactEmail,
    contactPhone: body.contactPhone || undefined,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(brand, { status: 201 });
}