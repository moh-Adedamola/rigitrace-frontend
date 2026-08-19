import type {
  Brand,
  EventLogEntry,
  Evidence,
  Product,
  Report,
  Retailer,
  RetailerProductLink,
} from "@/lib/types/entities";

/**
 * DEMO DATA — pilot-brand demo seed, not real companies or products.
 *
 * Every brand, product, evidence record, retailer, and report below is
 * invented for demonstration purposes. Read `docs/architecture.md` →
 * "The backend seam" before touching this: it lives in `src/lib/mock/`,
 * which is deleted entirely at cutover — this file goes with it.
 *
 * Trust scores are deliberately NOT seeded here. `calculateTrustScore` is
 * left to compute them from this evidence at request time (lazily, on
 * first `GET .../trust-score`), same as it would for real data — seeding
 * a hand-written score would defeat the point of a recalculatable engine
 * and hide any bug in the calculation instead of surfacing it.
 *
 * EVERY `id` FIELD BELOW IS A STABLE LITERAL, NOT `crypto.randomUUID()`.
 * This is deliberate, not an oversight — on Vercel, every serverless
 * instance runs this module fresh. `crypto.randomUUID()` would mint a
 * different ID per instance, so an ID returned by the instance that
 * served a search could 404 on the instance that serves the product page
 * a moment later. Literals make every cold instance seed identically.
 *
 * If you copy a block to add a new brand/product/evidence/retailer/
 * link/report, YOU MUST MINT A NEW, UNIQUE LITERAL — copy-pasting the id
 * along with the block creates a silent duplicate that won't fail a
 * build. (`crypto.randomUUID()` in a scratch terminal is the easiest way
 * to generate one; just paste the result in as a literal, don't call it
 * inline here.)
 *
 * The one deliberate exception: `buildSeedEvents()` below still calls
 * `crypto.randomUUID()` for each event's own `id`. Events are DERIVED by
 * looping over the arrays above, not declared one-by-one, so there's no
 * fixed set of call sites to freeze without unrolling that loop into
 * ~160 hand-written objects — which would reintroduce the exact
 * copy-paste risk this comment warns about, for no benefit: nothing
 * anywhere looks up an event by its own id (only by entityId, which
 * already reads from the now-stable brand/product/retailer/report ids
 * above). An event's own id being instance-specific is harmless.
 *
 * Runtime-created records (a report filed through the live form, evidence
 * submitted, a trust score calculated, a brand/product registered through
 * a portal) are NOT part of this file and correctly keep using
 * `crypto.randomUUID()` at request time in their route handlers — that's
 * real new data, not seed data, and generating a fresh id for it is
 * correct, not a bug.
 */
export const SEED_DATA_MARKER =
  "RigiTrace pilot-demo seed data — invented brands and products for demonstration only, not real companies.";

// Set NEXT_PUBLIC_SEED_DEMO_DATA=false to run with empty stores. Defaults
// to on so a fresh clone or cold start always has something to demo.
export const SEED_ENABLED = process.env.NEXT_PUBLIC_SEED_DEMO_DATA !== "false";

// ---- Actors ----------------------------------------------------------
// Not real accounts — there is no auth yet (see AGENTS.md). These are
// readable stand-ins for "who submitted this," distinct from the
// `"current-user-placeholder"` used by live forms so the two are never
// confused: this marks seeded history, that marks an active auth gap.
const ACTOR = {
  brandRep: "demo-seed-brand-rep",
  manufacturer: "demo-seed-manufacturer-contact",
  retailerStaff: "demo-seed-retailer-staff",
  consumer: "demo-seed-consumer",
  regulator: "demo-seed-regulator-officer",
  // Used only by the derived SEED_EVENTS below, for actions a real admin
  // takes (approvals, status changes) — not used by any evidence record.
  admin: "demo-seed-admin",
} as const;

// ---- Brands ------------------------------------------------------------
// 12 total: 7 approved, 2 pending (demoes the admin approval queue with
// more than one item in it), 1 suspended + 1 revoked (two different ways
// a brand can lose standing, so the non-approved states aren't identical).

const brandAdukeNaturals: Brand = {
  id: "2092378a-be52-4670-a32f-cd8e2eba96b9",
  name: "Aduke Naturals",
  registrationNumber: "RC1042871",
  contactEmail: "hello@adukenaturals.ng",
  contactPhone: "+234 803 214 7765",
  status: "approved",
  createdAt: "2026-05-04T09:00:00Z",
  updatedAt: "2026-05-11T10:30:00Z",
};

const brandZuriSkinRituals: Brand = {
  id: "fb4a20c9-dff5-4e1e-a3f4-39a076665a66",
  name: "Zuri Skin Rituals",
  registrationNumber: "RC1088452",
  contactEmail: "team@zuriskinrituals.com",
  contactPhone: "+234 809 552 3310",
  status: "approved",
  createdAt: "2026-05-09T11:15:00Z",
  updatedAt: "2026-05-15T08:00:00Z",
};

const brandOsazeGrooming: Brand = {
  id: "d5f375e4-7577-46f4-8cde-046da47a3613",
  name: "Osaze Grooming Co.",
  registrationNumber: "RC1071239",
  contactEmail: "contact@osazegrooming.ng",
  contactPhone: "+234 802 771 4498",
  status: "approved",
  createdAt: "2026-05-14T13:45:00Z",
  updatedAt: "2026-05-20T09:10:00Z",
};

const brandEwaBotanicals: Brand = {
  id: "e6b6616c-44df-44df-8826-f943c6e66314",
  name: "Ẹwà Botanicals",
  registrationNumber: "RC1095817",
  contactEmail: "info@ewabotanicals.com",
  contactPhone: "+234 810 663 2287",
  status: "approved",
  createdAt: "2026-05-20T10:00:00Z",
  updatedAt: "2026-05-26T14:20:00Z",
};

const brandLagosGlowCosmetics: Brand = {
  id: "69aa04da-8d73-4cdd-9c3a-e78e9f0f29cf",
  name: "Lagos Glow Cosmetics",
  registrationNumber: "RC1063904",
  contactEmail: "support@lagosglowcosmetics.com",
  contactPhone: "+234 806 118 9945",
  status: "approved",
  createdAt: "2026-05-28T12:30:00Z",
  updatedAt: "2026-06-02T09:00:00Z",
};

const brandKanemHairLab: Brand = {
  id: "ee17090f-a7bc-428a-a473-40eb5e314cde",
  name: "Kanem Hair Lab",
  registrationNumber: "RC1103356",
  contactEmail: "hello@kanemhairlab.ng",
  contactPhone: "+234 813 405 7712",
  status: "pending",
  createdAt: "2026-08-06T15:00:00Z",
  updatedAt: "2026-08-06T15:00:00Z",
};

const brandBrightIvorySkincare: Brand = {
  id: "09cfe7f3-034f-4181-a525-50255a0ed6e1",
  name: "Bright Ivory Skincare",
  registrationNumber: "RC1029514",
  contactEmail: "care@brightivoryskincare.com",
  contactPhone: "+234 807 990 3321",
  status: "suspended",
  createdAt: "2026-05-02T08:00:00Z",
  updatedAt: "2026-07-30T16:40:00Z",
};

// Ifeoma Beauty Studio — new approved brand, makeup-focused, the second
// large catalogue alongside Aduke Naturals (uneven on purpose).
const brandIfeomaBeautyStudio: Brand = {
  id: "3baeb792-8694-4cf2-a84f-c4e595e40364",
  name: "Ifeoma Beauty Studio",
  registrationNumber: "RC1112480",
  contactEmail: "hello@ifeomabeautystudio.ng",
  contactPhone: "+234 815 220 6634",
  status: "approved",
  createdAt: "2026-06-20T10:00:00Z",
  updatedAt: "2026-06-25T09:30:00Z",
};

// Adaeze Parfum House — new approved brand, fragrance-only, deliberately
// small (3 products) — a real platform has brands this size too.
const brandAdaezeParfumHouse: Brand = {
  id: "0685da31-f5cc-4b4d-bf7e-9eeaca543e09",
  name: "Adaeze Parfum House",
  registrationNumber: "RC1120033",
  contactEmail: "info@adaezeparfumhouse.com",
  contactPhone: "+234 812 447 1183",
  status: "approved",
  createdAt: "2026-07-01T11:00:00Z",
  updatedAt: "2026-07-06T09:00:00Z",
};

// Onyinye Glow Essentials — approved since April, registration revoked in
// August. Unlike Bright Ivory's suspension, revocation is the harder line
// in the same status model — the two aren't meant to read as identical.
const brandOnyinyeGlowEssentials: Brand = {
  id: "0f1d7cc3-dc8f-4c28-8d0d-f8667c45bc9a",
  name: "Onyinye Glow Essentials",
  registrationNumber: "RC1015820",
  contactEmail: "support@onyinyeglow.com",
  contactPhone: "+234 803 998 2260",
  status: "revoked",
  createdAt: "2026-04-10T09:00:00Z",
  updatedAt: "2026-08-05T14:00:00Z",
};

// Nkiru Hair Lab — pending, submitted just before the demo date. Zero
// products, same reason as Kanem: the real product route requires an
// approved brand.
const brandNkiruHairLab: Brand = {
  id: "6b08c8e3-1893-443f-a749-08f704e79ecf",
  name: "Nkiru Hair Lab",
  registrationNumber: "RC1130077",
  contactEmail: "contact@nkiruhairlab.ng",
  contactPhone: "+234 816 330 5521",
  status: "pending",
  createdAt: "2026-08-14T12:00:00Z",
  updatedAt: "2026-08-14T12:00:00Z",
};

// Yewande Naturals — pending, the newest submission in the queue.
const brandYewandeNaturals: Brand = {
  id: "9197f9c1-38d3-4c1a-a472-259458477a5f",
  name: "Yewande Naturals",
  registrationNumber: "RC1134502",
  contactEmail: "hello@yewandenaturals.com",
  contactPhone: "+234 809 771 4092",
  status: "pending",
  createdAt: "2026-08-17T08:30:00Z",
  updatedAt: "2026-08-17T08:30:00Z",
};

export const SEED_BRANDS: Brand[] = [
  brandAdukeNaturals,
  brandZuriSkinRituals,
  brandOsazeGrooming,
  brandEwaBotanicals,
  brandLagosGlowCosmetics,
  brandKanemHairLab,
  brandBrightIvorySkincare,
  brandIfeomaBeautyStudio,
  brandAdaezeParfumHouse,
  brandOnyinyeGlowEssentials,
  brandNkiruHairLab,
  brandYewandeNaturals,
];

// ---- Products ------------------------------------------------------------
// 55 across skincare, haircare, makeup, fragrance, and personal care, spread
// unevenly — Aduke Naturals and Lagos Glow Cosmetics are large catalogues,
// Adaeze Parfum House and Bright Ivory are small ones, on purpose. Statuses
// land wherever the evidence below actually puts them — see the module doc
// comment. Kanem Hair Lab, Nkiru Hair Lab, and Yewande Naturals (all
// pending) have none, since the real product route requires an approved
// brand; Bright Ivory (suspended) and Onyinye Glow Essentials (revoked)
// kept what they published before losing standing, which is the point.

const productAdukeRadianceCream: Product = {
  id: "32a52796-3a05-49d8-95b9-95d4a5bfe9ac",
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Shea Butter Radiance Cream",
  category: "Skincare",
  barcode: "6156001112223",
  images: [],
  status: "published",
  createdAt: "2026-05-12T09:00:00Z",
  updatedAt: "2026-05-12T09:00:00Z",
};

const productAdukeBlackSoapCleanser: Product = {
  id: "de7157f5-11ee-4b37-a7f1-6ea11b3bc416",
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Black Soap Cleanser",
  category: "Skincare",
  barcode: "6156001112230",
  images: [],
  status: "published",
  createdAt: "2026-05-18T09:00:00Z",
  updatedAt: "2026-05-18T09:00:00Z",
};

const productAdukeCoconutSerum: Product = {
  id: "15c45b41-f951-4ac1-bbf4-bc80fa6ae004",
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Coconut Hydration Serum",
  category: "Skincare",
  barcode: "6156001112247",
  images: [],
  status: "published",
  createdAt: "2026-05-25T09:00:00Z",
  updatedAt: "2026-05-25T09:00:00Z",
};

const productAdukeTurmericGlowMask: Product = {
  id: "3a995863-3bbd-4108-bd2e-d46be6905f87",
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Turmeric Glow Mask",
  category: "Skincare",
  barcode: "6156001112254",
  images: [],
  status: "published",
  createdAt: "2026-06-08T09:00:00Z",
  updatedAt: "2026-06-08T09:00:00Z",
};

const productAdukeAloeVeraSoothingGel: Product = {
  id: "e6030b9d-ba58-43ee-8143-b9bea990e5fe",
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Aloe Vera Soothing Gel",
  category: "Skincare",
  barcode: "6156001112261",
  images: [],
  status: "published",
  createdAt: "2026-06-15T09:00:00Z",
  updatedAt: "2026-06-15T09:00:00Z",
};

const productAdukeCocoaButterBodyCream: Product = {
  id: "6085841a-830f-49a5-b587-6fae582847b3",
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Cocoa Butter Body Cream",
  category: "Personal Care",
  barcode: "6156001112278",
  images: [],
  status: "published",
  createdAt: "2026-06-22T09:00:00Z",
  updatedAt: "2026-06-22T09:00:00Z",
};

const productAdukeCharcoalDetoxScrub: Product = {
  id: "2e4f5e40-6006-448e-a932-2e6730965940",
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Charcoal Detox Scrub",
  category: "Skincare",
  barcode: "6156001112285",
  images: [],
  status: "published",
  createdAt: "2026-06-29T09:00:00Z",
  updatedAt: "2026-06-29T09:00:00Z",
};

const productAdukeHibiscusToningMist: Product = {
  id: "852b2cbd-4700-4597-832b-6a0542e44ff0",
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Hibiscus Toning Mist",
  category: "Skincare",
  images: [],
  status: "published",
  createdAt: "2026-07-06T09:00:00Z",
  updatedAt: "2026-07-06T09:00:00Z",
};

const productAdukeBaobabRepairOil: Product = {
  id: "10ef5b08-5ae0-49a2-b605-810ce839ccdb",
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Baobab Repair Oil",
  category: "Skincare",
  barcode: "6156001112292",
  images: [],
  status: "published",
  createdAt: "2026-07-13T09:00:00Z",
  updatedAt: "2026-07-13T09:00:00Z",
};

const productAdukeOatmealSoapBar: Product = {
  id: "c882d3ba-2c00-402a-b18b-882dc2c50449",
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Oatmeal Soap Bar",
  category: "Personal Care",
  images: [],
  status: "published",
  createdAt: "2026-07-20T09:00:00Z",
  updatedAt: "2026-07-20T09:00:00Z",
};

const productAdukeGreenTeaEyeCream: Product = {
  id: "d4d3acd0-a2ec-4b6a-9786-ffac72cd474c",
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Green Tea Eye Cream",
  category: "Skincare",
  images: [],
  status: "published",
  createdAt: "2026-07-27T09:00:00Z",
  updatedAt: "2026-07-27T09:00:00Z",
};

// Freshly registered — deliberately zero evidence, an "unverified" case
// alongside the Ẹwà one below, from a different (well-established) brand,
// to show unverified status isn't tied to how new the brand itself is.
const productAdukeRosewaterHydratingMist: Product = {
  id: "b1c42992-5ac9-4fc1-ba92-98de335c5602",
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Rosewater Hydrating Mist",
  category: "Skincare",
  images: [],
  status: "published",
  createdAt: "2026-08-15T09:00:00Z",
  updatedAt: "2026-08-15T09:00:00Z",
};

const productZuriVitaminCSerum: Product = {
  id: "123a0dcc-4cb0-4af0-8f81-6d48827657aa",
  brandId: brandZuriSkinRituals.id,
  name: "Zuri Skin Rituals Vitamin C Brightening Serum",
  category: "Skincare",
  barcode: "6157002223341",
  images: [],
  status: "published",
  createdAt: "2026-05-16T10:00:00Z",
  updatedAt: "2026-05-16T10:00:00Z",
};

const productZuriClayFaceMask: Product = {
  id: "97c88da3-97d4-4aaf-ada0-1fb27ee7e2f0",
  brandId: brandZuriSkinRituals.id,
  name: "Zuri Skin Rituals Clay Face Mask",
  category: "Skincare",
  barcode: "6157002223358",
  images: [],
  status: "published",
  createdAt: "2026-05-22T10:00:00Z",
  updatedAt: "2026-05-22T10:00:00Z",
};

const productZuriRoseGlowToner: Product = {
  id: "7508568c-09d7-4979-8a6f-1165910b21a4",
  brandId: brandZuriSkinRituals.id,
  name: "Zuri Skin Rituals Rose Glow Toner",
  category: "Skincare",
  images: [],
  status: "published",
  createdAt: "2026-05-29T10:00:00Z",
  updatedAt: "2026-05-29T10:00:00Z",
};

const productZuriRetinolNightRepairSerum: Product = {
  id: "3c2cad08-a05b-4e60-a31d-4c5d1fc5db4c",
  brandId: brandZuriSkinRituals.id,
  name: "Zuri Skin Rituals Retinol Night Repair Serum",
  category: "Skincare",
  barcode: "6157002223365",
  images: [],
  status: "published",
  createdAt: "2026-06-12T10:00:00Z",
  updatedAt: "2026-06-12T10:00:00Z",
};

const productZuriNiacinamidePoreRefiningGel: Product = {
  id: "f0d63e4e-ed74-4bb7-bf19-1306814bb921",
  brandId: brandZuriSkinRituals.id,
  name: "Zuri Skin Rituals Niacinamide Pore Refining Gel",
  category: "Skincare",
  barcode: "6157002223372",
  images: [],
  status: "published",
  createdAt: "2026-06-19T10:00:00Z",
  updatedAt: "2026-06-19T10:00:00Z",
};

// Carries an under-investigation report — see SEED_REPORTS. The thin,
// single-source evidence and missing barcode already leave it in medium
// territory; the report is what pushes it down into low.
const productZuriPapayaEnzymePeel: Product = {
  id: "d61f3782-0777-402f-97a5-1b03a46c3b62",
  brandId: brandZuriSkinRituals.id,
  name: "Zuri Skin Rituals Papaya Enzyme Peel",
  category: "Skincare",
  images: [],
  status: "published",
  createdAt: "2026-06-26T10:00:00Z",
  updatedAt: "2026-06-26T10:00:00Z",
};

const productZuriCeramideBarrierCream: Product = {
  id: "47526a9f-6ad8-4f6f-bcd9-6d5fd81d9a56",
  brandId: brandZuriSkinRituals.id,
  name: "Zuri Skin Rituals Ceramide Barrier Cream",
  category: "Skincare",
  barcode: "6157002223389",
  images: [],
  status: "published",
  createdAt: "2026-07-03T10:00:00Z",
  updatedAt: "2026-07-03T10:00:00Z",
};

const productOsazeBeardOil: Product = {
  id: "339d694b-ef71-444b-af44-85c14e99f1b6",
  brandId: brandOsazeGrooming.id,
  name: "Osaze Grooming Co. Beard & Scalp Oil",
  category: "Personal Care",
  barcode: "6158003334452",
  images: [],
  status: "published",
  createdAt: "2026-05-21T11:00:00Z",
  updatedAt: "2026-05-21T11:00:00Z",
};

const productOsazeCharcoalShampooBar: Product = {
  id: "0fc02ed5-9b1f-4504-acca-71f51f4d24b5",
  brandId: brandOsazeGrooming.id,
  name: "Osaze Grooming Co. Charcoal Shampoo Bar",
  category: "Haircare",
  barcode: "6158003334469",
  images: [],
  status: "published",
  createdAt: "2026-05-27T11:00:00Z",
  updatedAt: "2026-05-27T11:00:00Z",
};

const productOsazeCocoaPomade: Product = {
  id: "72baa32c-ec1c-4301-8635-ef9f4751e3fd",
  brandId: brandOsazeGrooming.id,
  name: "Osaze Grooming Co. Cocoa Pomade",
  category: "Haircare",
  images: [],
  status: "published",
  createdAt: "2026-06-02T11:00:00Z",
  updatedAt: "2026-06-02T11:00:00Z",
};

const productOsazeSandalwoodAftershaveBalm: Product = {
  id: "c38b4dcf-1a87-4df1-bbf6-2d4636b166fc",
  brandId: brandOsazeGrooming.id,
  name: "Osaze Grooming Co. Sandalwood Aftershave Balm",
  category: "Personal Care",
  barcode: "6158003334476",
  images: [],
  status: "published",
  createdAt: "2026-06-09T11:00:00Z",
  updatedAt: "2026-06-09T11:00:00Z",
};

const productOsazeClarifyingScalpTonic: Product = {
  id: "babcf977-7ac2-483e-8b8a-dfeb81f6bc37",
  brandId: brandOsazeGrooming.id,
  name: "Osaze Grooming Co. Clarifying Scalp Tonic",
  category: "Haircare",
  images: [],
  status: "published",
  createdAt: "2026-06-16T11:00:00Z",
  updatedAt: "2026-06-16T11:00:00Z",
};

// Carries a freshly filed, unreviewed report — cosmetic only, doesn't
// touch the score (see reportStore.ts).
const productOsazeMatteClayWax: Product = {
  id: "0ce0764f-5711-4d26-9424-a2e6d89155b3",
  brandId: brandOsazeGrooming.id,
  name: "Osaze Grooming Co. Matte Clay Wax",
  category: "Haircare",
  barcode: "6158003334483",
  images: [],
  status: "published",
  createdAt: "2026-06-23T11:00:00Z",
  updatedAt: "2026-06-23T11:00:00Z",
};

const productEwaMoringaHairButter: Product = {
  id: "4885e81f-03f9-4982-8f00-f7bfb0d8228d",
  brandId: brandEwaBotanicals.id,
  name: "Ẹwà Botanicals Moringa Hair Butter",
  category: "Haircare",
  barcode: "6159004445563",
  images: [],
  status: "published",
  createdAt: "2026-05-30T12:00:00Z",
  updatedAt: "2026-05-30T12:00:00Z",
};

const productEwaRiceWaterSpray: Product = {
  id: "f5533fa5-053c-4fd7-a48b-d2a686f7a0e5",
  brandId: brandEwaBotanicals.id,
  name: "Ẹwà Botanicals Rice Water Strengthening Spray",
  category: "Haircare",
  images: [],
  status: "published",
  createdAt: "2026-06-04T12:00:00Z",
  updatedAt: "2026-06-04T12:00:00Z",
};

const productEwaBraidSheenSpray: Product = {
  id: "5081c73f-2c1b-423f-83d3-f17d0e3ff98f",
  brandId: brandEwaBotanicals.id,
  name: "Ẹwà Botanicals Braid Sheen Spray",
  category: "Haircare",
  barcode: "6159004445570",
  images: [],
  status: "published",
  createdAt: "2026-08-09T08:00:00Z",
  updatedAt: "2026-08-09T08:00:00Z",
};

const productEwaCastorOilGrowthSerum: Product = {
  id: "e85fbec3-94e0-4661-8537-a2265a210a11",
  brandId: brandEwaBotanicals.id,
  name: "Ẹwà Botanicals Castor Oil Growth Serum",
  category: "Haircare",
  barcode: "6159004445587",
  images: [],
  status: "published",
  createdAt: "2026-07-01T12:00:00Z",
  updatedAt: "2026-07-01T12:00:00Z",
};

const productEwaCoconutCurlCream: Product = {
  id: "6258fc5b-fc50-4b1e-864e-c1757a739a72",
  brandId: brandEwaBotanicals.id,
  name: "Ẹwà Botanicals Coconut Curl Cream",
  category: "Haircare",
  images: [],
  status: "published",
  createdAt: "2026-07-08T12:00:00Z",
  updatedAt: "2026-07-08T12:00:00Z",
};

const productLagosGlowLipstick: Product = {
  id: "168d208a-0cb9-4a36-b219-0da40658aecd",
  brandId: brandLagosGlowCosmetics.id,
  name: "Lagos Glow Cosmetics Matte Liquid Lipstick — Ruby Coast",
  category: "Makeup",
  barcode: "6160005556674",
  images: [],
  status: "published",
  createdAt: "2026-06-01T13:00:00Z",
  updatedAt: "2026-06-01T13:00:00Z",
};

const productLagosGlowFoundation: Product = {
  id: "2659c11b-93d2-48f7-a1b4-a8b3cc64ef88",
  brandId: brandLagosGlowCosmetics.id,
  name: "Lagos Glow Cosmetics Dewy Finish Foundation",
  category: "Makeup",
  barcode: "6160005556681",
  images: [],
  status: "published",
  createdAt: "2026-06-06T13:00:00Z",
  updatedAt: "2026-06-06T13:00:00Z",
};

const productLagosGlowAnkaraBloomEDP: Product = {
  id: "bc02d0cf-cdd5-463f-971e-1c5a5e61b2ef",
  brandId: brandLagosGlowCosmetics.id,
  name: "Lagos Glow Cosmetics Ankara Bloom Eau de Parfum",
  category: "Fragrance",
  images: [],
  status: "published",
  createdAt: "2026-06-10T13:00:00Z",
  updatedAt: "2026-06-10T13:00:00Z",
};

const productLagosGlowCitrusMuskMist: Product = {
  id: "951a5439-e7dd-42bd-8817-b696ba4466f1",
  brandId: brandLagosGlowCosmetics.id,
  name: "Lagos Glow Cosmetics Citrus Musk Body Mist",
  category: "Fragrance",
  images: [],
  status: "published",
  createdAt: "2026-06-14T13:00:00Z",
  updatedAt: "2026-06-14T13:00:00Z",
};

const productLagosGlowCoralReefLipstick: Product = {
  id: "30f367cf-f0e4-4452-a40b-b6a7fa3ede8b",
  brandId: brandLagosGlowCosmetics.id,
  name: "Lagos Glow Cosmetics Velvet Matte Lipstick — Coral Reef",
  category: "Makeup",
  barcode: "6160005556698",
  images: [],
  status: "published",
  createdAt: "2026-06-20T13:00:00Z",
  updatedAt: "2026-06-20T13:00:00Z",
};

const productLagosGlowHDSettingPowder: Product = {
  id: "c2d958f5-4b82-481a-a421-94e7ec9fb4f2",
  brandId: brandLagosGlowCosmetics.id,
  name: "Lagos Glow Cosmetics HD Setting Powder",
  category: "Makeup",
  barcode: "6160005556705",
  images: [],
  status: "published",
  createdAt: "2026-06-27T13:00:00Z",
  updatedAt: "2026-06-27T13:00:00Z",
};

const productLagosGlowBrowDefinerPencil: Product = {
  id: "8c64b570-57b5-414c-babc-401e022924ef",
  brandId: brandLagosGlowCosmetics.id,
  name: "Lagos Glow Cosmetics Brow Definer Pencil",
  category: "Makeup",
  images: [],
  status: "published",
  createdAt: "2026-07-04T13:00:00Z",
  updatedAt: "2026-07-04T13:00:00Z",
};

// Carries a resolved report — see SEED_REPORTS. Resolved doesn't count
// against the score (only "under_investigation" does), so this stays
// medium; the point is showing a report that reached a closed state.
const productLagosGlowSunsetAmberEDP: Product = {
  id: "ee50bbb6-77bc-49ce-bb1d-9feaa45c0660",
  brandId: brandLagosGlowCosmetics.id,
  name: "Lagos Glow Cosmetics Sunset Amber Eau de Parfum",
  category: "Fragrance",
  barcode: "6160005556712",
  images: [],
  status: "published",
  createdAt: "2026-07-11T13:00:00Z",
  updatedAt: "2026-07-11T13:00:00Z",
};

const productLagosGlowJasmineRainBodyMist: Product = {
  id: "39ae921f-44f0-41bf-bc0e-e683a32ff0f7",
  brandId: brandLagosGlowCosmetics.id,
  name: "Lagos Glow Cosmetics Jasmine Rain Body Mist",
  category: "Fragrance",
  images: [],
  status: "published",
  createdAt: "2026-07-18T13:00:00Z",
  updatedAt: "2026-07-18T13:00:00Z",
};

// Freshly registered — deliberately zero evidence, the third "unverified"
// case from an otherwise well-evidenced brand.
const productLagosGlowLongwearConcealer: Product = {
  id: "cf680324-acfb-498c-8a46-f7b7212fd0ea",
  brandId: brandLagosGlowCosmetics.id,
  name: "Lagos Glow Cosmetics Longwear Concealer",
  category: "Makeup",
  images: [],
  status: "published",
  createdAt: "2026-08-16T13:00:00Z",
  updatedAt: "2026-08-16T13:00:00Z",
};

const productBrightIvoryWhiteningCream: Product = {
  id: "63a98b48-59ea-471e-9f14-c9c6acb145ca",
  brandId: brandBrightIvorySkincare.id,
  name: "Bright Ivory Skincare Whitening Cream",
  category: "Skincare",
  images: [],
  status: "published",
  createdAt: "2026-05-06T09:00:00Z",
  updatedAt: "2026-05-06T09:00:00Z",
};

// Bright Ivory's second product — filed the same month, before suspension.
const productBrightIvoryEvenToneBodyLotion: Product = {
  id: "b5421d08-2b4d-4719-a418-d0e50e7c154e",
  brandId: brandBrightIvorySkincare.id,
  name: "Bright Ivory Skincare Even Tone Body Lotion",
  category: "Skincare",
  barcode: "6161006667789",
  images: [],
  status: "published",
  createdAt: "2026-05-19T09:00:00Z",
  updatedAt: "2026-05-19T09:00:00Z",
};

// Ifeoma Beauty Studio — 8 products, all makeup.
const productIfeomaMatteSettingPowder: Product = {
  id: "0a1d7ecf-1f61-4af6-a2be-708068b981be",
  brandId: brandIfeomaBeautyStudio.id,
  name: "Ifeoma Beauty Studio Matte Setting Powder",
  category: "Makeup",
  barcode: "6162007797796",
  images: [],
  status: "published",
  createdAt: "2026-06-26T10:00:00Z",
  updatedAt: "2026-06-26T10:00:00Z",
};

const productIfeomaLiquidFoundationDeepAmber: Product = {
  id: "1b5032dd-cc09-4808-a47c-ea4d1124df62",
  brandId: brandIfeomaBeautyStudio.id,
  name: "Ifeoma Beauty Studio Liquid Foundation — Deep Amber",
  category: "Makeup",
  barcode: "6162007797802",
  images: [],
  status: "published",
  createdAt: "2026-07-02T10:00:00Z",
  updatedAt: "2026-07-02T10:00:00Z",
};

const productIfeomaCreamyConcealer: Product = {
  id: "5b9caef2-f14e-4698-909b-265bd691a565",
  brandId: brandIfeomaBeautyStudio.id,
  name: "Ifeoma Beauty Studio Creamy Concealer",
  category: "Makeup",
  barcode: "6162007797819",
  images: [],
  status: "published",
  createdAt: "2026-07-09T10:00:00Z",
  updatedAt: "2026-07-09T10:00:00Z",
};

const productIfeomaBakedHighlighterDuo: Product = {
  id: "a635dc92-95a3-407a-8c86-58020c1036ce",
  brandId: brandIfeomaBeautyStudio.id,
  name: "Ifeoma Beauty Studio Baked Highlighter Duo",
  category: "Makeup",
  barcode: "6162007797826",
  images: [],
  status: "published",
  createdAt: "2026-07-16T10:00:00Z",
  updatedAt: "2026-07-16T10:00:00Z",
};

const productIfeomaWaterproofEyelinerPen: Product = {
  id: "c0d815b5-6cb7-416b-b782-773a126d20c6",
  brandId: brandIfeomaBeautyStudio.id,
  name: "Ifeoma Beauty Studio Waterproof Eyeliner Pen",
  category: "Makeup",
  images: [],
  status: "published",
  createdAt: "2026-07-23T10:00:00Z",
  updatedAt: "2026-07-23T10:00:00Z",
};

const productIfeomaVolumizingMascara: Product = {
  id: "91955a23-44a5-49b5-a2ca-0c23b3681cc8",
  brandId: brandIfeomaBeautyStudio.id,
  name: "Ifeoma Beauty Studio Volumizing Mascara",
  category: "Makeup",
  images: [],
  status: "published",
  createdAt: "2026-07-30T10:00:00Z",
  updatedAt: "2026-07-30T10:00:00Z",
};

// Carries a dismissed report — see SEED_REPORTS. Dismissed doesn't count
// against the score either, same as resolved.
const productIfeomaSatinLipstickTerracotta: Product = {
  id: "171f86a9-9766-4ae9-9319-ff31bd2985fe",
  brandId: brandIfeomaBeautyStudio.id,
  name: "Ifeoma Beauty Studio Satin Lipstick — Terracotta",
  category: "Makeup",
  barcode: "6162007797833",
  images: [],
  status: "published",
  createdAt: "2026-08-06T10:00:00Z",
  updatedAt: "2026-08-06T10:00:00Z",
};

// Freshly registered — zero evidence, unverified.
const productIfeomaBronzerCompact: Product = {
  id: "320268bd-7c59-4424-b1c5-bcd5c9259816",
  brandId: brandIfeomaBeautyStudio.id,
  name: "Ifeoma Beauty Studio Bronzer Compact",
  category: "Makeup",
  images: [],
  status: "published",
  createdAt: "2026-08-18T10:00:00Z",
  updatedAt: "2026-08-18T10:00:00Z",
};

// Adaeze Parfum House — 3 products, all fragrance. Small on purpose.
const productAdaezeAmberNightsEDP: Product = {
  id: "292ddcda-d903-4b25-8719-ceab1d002550",
  brandId: brandAdaezeParfumHouse.id,
  name: "Adaeze Parfum House Amber Nights Eau de Parfum",
  category: "Fragrance",
  barcode: "6163008848847",
  images: [],
  status: "published",
  createdAt: "2026-07-08T11:00:00Z",
  updatedAt: "2026-07-08T11:00:00Z",
};

const productAdaezeYlangBloomEDT: Product = {
  id: "9018c5d1-a590-4d2f-bbc2-9e3700cf7476",
  brandId: brandAdaezeParfumHouse.id,
  name: "Adaeze Parfum House Ylang Bloom Eau de Toilette",
  category: "Fragrance",
  images: [],
  status: "published",
  createdAt: "2026-07-15T11:00:00Z",
  updatedAt: "2026-07-15T11:00:00Z",
};

const productAdaezeMuskOudBodySpray: Product = {
  id: "ac9fcb0c-ee8e-4aa5-b7a5-f0cb033b3690",
  brandId: brandAdaezeParfumHouse.id,
  name: "Adaeze Parfum House Musk & Oud Body Spray",
  category: "Fragrance",
  barcode: "6163008848854",
  images: [],
  status: "published",
  createdAt: "2026-07-22T11:00:00Z",
  updatedAt: "2026-07-22T11:00:00Z",
};

// Onyinye Glow Essentials — 2 products, both published while the brand
// was still approved, before the August revocation (same pattern as
// Bright Ivory's suspension: the product record itself isn't touched).
const productOnyinyeInstantGlowBodyCream: Product = {
  id: "6a514086-9e40-4f9c-b99d-3069d9faed8e",
  brandId: brandOnyinyeGlowEssentials.id,
  name: "Onyinye Glow Essentials Instant Glow Body Cream",
  category: "Skincare",
  barcode: "6164009869861",
  images: [],
  status: "published",
  createdAt: "2026-04-18T09:00:00Z",
  updatedAt: "2026-04-18T09:00:00Z",
};

// Carries an under-investigation report — see SEED_REPORTS. Thin evidence
// on a now-revoked brand, and an active report on top — the clearest
// "genuinely weak, and here's why" case in the catalogue.
const productOnyinyeBrighteningNightSerum: Product = {
  id: "c331c0ca-7a3e-4378-9f8a-2894c0401b09",
  brandId: brandOnyinyeGlowEssentials.id,
  name: "Onyinye Glow Essentials Brightening Night Serum",
  category: "Skincare",
  barcode: "6164009869878",
  images: [],
  status: "published",
  createdAt: "2026-04-25T09:00:00Z",
  updatedAt: "2026-04-25T09:00:00Z",
};

export const SEED_PRODUCTS: Product[] = [
  productAdukeRadianceCream,
  productAdukeBlackSoapCleanser,
  productAdukeCoconutSerum,
  productAdukeTurmericGlowMask,
  productAdukeAloeVeraSoothingGel,
  productAdukeCocoaButterBodyCream,
  productAdukeCharcoalDetoxScrub,
  productAdukeHibiscusToningMist,
  productAdukeBaobabRepairOil,
  productAdukeOatmealSoapBar,
  productAdukeGreenTeaEyeCream,
  productAdukeRosewaterHydratingMist,
  productZuriVitaminCSerum,
  productZuriClayFaceMask,
  productZuriRoseGlowToner,
  productZuriRetinolNightRepairSerum,
  productZuriNiacinamidePoreRefiningGel,
  productZuriPapayaEnzymePeel,
  productZuriCeramideBarrierCream,
  productOsazeBeardOil,
  productOsazeCharcoalShampooBar,
  productOsazeCocoaPomade,
  productOsazeSandalwoodAftershaveBalm,
  productOsazeClarifyingScalpTonic,
  productOsazeMatteClayWax,
  productEwaMoringaHairButter,
  productEwaRiceWaterSpray,
  productEwaBraidSheenSpray,
  productEwaCastorOilGrowthSerum,
  productEwaCoconutCurlCream,
  productLagosGlowLipstick,
  productLagosGlowFoundation,
  productLagosGlowAnkaraBloomEDP,
  productLagosGlowCitrusMuskMist,
  productLagosGlowCoralReefLipstick,
  productLagosGlowHDSettingPowder,
  productLagosGlowBrowDefinerPencil,
  productLagosGlowSunsetAmberEDP,
  productLagosGlowJasmineRainBodyMist,
  productLagosGlowLongwearConcealer,
  productBrightIvoryWhiteningCream,
  productBrightIvoryEvenToneBodyLotion,
  productIfeomaMatteSettingPowder,
  productIfeomaLiquidFoundationDeepAmber,
  productIfeomaCreamyConcealer,
  productIfeomaBakedHighlighterDuo,
  productIfeomaWaterproofEyelinerPen,
  productIfeomaVolumizingMascara,
  productIfeomaSatinLipstickTerracotta,
  productIfeomaBronzerCompact,
  productAdaezeAmberNightsEDP,
  productAdaezeYlangBloomEDT,
  productAdaezeMuskOudBodySpray,
  productOnyinyeInstantGlowBodyCream,
  productOnyinyeBrighteningNightSerum,
];

// ---- Evidence --------------------------------------------------------
// Spread unevenly on purpose, so the trust scores it produces land across
// the full range rather than clustering high: several products get rich,
// multi-source evidence (high); most get one or two pieces from one or
// two sources (medium, with a visible gap — missing barcode, a single
// source, or an unapproved brand capping the ceiling); a handful stay
// thin on an unapproved/suspended/revoked brand or pick up an
// under-investigation report (low); a few are freshly registered with
// nothing yet (unverified). `productAdukeRadianceCream` remains the
// richest, most diverse set — the "this is what well-evidenced looks
// like" example. Verify the actual computed distribution after seeding
// rather than trusting this comment — see docs/progress-tracker.md.

export const SEED_EVIDENCE: Evidence[] = [
  // Aduke Naturals — Shea Butter Radiance Cream: 4 pieces, 4 distinct
  // sources — the flagship "rich multi-source evidence" example.
  {
    id: "3c7f88ac-509f-412d-ab93-5539668b7e19",
    productId: productAdukeRadianceCream.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and full ingredient declaration, NAFDAC reg. no. A7-8842.",
    createdAt: "2026-05-12T09:15:00Z",
  },
  {
    id: "b8f225d1-2995-4f8a-a516-f1a1f6f778f4",
    productId: productAdukeRadianceCream.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description:
      "Certificate of analysis from the contract manufacturer confirming batch composition matches the declared formula.",
    createdAt: "2026-05-14T11:00:00Z",
  },
  {
    id: "100ddf76-1a9e-42e1-940f-5284b1dc664c",
    productId: productAdukeRadianceCream.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms stock is sourced directly from Aduke Naturals, not a secondary distributor.",
    createdAt: "2026-05-20T14:30:00Z",
  },
  {
    id: "47b57a25-c7c1-41f7-8f27-973dfa4aa6c5",
    productId: productAdukeRadianceCream.id,
    source: "regulator",
    submittedBy: ACTOR.regulator,
    description: "NAFDAC registration status confirmed current and in good standing as of this evidence date.",
    createdAt: "2026-06-01T10:00:00Z",
  },

  // Aduke Naturals — Black Soap Cleanser: 2 pieces, 2 sources. Carries
  // the report under investigation — see SEED_REPORTS.
  {
    id: "ce0ecac6-8466-400d-8c89-1d5547684739",
    productId: productAdukeBlackSoapCleanser.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8850.",
    createdAt: "2026-05-18T09:15:00Z",
  },
  {
    id: "e507ad8c-d6f1-40c8-9388-675ceeff73c2",
    productId: productAdukeBlackSoapCleanser.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-06-03T16:00:00Z",
  },

  // Aduke Naturals — Coconut Hydration Serum: 1 piece, brand-only.
  {
    id: "ae3efae6-d382-43c8-b9b8-e6020d652e58",
    productId: productAdukeCoconutSerum.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8861.",
    createdAt: "2026-05-25T09:15:00Z",
  },

  // Aduke Naturals — Turmeric Glow Mask: 3 pieces, 3 sources.
  {
    id: "5611a75e-b9c2-4990-837a-badc3d2043a0",
    productId: productAdukeTurmericGlowMask.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8872.",
    createdAt: "2026-06-08T09:15:00Z",
  },
  {
    id: "099f090d-27de-4257-823d-e408b52f06dd",
    productId: productAdukeTurmericGlowMask.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description:
      "Certificate of analysis from the contract manufacturer confirming batch composition matches the declared formula.",
    createdAt: "2026-06-11T11:00:00Z",
  },
  {
    id: "166b936e-c548-45d1-a868-4813f8a9cc71",
    productId: productAdukeTurmericGlowMask.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-06-20T15:00:00Z",
  },

  // Aduke Naturals — Aloe Vera Soothing Gel: 2 pieces, 2 sources.
  {
    id: "1329634f-aedf-42a2-b28b-d78476f2f61b",
    productId: productAdukeAloeVeraSoothingGel.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8879.",
    createdAt: "2026-06-15T09:15:00Z",
  },
  {
    id: "e0a02a08-bf66-40d8-a266-0d6fac4842b2",
    productId: productAdukeAloeVeraSoothingGel.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms stock is sourced directly from Aduke Naturals, not a secondary distributor.",
    createdAt: "2026-06-25T14:00:00Z",
  },

  // Aduke Naturals — Cocoa Butter Body Cream: 1 piece, brand-only.
  {
    id: "f4778393-4b75-489c-a9d9-41f4e38c7129",
    productId: productAdukeCocoaButterBodyCream.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8886.",
    createdAt: "2026-06-22T09:15:00Z",
  },

  // Aduke Naturals — Charcoal Detox Scrub: 3 pieces, 2 sources.
  {
    id: "ac2446f0-93df-4ac8-981c-6bce321d6042",
    productId: productAdukeCharcoalDetoxScrub.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8893.",
    createdAt: "2026-06-29T09:15:00Z",
  },
  {
    id: "72afddab-f7ff-4e9a-80d2-d95e3b6da42b",
    productId: productAdukeCharcoalDetoxScrub.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Updated certificate of analysis after a stability re-test of the current formula.",
    createdAt: "2026-07-20T09:15:00Z",
  },
  {
    id: "e4d5f517-3ea7-4c73-b7fc-4175912be0a8",
    productId: productAdukeCharcoalDetoxScrub.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-07-10T15:00:00Z",
  },

  // Aduke Naturals — Hibiscus Toning Mist: 2 pieces, 2 sources.
  {
    id: "0e2a2777-91cc-4eba-8792-a78c145debcd",
    productId: productAdukeHibiscusToningMist.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8901.",
    createdAt: "2026-07-06T09:15:00Z",
  },
  {
    id: "ae43ea36-711d-405d-97ec-d8d18e4c53ec",
    productId: productAdukeHibiscusToningMist.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-07-18T15:00:00Z",
  },

  // Aduke Naturals — Baobab Repair Oil: 1 piece, brand-only.
  {
    id: "65bfc71c-ad47-41cc-bffc-9f04defae6b9",
    productId: productAdukeBaobabRepairOil.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8908.",
    createdAt: "2026-07-13T09:15:00Z",
  },

  // Aduke Naturals — Oatmeal Soap Bar: 1 piece, brand-only.
  {
    id: "c1586d3f-5fbb-4847-956e-dc7b4663dd23",
    productId: productAdukeOatmealSoapBar.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8915.",
    createdAt: "2026-07-20T09:15:00Z",
  },

  // Aduke Naturals — Green Tea Eye Cream: 2 pieces, 1 source (brand twice).
  {
    id: "dd3c8d49-7695-4943-9f0f-d12b3a34f6de",
    productId: productAdukeGreenTeaEyeCream.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8922.",
    createdAt: "2026-07-27T09:15:00Z",
  },
  {
    id: "2b8c7052-2db9-432f-b375-ea303c51c714",
    productId: productAdukeGreenTeaEyeCream.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Updated certificate of analysis after a stability re-test of the current formula.",
    createdAt: "2026-08-10T09:15:00Z",
  },

  // Aduke Naturals — Rosewater Hydrating Mist: none. Freshly registered —
  // the second "not yet verified" case, from a brand that otherwise has
  // plenty of evidence elsewhere.

  // Zuri Skin Rituals — Vitamin C Brightening Serum: 2 pieces, both brand.
  {
    id: "7c67aae2-5166-443b-ae8b-7e3f36b30a55",
    productId: productZuriVitaminCSerum.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. Z2-1140.",
    createdAt: "2026-05-16T10:15:00Z",
  },
  {
    id: "13518d37-79ce-42dc-be93-8b24853a172b",
    productId: productZuriVitaminCSerum.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Updated certificate of analysis after a stability re-test of the current formula.",
    createdAt: "2026-06-20T10:15:00Z",
  },

  // Zuri Skin Rituals — Clay Face Mask: 2 pieces, 2 sources.
  {
    id: "913ce868-e9b2-45b8-a79c-7be7f7a2ce15",
    productId: productZuriClayFaceMask.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. Z2-1157.",
    createdAt: "2026-05-22T10:15:00Z",
  },
  {
    id: "18f92449-7ab7-484c-b023-d5ffd0b4a44e",
    productId: productZuriClayFaceMask.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms consistent stock sourced directly from Zuri Skin Rituals since launch.",
    createdAt: "2026-06-05T14:00:00Z",
  },

  // Zuri Skin Rituals — Rose Glow Toner: 1 piece, brand-only.
  {
    id: "c20cdef8-f521-4e36-8598-548bb9ea17db",
    productId: productZuriRoseGlowToner.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. Z2-1163.",
    createdAt: "2026-05-29T10:15:00Z",
  },

  // Zuri Skin Rituals — Retinol Night Repair Serum: 2 pieces, 2 sources.
  {
    id: "21e7443f-76cb-4bd2-964c-a0c13cef58c0",
    productId: productZuriRetinolNightRepairSerum.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. Z2-1178.",
    createdAt: "2026-06-12T10:15:00Z",
  },
  {
    id: "2a43aa77-9980-4340-ad73-52ae3eb80849",
    productId: productZuriRetinolNightRepairSerum.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description: "Certificate of analysis confirming retinol concentration matches the declared formula.",
    createdAt: "2026-06-24T11:00:00Z",
  },

  // Zuri Skin Rituals — Niacinamide Pore Refining Gel: 3 pieces, 3 sources.
  {
    id: "bdf29f10-c0d0-44e1-872c-71f555cf0d23",
    productId: productZuriNiacinamidePoreRefiningGel.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. Z2-1185.",
    createdAt: "2026-06-19T10:15:00Z",
  },
  {
    id: "77e9f16e-b70e-4d2f-af1e-be38458e0710",
    productId: productZuriNiacinamidePoreRefiningGel.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms consistent stock sourced directly from Zuri Skin Rituals since launch.",
    createdAt: "2026-07-01T14:00:00Z",
  },
  {
    id: "e7424007-d7ea-492a-a828-dfe55ddc9b58",
    productId: productZuriNiacinamidePoreRefiningGel.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-07-08T15:00:00Z",
  },

  // Zuri Skin Rituals — Papaya Enzyme Peel: 1 piece, brand-only. Carries
  // the second under-investigation report — see SEED_REPORTS.
  {
    id: "c0a7303e-f16a-4ab4-ba4b-40edacbc5c8f",
    productId: productZuriPapayaEnzymePeel.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. Z2-1192.",
    createdAt: "2026-06-26T10:15:00Z",
  },

  // Zuri Skin Rituals — Ceramide Barrier Cream: 1 piece, brand-only.
  {
    id: "ba314b52-972b-41ae-8716-e2653fddf753",
    productId: productZuriCeramideBarrierCream.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. Z2-1199.",
    createdAt: "2026-07-03T10:15:00Z",
  },

  // Osaze Grooming Co. — Beard & Scalp Oil: 2 pieces, 2 sources.
  {
    id: "aa8c997b-a1d7-4974-a59f-d232cdddc53d",
    productId: productOsazeBeardOil.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. O5-2231.",
    createdAt: "2026-05-21T11:15:00Z",
  },
  {
    id: "0eed8d9c-1d12-43e2-87eb-95df2c5ba94f",
    productId: productOsazeBeardOil.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description: "Certificate of analysis confirming carrier and essential oil ratios match the declared formula.",
    createdAt: "2026-06-08T11:00:00Z",
  },

  // Osaze Grooming Co. — Charcoal Shampoo Bar: 1 piece, brand-only.
  {
    id: "b9663237-daa5-430b-a70c-0ccd91134484",
    productId: productOsazeCharcoalShampooBar.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. O5-2248.",
    createdAt: "2026-05-27T11:15:00Z",
  },

  // Osaze Grooming Co. — Cocoa Pomade: 2 pieces, 2 sources.
  {
    id: "7b501866-4b3f-4415-9349-f24c7d24c83a",
    productId: productOsazeCocoaPomade.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. O5-2255.",
    createdAt: "2026-06-02T11:15:00Z",
  },
  {
    id: "eb9ac3c0-3e43-4b5d-b955-69a981679ab4",
    productId: productOsazeCocoaPomade.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-06-19T15:00:00Z",
  },

  // Osaze Grooming Co. — Sandalwood Aftershave Balm: 2 pieces, 2 sources.
  {
    id: "1dfbb2bf-6d7e-4b26-88f0-5664296c3da9",
    productId: productOsazeSandalwoodAftershaveBalm.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. O5-2262.",
    createdAt: "2026-06-09T11:15:00Z",
  },
  {
    id: "b3d969cf-3e4f-46dd-a589-46c8aa873afb",
    productId: productOsazeSandalwoodAftershaveBalm.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description: "Certificate of analysis confirming fragrance and carrier ratios match the declared formula.",
    createdAt: "2026-06-21T11:00:00Z",
  },

  // Osaze Grooming Co. — Clarifying Scalp Tonic: 1 piece, brand-only.
  {
    id: "f590f76f-3732-4f73-8426-39e11cd81fa1",
    productId: productOsazeClarifyingScalpTonic.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. O5-2269.",
    createdAt: "2026-06-16T11:15:00Z",
  },

  // Osaze Grooming Co. — Matte Clay Wax: 1 piece, brand-only. Carries a
  // freshly filed, unreviewed report — see SEED_REPORTS.
  {
    id: "a21c03ff-35f2-41ec-be69-23e225c21b06",
    productId: productOsazeMatteClayWax.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. O5-2276.",
    createdAt: "2026-06-23T11:15:00Z",
  },

  // Ẹwà Botanicals — Moringa Hair Butter: 1 piece, brand-only.
  {
    id: "5668260c-cfab-49ec-a2a7-1d080bede556",
    productId: productEwaMoringaHairButter.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. E9-3312.",
    createdAt: "2026-05-30T12:15:00Z",
  },

  // Ẹwà Botanicals — Rice Water Strengthening Spray: 2 pieces, 2 sources.
  {
    id: "a5bdb45e-6ee2-4977-be21-2ba5ebddb1f0",
    productId: productEwaRiceWaterSpray.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. E9-3329.",
    createdAt: "2026-06-04T12:15:00Z",
  },
  {
    id: "f7ffad0f-0ad5-4c32-a9ca-a2142f41587c",
    productId: productEwaRiceWaterSpray.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-06-22T15:30:00Z",
  },

  // Ẹwà Botanicals — Braid Sheen Spray: none. Just registered — this is
  // the "not yet verified" demo case, deliberately left empty.

  // Ẹwà Botanicals — Castor Oil Growth Serum: 2 pieces, 2 sources.
  {
    id: "d60990af-2e34-422f-8e81-806f31e96a56",
    productId: productEwaCastorOilGrowthSerum.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. E9-3336.",
    createdAt: "2026-07-01T12:15:00Z",
  },
  {
    id: "4f6925e1-044f-4635-b8b0-816585bd3245",
    productId: productEwaCastorOilGrowthSerum.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-07-14T15:00:00Z",
  },

  // Ẹwà Botanicals — Coconut Curl Cream: 1 piece, brand-only.
  {
    id: "1cf3f82a-61f8-4307-af1f-719802afb108",
    productId: productEwaCoconutCurlCream.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. E9-3343.",
    createdAt: "2026-07-08T12:15:00Z",
  },

  // Lagos Glow Cosmetics — Matte Liquid Lipstick: 2 pieces, 2 sources.
  {
    id: "a2793081-8cb4-42ad-a1c0-2c1bc2783c1b",
    productId: productLagosGlowLipstick.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4471.",
    createdAt: "2026-06-01T13:15:00Z",
  },
  {
    id: "231e3159-0787-4045-b24a-e01d6063c84f",
    productId: productLagosGlowLipstick.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms consistent stock sourced directly from Lagos Glow Cosmetics since launch.",
    createdAt: "2026-06-16T14:45:00Z",
  },

  // Lagos Glow Cosmetics — Dewy Finish Foundation: 1 piece, brand-only.
  {
    id: "c01f0fcf-8a9b-4f93-847e-bb5b8fa4ebaa",
    productId: productLagosGlowFoundation.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4488.",
    createdAt: "2026-06-06T13:15:00Z",
  },

  // Lagos Glow Cosmetics — Ankara Bloom Eau de Parfum: 1 piece, brand-only.
  {
    id: "edf77da4-ac60-4910-8ee8-10e5f0704c22",
    productId: productLagosGlowAnkaraBloomEDP.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4495.",
    createdAt: "2026-06-10T13:15:00Z",
  },

  // Lagos Glow Cosmetics — Citrus Musk Body Mist: 1 piece, brand-only.
  // Carries the unreviewed, "submitted" report — see SEED_REPORTS.
  {
    id: "f8b9de7a-e3eb-4a13-9a45-cd4217400df4",
    productId: productLagosGlowCitrusMuskMist.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4502.",
    createdAt: "2026-06-14T13:15:00Z",
  },

  // Lagos Glow Cosmetics — Velvet Matte Lipstick, Coral Reef: 2 pieces, 2 sources.
  {
    id: "af180a83-a9bf-4cbc-b980-82ac0995a47c",
    productId: productLagosGlowCoralReefLipstick.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4509.",
    createdAt: "2026-06-20T13:15:00Z",
  },
  {
    id: "29f35649-df77-481d-872e-4d9356b4178f",
    productId: productLagosGlowCoralReefLipstick.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms consistent stock sourced directly from Lagos Glow Cosmetics since launch.",
    createdAt: "2026-07-02T14:45:00Z",
  },

  // Lagos Glow Cosmetics — HD Setting Powder: 3 pieces, 2 sources.
  {
    id: "dc0f8cb1-623c-4308-886e-578c8ada100c",
    productId: productLagosGlowHDSettingPowder.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4516.",
    createdAt: "2026-06-27T13:15:00Z",
  },
  {
    id: "417b3759-0613-49a8-b117-1fe3be2e0687",
    productId: productLagosGlowHDSettingPowder.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Updated certificate of analysis after a stability re-test of the current formula.",
    createdAt: "2026-07-25T13:15:00Z",
  },
  {
    id: "35d6ddd0-044a-49ff-9e0c-1bfeab1e89cd",
    productId: productLagosGlowHDSettingPowder.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms consistent stock sourced directly from Lagos Glow Cosmetics since launch.",
    createdAt: "2026-07-10T14:45:00Z",
  },

  // Lagos Glow Cosmetics — Brow Definer Pencil: 1 piece, brand-only.
  {
    id: "394b3b1f-f67c-4072-91f0-bed27c362194",
    productId: productLagosGlowBrowDefinerPencil.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4523.",
    createdAt: "2026-07-04T13:15:00Z",
  },

  // Lagos Glow Cosmetics — Sunset Amber Eau de Parfum: 1 piece, brand-only.
  // Carries a resolved report — see SEED_REPORTS.
  {
    id: "99014413-a511-4b70-a8da-405c2413b02a",
    productId: productLagosGlowSunsetAmberEDP.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4530.",
    createdAt: "2026-07-11T13:15:00Z",
  },

  // Lagos Glow Cosmetics — Jasmine Rain Body Mist: 2 pieces, 1 source
  // (brand twice).
  {
    id: "d99008a6-1dd9-4694-89de-e7477688fd44",
    productId: productLagosGlowJasmineRainBodyMist.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4537.",
    createdAt: "2026-07-18T13:15:00Z",
  },
  {
    id: "75f163be-89ba-4f44-8b77-2b93b8556a21",
    productId: productLagosGlowJasmineRainBodyMist.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Updated certificate of analysis after a stability re-test of the current formula.",
    createdAt: "2026-08-01T13:15:00Z",
  },

  // Lagos Glow Cosmetics — Longwear Concealer: none. Freshly registered —
  // another "not yet verified" case.

  // Bright Ivory Skincare — Whitening Cream: 1 piece, brand-only, filed
  // before the brand was later suspended. The evidence record itself
  // isn't touched — brand status is a separate factor in the score.
  {
    id: "6ea2434c-aa39-4f94-a4c7-214dfbe279be",
    productId: productBrightIvoryWhiteningCream.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. B1-0091.",
    createdAt: "2026-05-06T09:15:00Z",
  },

  // Bright Ivory Skincare — Even Tone Body Lotion: 2 pieces, 2 sources,
  // also filed before suspension. Better-evidenced than its sibling
  // product, but the suspended brand still caps it well below "high" —
  // brand status is a hard ceiling, not something evidence can outweigh.
  {
    id: "b504b4b3-99de-4904-8cbc-460133614b7f",
    productId: productBrightIvoryEvenToneBodyLotion.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. B1-0098.",
    createdAt: "2026-05-19T09:15:00Z",
  },
  {
    id: "26840877-29fe-4a38-bf36-dedfe6ee2ecb",
    productId: productBrightIvoryEvenToneBodyLotion.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-06-02T15:00:00Z",
  },

  // Ifeoma Beauty Studio — Matte Setting Powder: 2 pieces, 2 sources.
  {
    id: "5eff8d1a-6641-4d37-ab41-881baed7d682",
    productId: productIfeomaMatteSettingPowder.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. I3-1004.",
    createdAt: "2026-06-26T10:15:00Z",
  },
  {
    id: "2527617f-fbaf-48b2-a514-2de288430b87",
    productId: productIfeomaMatteSettingPowder.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description: "Certificate of analysis from the contract manufacturer confirming batch composition matches the declared formula.",
    createdAt: "2026-07-08T11:00:00Z",
  },

  // Ifeoma Beauty Studio — Liquid Foundation, Deep Amber: 3 pieces, 3 sources.
  {
    id: "e5844e9a-f1eb-48b2-afd0-0223fbb59fb0",
    productId: productIfeomaLiquidFoundationDeepAmber.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. I3-1011.",
    createdAt: "2026-07-02T10:15:00Z",
  },
  {
    id: "c1928b6d-de7e-4e34-8709-2f8539fb736d",
    productId: productIfeomaLiquidFoundationDeepAmber.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms consistent stock sourced directly from Ifeoma Beauty Studio since launch.",
    createdAt: "2026-07-16T14:45:00Z",
  },
  {
    id: "c303e08a-486b-4204-84e4-180dff4f21ae",
    productId: productIfeomaLiquidFoundationDeepAmber.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-07-22T15:00:00Z",
  },

  // Ifeoma Beauty Studio — Creamy Concealer: 1 piece, brand-only.
  {
    id: "3c3fab1a-7094-42ba-96ed-7d7e44718aa1",
    productId: productIfeomaCreamyConcealer.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. I3-1018.",
    createdAt: "2026-07-09T10:15:00Z",
  },

  // Ifeoma Beauty Studio — Baked Highlighter Duo: 2 pieces, 2 sources.
  {
    id: "d3f7f7b8-5a8b-4d5e-98ab-039addc91964",
    productId: productIfeomaBakedHighlighterDuo.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. I3-1025.",
    createdAt: "2026-07-16T10:15:00Z",
  },
  {
    id: "e0d5f72b-410c-49c6-9a19-182c0256419e",
    productId: productIfeomaBakedHighlighterDuo.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms consistent stock sourced directly from Ifeoma Beauty Studio since launch.",
    createdAt: "2026-07-30T14:45:00Z",
  },

  // Ifeoma Beauty Studio — Waterproof Eyeliner Pen: 1 piece, brand-only.
  {
    id: "8740c67d-2ef1-42d4-a0a2-497ea948240c",
    productId: productIfeomaWaterproofEyelinerPen.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. I3-1032.",
    createdAt: "2026-07-23T10:15:00Z",
  },

  // Ifeoma Beauty Studio — Volumizing Mascara: 2 pieces, 1 source (brand twice).
  {
    id: "3319bee0-0112-40b7-bd12-911c1118e4c8",
    productId: productIfeomaVolumizingMascara.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. I3-1039.",
    createdAt: "2026-07-30T10:15:00Z",
  },
  {
    id: "ee7e9639-b81a-4a5a-b661-e1b05534cce3",
    productId: productIfeomaVolumizingMascara.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Updated certificate of analysis after a stability re-test of the current formula.",
    createdAt: "2026-08-13T10:15:00Z",
  },

  // Ifeoma Beauty Studio — Satin Lipstick, Terracotta: 1 piece, brand-only.
  // Carries a dismissed report — see SEED_REPORTS.
  {
    id: "e93ddb17-b89b-4556-a25e-f3fa46990c8c",
    productId: productIfeomaSatinLipstickTerracotta.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. I3-1046.",
    createdAt: "2026-08-06T10:15:00Z",
  },

  // Ifeoma Beauty Studio — Bronzer Compact: none. Freshly registered —
  // "not yet verified."

  // Adaeze Parfum House — Amber Nights Eau de Parfum: 2 pieces, 2 sources.
  {
    id: "088fbe92-ef4b-4b7a-a8f7-b01a82a66986",
    productId: productAdaezeAmberNightsEDP.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. D6-2207.",
    createdAt: "2026-07-08T11:15:00Z",
  },
  {
    id: "8f543845-f23c-4578-ba43-588b665dd037",
    productId: productAdaezeAmberNightsEDP.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description: "Certificate of analysis from the contract manufacturer confirming batch composition matches the declared formula.",
    createdAt: "2026-07-20T11:00:00Z",
  },

  // Adaeze Parfum House — Ylang Bloom Eau de Toilette: 1 piece, brand-only.
  {
    id: "4ee1d3da-2167-44b3-af70-4a365216b405",
    productId: productAdaezeYlangBloomEDT.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. D6-2214.",
    createdAt: "2026-07-15T11:15:00Z",
  },

  // Adaeze Parfum House — Musk & Oud Body Spray: 1 piece, brand-only.
  {
    id: "a3d767ae-9706-483e-b2d6-66cb6477cf72",
    productId: productAdaezeMuskOudBodySpray.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. D6-2221.",
    createdAt: "2026-07-22T11:15:00Z",
  },

  // Onyinye Glow Essentials — Instant Glow Body Cream: 3 pieces, 3 sources
  // — filed while the brand was still approved, before revocation. Even
  // this well-evidenced record caps at medium once the brand is revoked.
  {
    id: "b713938e-60ae-47ec-ab66-03ea40b7debf",
    productId: productOnyinyeInstantGlowBodyCream.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. G8-0550.",
    createdAt: "2026-04-18T09:15:00Z",
  },
  {
    id: "f7ee4eb8-64f5-40ed-b1df-83f1386a3279",
    productId: productOnyinyeInstantGlowBodyCream.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description: "Certificate of analysis from the contract manufacturer confirming batch composition matches the declared formula.",
    createdAt: "2026-04-29T11:00:00Z",
  },
  {
    id: "5d1522c7-806d-4d60-8b8c-422241a768ac",
    productId: productOnyinyeInstantGlowBodyCream.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-05-10T15:00:00Z",
  },

  // Onyinye Glow Essentials — Brightening Night Serum: 1 piece, brand-only.
  // Carries the third under-investigation report — see SEED_REPORTS.
  {
    id: "2fb6f71f-8316-49e7-b2dc-b70325ec64bd",
    productId: productOnyinyeBrighteningNightSerum.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. G8-0557.",
    createdAt: "2026-04-25T09:15:00Z",
  },
];

// ---- Retailers -------------------------------------------------------
// 9. NaijaGlowDeals and BeautyDeals247 are left pending so the admin
// retailer-approval queue has more than one item in it.

const retailerBalogunBeautyMart: Retailer = {
  id: "572b0040-fc69-44e5-b9fb-8e8839e137cd",
  name: "Balogun Beauty Mart",
  type: "physical_store",
  status: "approved",
  contactEmail: "orders@balogunbeautymart.ng",
  createdAt: "2026-05-15T09:00:00Z",
};

const retailerGlowMartNG: Retailer = {
  id: "806f191b-d40e-4ea8-b722-96332b2c75d0",
  name: "GlowMart NG",
  type: "online_store",
  status: "approved",
  contactEmail: "support@glowmart.ng",
  createdAt: "2026-05-19T09:00:00Z",
};

const retailerCityMallBeautyCorner: Retailer = {
  id: "7be1b1a7-e13f-4946-9805-10d95fc13d74",
  name: "CityMall Beauty Corner",
  type: "marketplace",
  status: "approved",
  contactEmail: "hello@citymallbeauty.ng",
  createdAt: "2026-05-24T09:00:00Z",
};

const retailerNaijaGlowDeals: Retailer = {
  id: "51973202-8633-41df-ace9-ffd023ae5efe",
  name: "NaijaGlowDeals",
  type: "social_commerce",
  status: "pending",
  contactEmail: "naijaglowdeals@gmail.com",
  createdAt: "2026-08-08T09:00:00Z",
};

const retailerAlabaBeautyEmporium: Retailer = {
  id: "1d6c1974-e5a1-4a82-81e2-e545ca09fda2",
  name: "Alaba Beauty Emporium",
  type: "physical_store",
  status: "approved",
  contactEmail: "sales@alababeautyemporium.ng",
  createdAt: "2026-06-10T09:00:00Z",
};

const retailerAbujaGlowBoutique: Retailer = {
  id: "2dbf823f-b701-4eff-8736-a57a3f191dbb",
  name: "Abuja Glow Boutique",
  type: "physical_store",
  status: "approved",
  contactEmail: "hello@abujaglowboutique.ng",
  createdAt: "2026-06-24T09:00:00Z",
};

const retailerShopNaijaBeauty: Retailer = {
  id: "4eb2903b-fe7f-4b76-848d-25461dcda869",
  name: "ShopNaija Beauty",
  type: "online_store",
  status: "approved",
  contactEmail: "orders@shopnaijabeauty.com",
  createdAt: "2026-07-05T09:00:00Z",
};

const retailerMarketSquareBeautyHub: Retailer = {
  id: "c8182265-1498-4774-a3fd-ddbbe98cdc83",
  name: "MarketSquare Beauty Hub",
  type: "marketplace",
  status: "approved",
  contactEmail: "hub@marketsquarebeauty.ng",
  createdAt: "2026-07-19T09:00:00Z",
};

const retailerBeautyDeals247: Retailer = {
  id: "8d503c60-d57c-4c2c-b42c-0f64acc58a24",
  name: "BeautyDeals247",
  type: "social_commerce",
  status: "pending",
  contactEmail: "beautydeals247@gmail.com",
  createdAt: "2026-08-15T09:00:00Z",
};

export const SEED_RETAILERS: Retailer[] = [
  retailerBalogunBeautyMart,
  retailerGlowMartNG,
  retailerCityMallBeautyCorner,
  retailerNaijaGlowDeals,
  retailerAlabaBeautyEmporium,
  retailerAbujaGlowBoutique,
  retailerShopNaijaBeauty,
  retailerMarketSquareBeautyHub,
  retailerBeautyDeals247,
];

// ---- Retailer ↔ Product links -----------------------------------------
// Only approved retailers link, only to published products — mirrors what
// the real POST route would allow. NaijaGlowDeals and BeautyDeals247
// (both pending) have none yet. Coverage favours the higher- and
// medium-trust products, same as a real market would — the low-scoring
// and freshly registered products are deliberately left with little or
// no "Available at" presence.

export const SEED_RETAILER_PRODUCT_LINKS: RetailerProductLink[] = [
  {
    id: "3ee8373b-95ed-430e-9270-c33b62514bec",
    retailerId: retailerBalogunBeautyMart.id,
    productId: productAdukeRadianceCream.id,
    status: "verified",
    createdAt: "2026-05-25T10:00:00Z",
  },
  {
    id: "d88cb9cd-56d3-4354-96bb-6f89515d89fa",
    retailerId: retailerBalogunBeautyMart.id,
    productId: productAdukeBlackSoapCleanser.id,
    status: "verified",
    createdAt: "2026-05-25T10:05:00Z",
  },
  {
    id: "1200245f-773f-41a0-b823-ee3c45fef4b3",
    retailerId: retailerBalogunBeautyMart.id,
    productId: productOsazeBeardOil.id,
    status: "verified",
    createdAt: "2026-06-09T10:00:00Z",
  },
  {
    id: "188e6bce-56e7-47a8-8254-e1e7950e9713",
    retailerId: retailerBalogunBeautyMart.id,
    productId: productLagosGlowLipstick.id,
    status: "verified",
    createdAt: "2026-06-17T10:00:00Z",
  },
  {
    id: "0b1c9cb6-2073-433d-a3cf-7077f54281f5",
    retailerId: retailerGlowMartNG.id,
    productId: productAdukeRadianceCream.id,
    status: "verified",
    createdAt: "2026-05-26T11:00:00Z",
  },
  {
    id: "d47fff08-e6ec-480f-a9df-8e617b6f65bb",
    retailerId: retailerGlowMartNG.id,
    productId: productZuriVitaminCSerum.id,
    status: "verified",
    createdAt: "2026-05-30T11:00:00Z",
  },
  {
    id: "0c415753-b1cf-4344-b5bb-fec5f62f532d",
    retailerId: retailerGlowMartNG.id,
    productId: productZuriClayFaceMask.id,
    status: "verified",
    createdAt: "2026-06-06T11:00:00Z",
  },
  {
    id: "2a5f2961-6249-4438-b5ee-22c71df5b2f1",
    retailerId: retailerGlowMartNG.id,
    productId: productOsazeCocoaPomade.id,
    status: "verified",
    createdAt: "2026-06-20T11:00:00Z",
  },
  {
    id: "69a4be7c-e091-48fd-89a6-bbcb1fa92600",
    retailerId: retailerGlowMartNG.id,
    productId: productLagosGlowFoundation.id,
    status: "verified",
    createdAt: "2026-06-07T11:00:00Z",
  },
  {
    id: "b9e17c15-f0f5-4780-beee-acfcf8b489e0",
    retailerId: retailerCityMallBeautyCorner.id,
    productId: productAdukeCoconutSerum.id,
    status: "verified",
    createdAt: "2026-06-01T12:00:00Z",
  },
  {
    id: "c50c5a10-ab12-4605-8167-6a95d723c242",
    retailerId: retailerCityMallBeautyCorner.id,
    productId: productEwaMoringaHairButter.id,
    status: "verified",
    createdAt: "2026-06-05T12:00:00Z",
  },
  {
    id: "0f7640ef-a578-4270-aff7-26a6882c2f1d",
    retailerId: retailerCityMallBeautyCorner.id,
    productId: productLagosGlowAnkaraBloomEDP.id,
    status: "verified",
    createdAt: "2026-06-12T12:00:00Z",
  },

  // -- New retailer coverage, added alongside the catalogue expansion.
  // Balogun Beauty Mart
  {
    id: "88f8d96d-cb90-457c-a8e5-8e71e3fd8569",
    retailerId: retailerBalogunBeautyMart.id,
    productId: productAdukeTurmericGlowMask.id,
    status: "verified",
    createdAt: "2026-06-20T10:00:00Z",
  },
  {
    id: "3c2732ee-c64d-4132-98fa-419d42269d42",
    retailerId: retailerBalogunBeautyMart.id,
    productId: productZuriRetinolNightRepairSerum.id,
    status: "verified",
    createdAt: "2026-06-25T10:00:00Z",
  },
  {
    id: "bb748301-110d-4b70-8ed3-3c0ecfdd371b",
    retailerId: retailerBalogunBeautyMart.id,
    productId: productIfeomaMatteSettingPowder.id,
    status: "verified",
    createdAt: "2026-07-05T10:00:00Z",
  },
  {
    id: "6e313d17-9f33-4ee4-9e86-79f7ec3d853a",
    retailerId: retailerBalogunBeautyMart.id,
    productId: productIfeomaLiquidFoundationDeepAmber.id,
    status: "verified",
    createdAt: "2026-07-10T10:00:00Z",
  },
  {
    id: "891ffa26-2ef8-4894-91f0-ab0b1d2c52fa",
    retailerId: retailerBalogunBeautyMart.id,
    productId: productAdaezeAmberNightsEDP.id,
    status: "verified",
    createdAt: "2026-07-15T10:00:00Z",
  },

  // GlowMart NG
  {
    id: "b6ac21d4-a17d-49cd-a210-1f56036e84d2",
    retailerId: retailerGlowMartNG.id,
    productId: productAdukeAloeVeraSoothingGel.id,
    status: "verified",
    createdAt: "2026-06-22T11:00:00Z",
  },
  {
    id: "88db1c0c-b082-4da2-8078-1059484b42c2",
    retailerId: retailerGlowMartNG.id,
    productId: productZuriNiacinamidePoreRefiningGel.id,
    status: "verified",
    createdAt: "2026-06-28T11:00:00Z",
  },
  {
    id: "704d1203-3a51-4e1a-9d7c-5bc5cc25ba3b",
    retailerId: retailerGlowMartNG.id,
    productId: productEwaCastorOilGrowthSerum.id,
    status: "verified",
    createdAt: "2026-07-10T11:00:00Z",
  },
  {
    id: "d3f1644a-52d4-4cc5-86be-4af6b3a06c79",
    retailerId: retailerGlowMartNG.id,
    productId: productLagosGlowCoralReefLipstick.id,
    status: "verified",
    createdAt: "2026-07-02T11:00:00Z",
  },
  {
    id: "c9b221bb-48fa-49d2-b85c-c33a3d3ba4b4",
    retailerId: retailerGlowMartNG.id,
    productId: productIfeomaBakedHighlighterDuo.id,
    status: "verified",
    createdAt: "2026-07-25T11:00:00Z",
  },
  {
    id: "ed407634-ba25-4641-ad37-5e9c548ea364",
    retailerId: retailerGlowMartNG.id,
    productId: productAdaezeMuskOudBodySpray.id,
    status: "verified",
    createdAt: "2026-08-01T11:00:00Z",
  },

  // CityMall Beauty Corner
  {
    id: "d95f3f8a-d304-4c8d-915a-98bfaddf9eea",
    retailerId: retailerCityMallBeautyCorner.id,
    productId: productOsazeSandalwoodAftershaveBalm.id,
    status: "verified",
    createdAt: "2026-06-16T12:00:00Z",
  },
  {
    id: "fb4e9ccf-c1b5-4154-ae29-a91514234770",
    retailerId: retailerCityMallBeautyCorner.id,
    productId: productLagosGlowHDSettingPowder.id,
    status: "verified",
    createdAt: "2026-07-05T12:00:00Z",
  },
  {
    id: "bdfe0f0e-6b6d-48c8-982c-370d37dc4912",
    retailerId: retailerCityMallBeautyCorner.id,
    productId: productIfeomaCreamyConcealer.id,
    status: "verified",
    createdAt: "2026-07-18T12:00:00Z",
  },
  {
    id: "84335991-ceee-4bc8-b3fa-3d0a0bb69ab4",
    retailerId: retailerCityMallBeautyCorner.id,
    productId: productZuriCeramideBarrierCream.id,
    status: "verified",
    createdAt: "2026-07-10T12:00:00Z",
  },

  // Alaba Beauty Emporium
  {
    id: "dc73d1dd-b1dc-4e53-b7ac-8b8aa7b80ccf",
    retailerId: retailerAlabaBeautyEmporium.id,
    productId: productAdukeCharcoalDetoxScrub.id,
    status: "verified",
    createdAt: "2026-07-03T10:00:00Z",
  },
  {
    id: "8d010385-bca6-4bcd-ac80-21319a85dea5",
    retailerId: retailerAlabaBeautyEmporium.id,
    productId: productAdukeCocoaButterBodyCream.id,
    status: "verified",
    createdAt: "2026-06-28T10:00:00Z",
  },
  {
    id: "423c0bfe-8ee3-4969-96b7-a1d8b9f6edb3",
    retailerId: retailerAlabaBeautyEmporium.id,
    productId: productOsazeCharcoalShampooBar.id,
    status: "verified",
    createdAt: "2026-06-15T10:00:00Z",
  },
  {
    id: "5ebfac3a-abad-40c1-8f44-23248e961600",
    retailerId: retailerAlabaBeautyEmporium.id,
    productId: productZuriRoseGlowToner.id,
    status: "verified",
    createdAt: "2026-06-18T10:00:00Z",
  },
  {
    id: "685d002b-9e04-4d11-814f-6b8a8ba2e2e1",
    retailerId: retailerAlabaBeautyEmporium.id,
    productId: productLagosGlowLipstick.id,
    status: "verified",
    createdAt: "2026-06-30T10:00:00Z",
  },
  {
    id: "6ad21dee-b3d8-42a0-8333-88718fc3e9e2",
    retailerId: retailerAlabaBeautyEmporium.id,
    productId: productIfeomaVolumizingMascara.id,
    status: "verified",
    createdAt: "2026-08-05T10:00:00Z",
  },

  // Abuja Glow Boutique
  {
    id: "5c9d59cb-977d-4e47-99e2-f4d9b24b3c76",
    retailerId: retailerAbujaGlowBoutique.id,
    productId: productAdukeBaobabRepairOil.id,
    status: "verified",
    createdAt: "2026-07-20T10:00:00Z",
  },
  {
    id: "6384bbe4-a60d-45f8-8107-0e4e83bfc1c5",
    retailerId: retailerAbujaGlowBoutique.id,
    productId: productEwaMoringaHairButter.id,
    status: "verified",
    createdAt: "2026-07-01T10:00:00Z",
  },
  {
    id: "ad1d1fb6-30e8-4ce1-9627-a0aa97249d91",
    retailerId: retailerAbujaGlowBoutique.id,
    productId: productOsazeMatteClayWax.id,
    status: "verified",
    createdAt: "2026-07-05T10:00:00Z",
  },
  {
    id: "bc9596bf-2b7c-48e5-bed6-e9162966a854",
    retailerId: retailerAbujaGlowBoutique.id,
    productId: productIfeomaSatinLipstickTerracotta.id,
    status: "verified",
    createdAt: "2026-08-12T10:00:00Z",
  },
  {
    id: "d501ddbc-cc58-4e0a-8b3e-757e224fed6c",
    retailerId: retailerAbujaGlowBoutique.id,
    productId: productAdukeRadianceCream.id,
    status: "verified",
    createdAt: "2026-07-01T10:00:00Z",
  },

  // ShopNaija Beauty
  {
    id: "3fb9d99b-eec1-4112-8bd5-9823b29a9066",
    retailerId: retailerShopNaijaBeauty.id,
    productId: productZuriVitaminCSerum.id,
    status: "verified",
    createdAt: "2026-07-12T11:00:00Z",
  },
  {
    id: "b5d698fc-b464-49a1-993a-a084d3e66c6e",
    retailerId: retailerShopNaijaBeauty.id,
    productId: productEwaRiceWaterSpray.id,
    status: "verified",
    createdAt: "2026-07-15T11:00:00Z",
  },
  {
    id: "8e868434-4ba9-4b87-80fc-928d8e28b5f3",
    retailerId: retailerShopNaijaBeauty.id,
    productId: productLagosGlowFoundation.id,
    status: "verified",
    createdAt: "2026-07-18T11:00:00Z",
  },
  {
    id: "db821055-88bc-436c-8a2b-c6861769d8f3",
    retailerId: retailerShopNaijaBeauty.id,
    productId: productLagosGlowSunsetAmberEDP.id,
    status: "verified",
    createdAt: "2026-07-22T11:00:00Z",
  },
  {
    id: "3c7dd7a2-7bb2-4685-ad01-4d000459a5ad",
    retailerId: retailerShopNaijaBeauty.id,
    productId: productAdaezeYlangBloomEDT.id,
    status: "verified",
    createdAt: "2026-07-28T11:00:00Z",
  },

  // MarketSquare Beauty Hub
  {
    id: "5c59b061-b644-4910-956b-35365f21c53d",
    retailerId: retailerMarketSquareBeautyHub.id,
    productId: productOsazeBeardOil.id,
    status: "verified",
    createdAt: "2026-07-25T12:00:00Z",
  },
  {
    id: "97b947c8-55e5-4e0b-b85f-6caaffcc8bb6",
    retailerId: retailerMarketSquareBeautyHub.id,
    productId: productLagosGlowCitrusMuskMist.id,
    status: "verified",
    createdAt: "2026-07-28T12:00:00Z",
  },
  {
    id: "df13f220-9071-43e2-b246-0782b77b96a7",
    retailerId: retailerMarketSquareBeautyHub.id,
    productId: productZuriClayFaceMask.id,
    status: "verified",
    createdAt: "2026-08-02T12:00:00Z",
  },
  {
    id: "7f99b6a0-cdc3-45f1-ba1d-987a3003eee9",
    retailerId: retailerMarketSquareBeautyHub.id,
    productId: productIfeomaWaterproofEyelinerPen.id,
    status: "verified",
    createdAt: "2026-08-06T12:00:00Z",
  },
  {
    id: "e347da23-7ceb-476a-9e9e-f99243200aed",
    retailerId: retailerMarketSquareBeautyHub.id,
    productId: productOsazeCocoaPomade.id,
    status: "verified",
    createdAt: "2026-08-08T12:00:00Z",
  },
];

// ---- Reports -----------------------------------------------------------
// 7 across all four ReportStatus values, deliberately: "submitted" reports
// that have NOT been reviewed yet (must NOT move a score — see
// calculateTrustScore.ts / reportStore.ts), reports moved to
// "under_investigation" by a person (the only kind that does move a
// score), and reports that reached a closed state — "resolved" (found to
// be nothing) and "dismissed" (found to be unfounded) — neither of which
// moves a score either, same as "submitted." The three
// "under_investigation" reports are the clearest possible demo of the
// reviewed-reports fix: each visibly costs its product 15 points —
// productAdukeBlackSoapCleanser, productZuriPapayaEnzymePeel (thin
// evidence + the report together push it into "low"), and
// productOnyinyeBrighteningNightSerum (a revoked brand's already-thin
// record, now also under investigation — the clearest "genuinely weak,
// and here's why" case in the catalogue).

export const SEED_REPORTS: Report[] = [
  {
    id: "140f5126-ca74-4d3b-a162-eaa93881a5b3",
    productId: productAdukeBlackSoapCleanser.id,
    reporterContact: "concerned.shopper@example.com",
    description:
      "Bought two bars three weeks apart from different stores — the scent and lather are noticeably different between them. Might just be batch variation, but flagging it.",
    evidenceIds: [],
    status: "under_investigation",
    createdAt: "2026-08-02T10:00:00Z",
  },
  {
    id: "2141d160-3c17-448a-9834-f9988feab0d5",
    productId: productLagosGlowCitrusMuskMist.id,
    description: "Box was slightly crushed on arrival and the spray nozzle felt loose.",
    evidenceIds: [],
    status: "submitted",
    createdAt: "2026-08-10T19:20:00Z",
  },
  {
    id: "bf4642fb-00e4-4b18-8bf0-95f033c3e8fd",
    productId: productZuriPapayaEnzymePeel.id,
    reporterContact: "skincare.watch@example.com",
    description:
      "Two different batches purchased a month apart show visibly different peel texture — one gritty, one smooth. Possibly a formulation change, but worth checking against the declared formula.",
    evidenceIds: [],
    status: "under_investigation",
    createdAt: "2026-08-05T10:00:00Z",
  },
  {
    id: "b7e91f98-4cfc-4b45-ad32-e3bf9af35c70",
    productId: productOnyinyeBrighteningNightSerum.id,
    reporterContact: "worried.buyer@example.com",
    description:
      "Applied as directed for a week and developed a burning sensation and visible irritation — stopped use immediately. This needs to be looked at.",
    evidenceIds: [],
    status: "under_investigation",
    createdAt: "2026-08-12T09:00:00Z",
  },
  {
    id: "476a5e3b-3796-476a-8ed7-e377c3ffa184",
    productId: productLagosGlowSunsetAmberEDP.id,
    description: "Bottle arrived with an unusually light fill level compared to the stated volume.",
    evidenceIds: [],
    status: "resolved",
    resolution:
      "Investigated — confirmed within the manufacturer's normal fill-tolerance range. No formulation or authenticity issue found.",
    createdAt: "2026-07-20T13:00:00Z",
    resolvedAt: "2026-08-14T10:00:00Z",
  },
  {
    id: "48ddfe5e-fd91-4473-93b4-f23cc1014fd6",
    productId: productIfeomaSatinLipstickTerracotta.id,
    description: "This doesn't look like the shade I ordered online.",
    evidenceIds: [],
    status: "dismissed",
    resolution:
      "Investigated — the photo submitted was of a different brand's product, confirmed by the reporter after follow-up. No action needed on this listing.",
    createdAt: "2026-08-01T16:00:00Z",
    resolvedAt: "2026-08-11T09:00:00Z",
  },
  {
    id: "33ca407a-23f4-41b5-82ea-5830ade1d44e",
    productId: productOsazeMatteClayWax.id,
    description: "Packaging seal looked slightly different from my last purchase — probably nothing, just flagging.",
    evidenceIds: [],
    status: "submitted",
    createdAt: "2026-08-16T08:00:00Z",
  },
];

// ---- Events (derived, not hand-authored) --------------------------------
// eventLogStore.ts had no seed wiring before this — every other store
// already follows the `SEED_ENABLED ? [...SEED_X] : []` pattern, so this
// fills in the same gap rather than introducing a new one. Events are
// DERIVED from the arrays above (never hand-typed with their own ids) so
// every entityId here is guaranteed to reference a real seeded brand,
// product, retailer, or report — there's no way for this to drift out of
// sync with the data it's describing. This does not touch any store's
// functions or the trust engine; it only changes what eventLogStore.ts's
// array starts with, exactly like SEED_BRANDS does for brandStore.ts.
function buildSeedEvents(): EventLogEntry[] {
  const events: EventLogEntry[] = [];
  const brandById = new Map(SEED_BRANDS.map((b) => [b.id, b]));

  for (const brand of SEED_BRANDS) {
    events.push({
      id: crypto.randomUUID(),
      entityType: "brand",
      entityId: brand.id,
      action: "brand_registered",
      actorId: ACTOR.brandRep,
      actorRole: "brand",
      description: `${brand.name} submitted brand registration.`,
      createdAt: brand.createdAt,
    });
    if (brand.status !== "pending" && brand.status !== "draft") {
      // approved, suspended, or revoked — all passed through approval at some point.
      events.push({
        id: crypto.randomUUID(),
        entityType: "brand",
        entityId: brand.id,
        action: "brand_approved",
        actorId: ACTOR.admin,
        actorRole: "admin",
        description: `${brand.name} approved by admin.`,
        createdAt: brand.createdAt,
      });
    }
    if (brand.status === "suspended") {
      events.push({
        id: crypto.randomUUID(),
        entityType: "brand",
        entityId: brand.id,
        action: "brand_suspended",
        actorId: ACTOR.admin,
        actorRole: "admin",
        description: `${brand.name} suspended by admin.`,
        createdAt: brand.updatedAt,
      });
    }
    if (brand.status === "revoked") {
      events.push({
        id: crypto.randomUUID(),
        entityType: "brand",
        entityId: brand.id,
        action: "brand_revoked",
        actorId: ACTOR.admin,
        actorRole: "admin",
        description: `${brand.name} registration revoked by admin.`,
        createdAt: brand.updatedAt,
      });
    }
  }

  for (const product of SEED_PRODUCTS) {
    const brand = brandById.get(product.brandId);
    events.push({
      id: crypto.randomUUID(),
      entityType: "product",
      entityId: product.id,
      action: "product_created",
      actorId: ACTOR.brandRep,
      actorRole: "brand",
      description: `${product.name} created by ${brand?.name ?? "its brand"}.`,
      createdAt: product.createdAt,
    });
    if (product.status === "published") {
      events.push({
        id: crypto.randomUUID(),
        entityType: "product",
        entityId: product.id,
        action: "product_published",
        actorId: ACTOR.brandRep,
        actorRole: "brand",
        description: `${product.name} published and now publicly searchable.`,
        createdAt: product.updatedAt,
      });
    }
  }

  for (const retailer of SEED_RETAILERS) {
    events.push({
      id: crypto.randomUUID(),
      entityType: "retailer",
      entityId: retailer.id,
      action: "retailer_registered",
      actorId: ACTOR.retailerStaff,
      actorRole: "retailer",
      description: `${retailer.name} submitted retailer registration.`,
      createdAt: retailer.createdAt,
    });
    if (retailer.status === "approved") {
      events.push({
        id: crypto.randomUUID(),
        entityType: "retailer",
        entityId: retailer.id,
        action: "retailer_approved",
        actorId: ACTOR.admin,
        actorRole: "admin",
        description: `${retailer.name} approved by admin.`,
        createdAt: retailer.createdAt,
      });
    }
  }

  for (const report of SEED_REPORTS) {
    events.push({
      id: crypto.randomUUID(),
      entityType: "report",
      entityId: report.id,
      action: "report_filed",
      actorId: report.reporterContact ?? ACTOR.consumer,
      actorRole: "consumer",
      description: "Report filed against a product.",
      createdAt: report.createdAt,
    });
    if (report.status === "under_investigation") {
      events.push({
        id: crypto.randomUUID(),
        entityType: "report",
        entityId: report.id,
        action: "report_under_investigation",
        actorId: ACTOR.admin,
        actorRole: "admin",
        description: "Report moved to under investigation by admin.",
        createdAt: report.createdAt,
      });
    } else if (report.status === "resolved" || report.status === "dismissed") {
      events.push({
        id: crypto.randomUUID(),
        entityType: "report",
        entityId: report.id,
        action: report.status === "resolved" ? "report_resolved" : "report_dismissed",
        actorId: ACTOR.admin,
        actorRole: "admin",
        description: `Report ${report.status} by admin.`,
        createdAt: report.resolvedAt ?? report.createdAt,
      });
    }
  }

  return events.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export const SEED_EVENTS: EventLogEntry[] = buildSeedEvents();
