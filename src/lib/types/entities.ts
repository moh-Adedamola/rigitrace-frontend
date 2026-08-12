/**
 * RigiTrace shared entity types.
 *
 * This file is the frontend's source of truth for API shapes.
 * It should stay in sync with the backend's schema — ideally by
 * sharing this file (or generating it from the backend's OpenAPI
 * spec) rather than maintaining two copies by hand.
 *
 * See docs/API_CONTRACT.md for endpoint-level detail.
 */

// ---- Shared primitives -----------------------------------------------

export type ISODateString = string; // e.g. "2026-07-29T12:00:00Z"
export type UUID = string;

// ---- 1. Brand ----------------------------------------------------------

export type BrandStatus = "draft" | "pending" | "approved" | "suspended" | "revoked";

export interface Brand {
  id: UUID;
  name: string;
  registrationNumber: string;
  contactEmail: string;
  contactPhone?: string;
  status: BrandStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ---- 2. Product ---------------------------------------------------------

export type ProductStatus = "draft" | "pending" | "published" | "under_review" | "archived";

export interface Product {
  id: UUID;
  brandId: UUID;
  name: string;
  category: string; // configurable — never hardcode a fixed enum here
  barcode?: string;
  images: string[];
  status: ProductStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ---- 3. Product Version (append-only history) --------------------------

export interface ProductVersion {
  id: UUID;
  productId: UUID;
  changeType: "packaging_update" | "ingredient_update" | "info_change" | string;
  summary: string;
  snapshot: Partial<Product>; // full product state at this version
  createdAt: ISODateString;
  createdBy: UUID; // user/brand rep id
}

// ---- 4. Evidence (append-only, never edited/deleted) --------------------

export type EvidenceSource = "brand" | "manufacturer" | "retailer" | "consumer" | "regulator";

export interface Evidence {
  id: UUID;
  productId: UUID;
  source: EvidenceSource;
  submittedBy: UUID;
  description: string;
  attachments?: string[]; // file URLs
  createdAt: ISODateString;
  // Corrections create a NEW evidence record referencing the old one —
  // never mutate an existing record.
  supersedes?: UUID;
}

// ---- 5. Trust Score ------------------------------------------------------

export type TrustStatus = "high" | "medium" | "low" | "unverified";

export interface TrustScore {
  id: UUID;
  productId: UUID;
  score: number; // 0-100
  status: TrustStatus;
  explanation: string; // human-readable "why" — required, never omit
  factors: TrustFactor[];
  calculatedAt: ISODateString;
}

export interface TrustFactor {
  label: string; // e.g. "Brand verification status"
  impact: "positive" | "negative" | "neutral";
  weight: number; // relative contribution to the score
  detail?: string;
}

// ---- 6. Retailer ---------------------------------------------------------

export type RetailerType = "physical_store" | "online_store" | "social_commerce" | "marketplace";
export type RetailerStatus = "draft" | "pending" | "approved" | "suspended" | "revoked";

export interface Retailer {
  id: UUID;
  name: string;
  type: RetailerType;
  status: RetailerStatus;
  contactEmail: string;
  createdAt: ISODateString;
}

// ---- 7. Retailer Product Link --------------------------------------------

export interface RetailerProductLink {
  id: UUID;
  retailerId: UUID;
  productId: UUID;
  status: "pending" | "verified" | "rejected";
  createdAt: ISODateString;
}

// ---- 8. Reports / Cases --------------------------------------------------

export type ReportStatus = "submitted" | "under_investigation" | "resolved" | "dismissed";

export interface Report {
  id: UUID;
  productId: UUID;
  reporterContact?: string; // consumers can report without an account
  description: string;
  evidenceIds: UUID[];
  status: ReportStatus;
  resolution?: string;
  createdAt: ISODateString;
  resolvedAt?: ISODateString;
}

// ---- 9. Event Log (audit trail) ------------------------------------------

export interface EventLogEntry {
  id: UUID;
  entityType: "brand" | "product" | "retailer" | "report" | "evidence";
  entityId: UUID;
  action: string; // e.g. "brand_approved", "product_published"
  actorId: UUID;
  // "consumer" | "manufacturer" | "regulator" cover EvidenceSource actors
  // and anonymous report submitters — added alongside admin/brand/retailer/
  // system so every real actor kind has an honest value to log.
  actorRole: "admin" | "brand" | "retailer" | "consumer" | "manufacturer" | "regulator" | "system";
  description: string; // human-readable, e.g. "Brand approved by Admin"
  createdAt: ISODateString;
}