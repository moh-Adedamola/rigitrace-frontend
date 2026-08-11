import { NextResponse } from "next/server";
import type { ApplicantType, PilotApplication } from "@/lib/types/pilotApplication";
import { addPilotApplication } from "@/lib/mock/pilotApplicationStore";

function isApplicantType(value: unknown): value is ApplicantType {
  return value === "brand" || value === "retailer";
}

export async function POST(request: Request) {
  const body = await request.json();

  if (
    !body.name ||
    !body.brandName ||
    !body.contactEmail ||
    !body.productCategory ||
    !body.productCountEstimate
  ) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message:
            "Name, brand name, contact email, product category, and rough product count are required.",
        },
      },
      { status: 400 }
    );
  }
  if (!/^\S+@\S+\.\S+$/.test(body.contactEmail)) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Enter a valid email address." } },
      { status: 400 }
    );
  }

  const application: PilotApplication = {
    id: crypto.randomUUID(),
    name: body.name,
    brandName: body.brandName,
    contactEmail: body.contactEmail,
    contactPhone: body.contactPhone || undefined,
    productCategory: body.productCategory,
    productCountEstimate: body.productCountEstimate,
    applicantType: isApplicantType(body.applicantType) ? body.applicantType : undefined,
    createdAt: new Date().toISOString(),
  };

  addPilotApplication(application);

  // SEAM: no email provider exists yet. A real integration notifies the
  // pilot team (and likely sends the applicant a confirmation) here. For
  // now this just logs and stores in-memory, like every other mock route —
  // see docs/architecture.md "The backend seam".
  console.log("[pilot-application] received:", application);

  return NextResponse.json(application, { status: 201 });
}
