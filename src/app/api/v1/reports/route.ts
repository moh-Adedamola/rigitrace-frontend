import { NextResponse } from "next/server";
import type { EventLogEntry, Report } from "@/lib/types/entities";
import { addReport, listReports } from "@/lib/mock/reportStore";
import { findProduct } from "@/lib/mock/productStore";
import { addEvent } from "@/lib/mock/eventLogStore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId") ?? undefined;
  const results = listReports(productId);
  return NextResponse.json({ data: results, page: 1, limit: results.length, total: results.length });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.productId || !body.description) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Product and description are required." } },
      { status: 400 }
    );
  }

  const product = findProduct(body.productId);
  if (!product) {
    return NextResponse.json(
      { error: { code: "PRODUCT_NOT_FOUND", message: "Product not found." } },
      { status: 404 }
    );
  }

  const report: Report = {
    id: crypto.randomUUID(),
    productId: body.productId,
    reporterContact: body.reporterContact || undefined,
    description: body.description,
    evidenceIds: [],
    status: "submitted",
    createdAt: new Date().toISOString(),
  };

  addReport(report);

  const event: EventLogEntry = {
    id: crypto.randomUUID(),
    entityType: "report",
    entityId: report.id,
    action: "report_submitted",
    // Reports stay anonymous-capable by design (AGENTS.md rule 4) — this
    // isn't a gap auth will close later, unlike the "unknown" fallbacks
    // elsewhere in this file's siblings.
    actorId: "anonymous",
    actorRole: "consumer",
    description: `Report submitted against ${product.name}.`,
    createdAt: new Date().toISOString(),
  };
  addEvent(event);

  return NextResponse.json(report, { status: 201 });
}