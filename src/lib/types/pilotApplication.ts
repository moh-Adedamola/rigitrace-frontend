// DECISION: PilotApplication is deliberately NOT in entities.ts. It isn't
// one of the 9 core entities shared with the backend (Identity/Evidence/
// Trust/Traceability) — it's marketing-funnel data for pilot recruitment.
// Kept separate rather than unilaterally expanding the shared contract.
// Flag with the backend dev before this needs to be a real, persisted flow.
export type ApplicantType = "brand" | "retailer";

export interface PilotApplication {
  id: string;
  name: string;
  brandName: string;
  contactEmail: string;
  contactPhone?: string;
  productCategory: string;
  productCountEstimate: string;
  applicantType?: ApplicantType;
  createdAt: string;
}
