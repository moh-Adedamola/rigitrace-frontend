import { NextResponse } from "next/server";
import type { Retailer } from "@/lib/types/entities";
import { addRetailer, listRetailers } from "@/lib/mock/retailerStore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as Retailer["status"] | null;
  const results = listRetailers(status ?? undefined);
  return NextResponse.json({ data: results, page: 1, limit: results.length, total: results.length });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.type || !body.contactEmail) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Missing required fields." } },
      { status: 400 }
    );
  }

  const retailer: Retailer = {
    id: crypto.randomUUID(),
    name: body.name,
    type: body.type,
    status: "pending",
    contactEmail: body.contactEmail,
    createdAt: new Date().toISOString(),
  };

  addRetailer(retailer);
  return NextResponse.json(retailer, { status: 201 });
}