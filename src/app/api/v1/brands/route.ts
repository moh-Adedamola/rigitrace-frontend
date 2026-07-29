import { NextResponse } from "next/server";
import type { Brand } from "@/lib/types/entities";
import { addBrand, listBrands } from "@/lib/mock/brandStore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as Brand["status"] | null;
  const results = listBrands(status ?? undefined);
  return NextResponse.json({ data: results, page: 1, limit: results.length, total: results.length });
}

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

  addBrand(brand);
  return NextResponse.json(brand, { status: 201 });
}