import { NextResponse } from "next/server";
import type { Evidence, EventLogEntry } from "@/lib/types/entities";
import { addEvidence, listEvidence } from "@/lib/mock/evidenceStore";
import { findProduct } from "@/lib/mock/productStore";
import { addEvent } from "@/lib/mock/eventLogStore";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const results = listEvidence(id);
  return NextResponse.json({ data: results, page: 1, limit: results.length, total: results.length });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const product = findProduct(id);
  if (!product) {
    return NextResponse.json(
      { error: { code: "PRODUCT_NOT_FOUND", message: "Product not found." } },
      { status: 404 }
    );
  }

  if (!body.source || !body.description) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Source and description are required." } },
      { status: 400 }
    );
  }

  const evidence: Evidence = {
    id: crypto.randomUUID(),
    productId: id,
    source: body.source,
    submittedBy: body.submittedBy ?? "unknown",
    description: body.description,
    attachments: body.attachments ?? [],
    createdAt: new Date().toISOString(),
    supersedes: body.supersedes ?? undefined,
  };

  addEvidence(evidence);

  const event: EventLogEntry = {
    id: crypto.randomUUID(),
    entityType: "evidence",
    entityId: evidence.id,
    action: "evidence_submitted",
    actorId: evidence.submittedBy,
    actorRole: evidence.source,
    description: `Evidence submitted for ${product.name} by ${evidence.source}.`,
    createdAt: new Date().toISOString(),
  };
  addEvent(event);

  return NextResponse.json(evidence, { status: 201 });
}