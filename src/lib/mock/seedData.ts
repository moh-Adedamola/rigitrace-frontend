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
  id: crypto.randomUUID(),
  name: "Aduke Naturals",
  registrationNumber: "RC1042871",
  contactEmail: "hello@adukenaturals.ng",
  contactPhone: "+234 803 214 7765",
  status: "approved",
  createdAt: "2026-05-04T09:00:00Z",
  updatedAt: "2026-05-11T10:30:00Z",
};

const brandZuriSkinRituals: Brand = {
  id: crypto.randomUUID(),
  name: "Zuri Skin Rituals",
  registrationNumber: "RC1088452",
  contactEmail: "team@zuriskinrituals.com",
  contactPhone: "+234 809 552 3310",
  status: "approved",
  createdAt: "2026-05-09T11:15:00Z",
  updatedAt: "2026-05-15T08:00:00Z",
};

const brandOsazeGrooming: Brand = {
  id: crypto.randomUUID(),
  name: "Osaze Grooming Co.",
  registrationNumber: "RC1071239",
  contactEmail: "contact@osazegrooming.ng",
  contactPhone: "+234 802 771 4498",
  status: "approved",
  createdAt: "2026-05-14T13:45:00Z",
  updatedAt: "2026-05-20T09:10:00Z",
};

const brandEwaBotanicals: Brand = {
  id: crypto.randomUUID(),
  name: "Ẹwà Botanicals",
  registrationNumber: "RC1095817",
  contactEmail: "info@ewabotanicals.com",
  contactPhone: "+234 810 663 2287",
  status: "approved",
  createdAt: "2026-05-20T10:00:00Z",
  updatedAt: "2026-05-26T14:20:00Z",
};

const brandLagosGlowCosmetics: Brand = {
  id: crypto.randomUUID(),
  name: "Lagos Glow Cosmetics",
  registrationNumber: "RC1063904",
  contactEmail: "support@lagosglowcosmetics.com",
  contactPhone: "+234 806 118 9945",
  status: "approved",
  createdAt: "2026-05-28T12:30:00Z",
  updatedAt: "2026-06-02T09:00:00Z",
};

const brandKanemHairLab: Brand = {
  id: crypto.randomUUID(),
  name: "Kanem Hair Lab",
  registrationNumber: "RC1103356",
  contactEmail: "hello@kanemhairlab.ng",
  contactPhone: "+234 813 405 7712",
  status: "pending",
  createdAt: "2026-08-06T15:00:00Z",
  updatedAt: "2026-08-06T15:00:00Z",
};

const brandBrightIvorySkincare: Brand = {
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Hibiscus Toning Mist",
  category: "Skincare",
  images: [],
  status: "published",
  createdAt: "2026-07-06T09:00:00Z",
  updatedAt: "2026-07-06T09:00:00Z",
};

const productAdukeBaobabRepairOil: Product = {
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Oatmeal Soap Bar",
  category: "Personal Care",
  images: [],
  status: "published",
  createdAt: "2026-07-20T09:00:00Z",
  updatedAt: "2026-07-20T09:00:00Z",
};

const productAdukeGreenTeaEyeCream: Product = {
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Rosewater Hydrating Mist",
  category: "Skincare",
  images: [],
  status: "published",
  createdAt: "2026-08-15T09:00:00Z",
  updatedAt: "2026-08-15T09:00:00Z",
};

const productZuriVitaminCSerum: Product = {
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
  brandId: brandZuriSkinRituals.id,
  name: "Zuri Skin Rituals Rose Glow Toner",
  category: "Skincare",
  images: [],
  status: "published",
  createdAt: "2026-05-29T10:00:00Z",
  updatedAt: "2026-05-29T10:00:00Z",
};

const productZuriRetinolNightRepairSerum: Product = {
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
  brandId: brandZuriSkinRituals.id,
  name: "Zuri Skin Rituals Papaya Enzyme Peel",
  category: "Skincare",
  images: [],
  status: "published",
  createdAt: "2026-06-26T10:00:00Z",
  updatedAt: "2026-06-26T10:00:00Z",
};

const productZuriCeramideBarrierCream: Product = {
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
  brandId: brandOsazeGrooming.id,
  name: "Osaze Grooming Co. Cocoa Pomade",
  category: "Haircare",
  images: [],
  status: "published",
  createdAt: "2026-06-02T11:00:00Z",
  updatedAt: "2026-06-02T11:00:00Z",
};

const productOsazeSandalwoodAftershaveBalm: Product = {
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
  brandId: brandEwaBotanicals.id,
  name: "Ẹwà Botanicals Rice Water Strengthening Spray",
  category: "Haircare",
  images: [],
  status: "published",
  createdAt: "2026-06-04T12:00:00Z",
  updatedAt: "2026-06-04T12:00:00Z",
};

const productEwaBraidSheenSpray: Product = {
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
  brandId: brandEwaBotanicals.id,
  name: "Ẹwà Botanicals Coconut Curl Cream",
  category: "Haircare",
  images: [],
  status: "published",
  createdAt: "2026-07-08T12:00:00Z",
  updatedAt: "2026-07-08T12:00:00Z",
};

const productLagosGlowLipstick: Product = {
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
  brandId: brandLagosGlowCosmetics.id,
  name: "Lagos Glow Cosmetics Ankara Bloom Eau de Parfum",
  category: "Fragrance",
  images: [],
  status: "published",
  createdAt: "2026-06-10T13:00:00Z",
  updatedAt: "2026-06-10T13:00:00Z",
};

const productLagosGlowCitrusMuskMist: Product = {
  id: crypto.randomUUID(),
  brandId: brandLagosGlowCosmetics.id,
  name: "Lagos Glow Cosmetics Citrus Musk Body Mist",
  category: "Fragrance",
  images: [],
  status: "published",
  createdAt: "2026-06-14T13:00:00Z",
  updatedAt: "2026-06-14T13:00:00Z",
};

const productLagosGlowCoralReefLipstick: Product = {
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
  brandId: brandLagosGlowCosmetics.id,
  name: "Lagos Glow Cosmetics Longwear Concealer",
  category: "Makeup",
  images: [],
  status: "published",
  createdAt: "2026-08-16T13:00:00Z",
  updatedAt: "2026-08-16T13:00:00Z",
};

const productBrightIvoryWhiteningCream: Product = {
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
  brandId: brandIfeomaBeautyStudio.id,
  name: "Ifeoma Beauty Studio Waterproof Eyeliner Pen",
  category: "Makeup",
  images: [],
  status: "published",
  createdAt: "2026-07-23T10:00:00Z",
  updatedAt: "2026-07-23T10:00:00Z",
};

const productIfeomaVolumizingMascara: Product = {
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
  brandId: brandAdaezeParfumHouse.id,
  name: "Adaeze Parfum House Ylang Bloom Eau de Toilette",
  category: "Fragrance",
  images: [],
  status: "published",
  createdAt: "2026-07-15T11:00:00Z",
  updatedAt: "2026-07-15T11:00:00Z",
};

const productAdaezeMuskOudBodySpray: Product = {
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
    productId: productAdukeRadianceCream.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and full ingredient declaration, NAFDAC reg. no. A7-8842.",
    createdAt: "2026-05-12T09:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productAdukeRadianceCream.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description:
      "Certificate of analysis from the contract manufacturer confirming batch composition matches the declared formula.",
    createdAt: "2026-05-14T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productAdukeRadianceCream.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms stock is sourced directly from Aduke Naturals, not a secondary distributor.",
    createdAt: "2026-05-20T14:30:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productAdukeRadianceCream.id,
    source: "regulator",
    submittedBy: ACTOR.regulator,
    description: "NAFDAC registration status confirmed current and in good standing as of this evidence date.",
    createdAt: "2026-06-01T10:00:00Z",
  },

  // Aduke Naturals — Black Soap Cleanser: 2 pieces, 2 sources. Carries
  // the report under investigation — see SEED_REPORTS.
  {
    id: crypto.randomUUID(),
    productId: productAdukeBlackSoapCleanser.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8850.",
    createdAt: "2026-05-18T09:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productAdukeBlackSoapCleanser.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-06-03T16:00:00Z",
  },

  // Aduke Naturals — Coconut Hydration Serum: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productAdukeCoconutSerum.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8861.",
    createdAt: "2026-05-25T09:15:00Z",
  },

  // Aduke Naturals — Turmeric Glow Mask: 3 pieces, 3 sources.
  {
    id: crypto.randomUUID(),
    productId: productAdukeTurmericGlowMask.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8872.",
    createdAt: "2026-06-08T09:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productAdukeTurmericGlowMask.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description:
      "Certificate of analysis from the contract manufacturer confirming batch composition matches the declared formula.",
    createdAt: "2026-06-11T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productAdukeTurmericGlowMask.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-06-20T15:00:00Z",
  },

  // Aduke Naturals — Aloe Vera Soothing Gel: 2 pieces, 2 sources.
  {
    id: crypto.randomUUID(),
    productId: productAdukeAloeVeraSoothingGel.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8879.",
    createdAt: "2026-06-15T09:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productAdukeAloeVeraSoothingGel.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms stock is sourced directly from Aduke Naturals, not a secondary distributor.",
    createdAt: "2026-06-25T14:00:00Z",
  },

  // Aduke Naturals — Cocoa Butter Body Cream: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productAdukeCocoaButterBodyCream.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8886.",
    createdAt: "2026-06-22T09:15:00Z",
  },

  // Aduke Naturals — Charcoal Detox Scrub: 3 pieces, 2 sources.
  {
    id: crypto.randomUUID(),
    productId: productAdukeCharcoalDetoxScrub.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8893.",
    createdAt: "2026-06-29T09:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productAdukeCharcoalDetoxScrub.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Updated certificate of analysis after a stability re-test of the current formula.",
    createdAt: "2026-07-20T09:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productAdukeCharcoalDetoxScrub.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-07-10T15:00:00Z",
  },

  // Aduke Naturals — Hibiscus Toning Mist: 2 pieces, 2 sources.
  {
    id: crypto.randomUUID(),
    productId: productAdukeHibiscusToningMist.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8901.",
    createdAt: "2026-07-06T09:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productAdukeHibiscusToningMist.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-07-18T15:00:00Z",
  },

  // Aduke Naturals — Baobab Repair Oil: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productAdukeBaobabRepairOil.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8908.",
    createdAt: "2026-07-13T09:15:00Z",
  },

  // Aduke Naturals — Oatmeal Soap Bar: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productAdukeOatmealSoapBar.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8915.",
    createdAt: "2026-07-20T09:15:00Z",
  },

  // Aduke Naturals — Green Tea Eye Cream: 2 pieces, 1 source (brand twice).
  {
    id: crypto.randomUUID(),
    productId: productAdukeGreenTeaEyeCream.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. A7-8922.",
    createdAt: "2026-07-27T09:15:00Z",
  },
  {
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
    productId: productZuriVitaminCSerum.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. Z2-1140.",
    createdAt: "2026-05-16T10:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productZuriVitaminCSerum.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Updated certificate of analysis after a stability re-test of the current formula.",
    createdAt: "2026-06-20T10:15:00Z",
  },

  // Zuri Skin Rituals — Clay Face Mask: 2 pieces, 2 sources.
  {
    id: crypto.randomUUID(),
    productId: productZuriClayFaceMask.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. Z2-1157.",
    createdAt: "2026-05-22T10:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productZuriClayFaceMask.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms consistent stock sourced directly from Zuri Skin Rituals since launch.",
    createdAt: "2026-06-05T14:00:00Z",
  },

  // Zuri Skin Rituals — Rose Glow Toner: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productZuriRoseGlowToner.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. Z2-1163.",
    createdAt: "2026-05-29T10:15:00Z",
  },

  // Zuri Skin Rituals — Retinol Night Repair Serum: 2 pieces, 2 sources.
  {
    id: crypto.randomUUID(),
    productId: productZuriRetinolNightRepairSerum.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. Z2-1178.",
    createdAt: "2026-06-12T10:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productZuriRetinolNightRepairSerum.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description: "Certificate of analysis confirming retinol concentration matches the declared formula.",
    createdAt: "2026-06-24T11:00:00Z",
  },

  // Zuri Skin Rituals — Niacinamide Pore Refining Gel: 3 pieces, 3 sources.
  {
    id: crypto.randomUUID(),
    productId: productZuriNiacinamidePoreRefiningGel.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. Z2-1185.",
    createdAt: "2026-06-19T10:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productZuriNiacinamidePoreRefiningGel.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms consistent stock sourced directly from Zuri Skin Rituals since launch.",
    createdAt: "2026-07-01T14:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productZuriNiacinamidePoreRefiningGel.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-07-08T15:00:00Z",
  },

  // Zuri Skin Rituals — Papaya Enzyme Peel: 1 piece, brand-only. Carries
  // the second under-investigation report — see SEED_REPORTS.
  {
    id: crypto.randomUUID(),
    productId: productZuriPapayaEnzymePeel.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. Z2-1192.",
    createdAt: "2026-06-26T10:15:00Z",
  },

  // Zuri Skin Rituals — Ceramide Barrier Cream: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productZuriCeramideBarrierCream.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. Z2-1199.",
    createdAt: "2026-07-03T10:15:00Z",
  },

  // Osaze Grooming Co. — Beard & Scalp Oil: 2 pieces, 2 sources.
  {
    id: crypto.randomUUID(),
    productId: productOsazeBeardOil.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. O5-2231.",
    createdAt: "2026-05-21T11:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productOsazeBeardOil.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description: "Certificate of analysis confirming carrier and essential oil ratios match the declared formula.",
    createdAt: "2026-06-08T11:00:00Z",
  },

  // Osaze Grooming Co. — Charcoal Shampoo Bar: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productOsazeCharcoalShampooBar.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. O5-2248.",
    createdAt: "2026-05-27T11:15:00Z",
  },

  // Osaze Grooming Co. — Cocoa Pomade: 2 pieces, 2 sources.
  {
    id: crypto.randomUUID(),
    productId: productOsazeCocoaPomade.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. O5-2255.",
    createdAt: "2026-06-02T11:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productOsazeCocoaPomade.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-06-19T15:00:00Z",
  },

  // Osaze Grooming Co. — Sandalwood Aftershave Balm: 2 pieces, 2 sources.
  {
    id: crypto.randomUUID(),
    productId: productOsazeSandalwoodAftershaveBalm.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. O5-2262.",
    createdAt: "2026-06-09T11:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productOsazeSandalwoodAftershaveBalm.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description: "Certificate of analysis confirming fragrance and carrier ratios match the declared formula.",
    createdAt: "2026-06-21T11:00:00Z",
  },

  // Osaze Grooming Co. — Clarifying Scalp Tonic: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productOsazeClarifyingScalpTonic.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. O5-2269.",
    createdAt: "2026-06-16T11:15:00Z",
  },

  // Osaze Grooming Co. — Matte Clay Wax: 1 piece, brand-only. Carries a
  // freshly filed, unreviewed report — see SEED_REPORTS.
  {
    id: crypto.randomUUID(),
    productId: productOsazeMatteClayWax.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. O5-2276.",
    createdAt: "2026-06-23T11:15:00Z",
  },

  // Ẹwà Botanicals — Moringa Hair Butter: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productEwaMoringaHairButter.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. E9-3312.",
    createdAt: "2026-05-30T12:15:00Z",
  },

  // Ẹwà Botanicals — Rice Water Strengthening Spray: 2 pieces, 2 sources.
  {
    id: crypto.randomUUID(),
    productId: productEwaRiceWaterSpray.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. E9-3329.",
    createdAt: "2026-06-04T12:15:00Z",
  },
  {
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
    productId: productEwaCastorOilGrowthSerum.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. E9-3336.",
    createdAt: "2026-07-01T12:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productEwaCastorOilGrowthSerum.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-07-14T15:00:00Z",
  },

  // Ẹwà Botanicals — Coconut Curl Cream: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productEwaCoconutCurlCream.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. E9-3343.",
    createdAt: "2026-07-08T12:15:00Z",
  },

  // Lagos Glow Cosmetics — Matte Liquid Lipstick: 2 pieces, 2 sources.
  {
    id: crypto.randomUUID(),
    productId: productLagosGlowLipstick.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4471.",
    createdAt: "2026-06-01T13:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productLagosGlowLipstick.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms consistent stock sourced directly from Lagos Glow Cosmetics since launch.",
    createdAt: "2026-06-16T14:45:00Z",
  },

  // Lagos Glow Cosmetics — Dewy Finish Foundation: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productLagosGlowFoundation.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4488.",
    createdAt: "2026-06-06T13:15:00Z",
  },

  // Lagos Glow Cosmetics — Ankara Bloom Eau de Parfum: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productLagosGlowAnkaraBloomEDP.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4495.",
    createdAt: "2026-06-10T13:15:00Z",
  },

  // Lagos Glow Cosmetics — Citrus Musk Body Mist: 1 piece, brand-only.
  // Carries the unreviewed, "submitted" report — see SEED_REPORTS.
  {
    id: crypto.randomUUID(),
    productId: productLagosGlowCitrusMuskMist.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4502.",
    createdAt: "2026-06-14T13:15:00Z",
  },

  // Lagos Glow Cosmetics — Velvet Matte Lipstick, Coral Reef: 2 pieces, 2 sources.
  {
    id: crypto.randomUUID(),
    productId: productLagosGlowCoralReefLipstick.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4509.",
    createdAt: "2026-06-20T13:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productLagosGlowCoralReefLipstick.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms consistent stock sourced directly from Lagos Glow Cosmetics since launch.",
    createdAt: "2026-07-02T14:45:00Z",
  },

  // Lagos Glow Cosmetics — HD Setting Powder: 3 pieces, 2 sources.
  {
    id: crypto.randomUUID(),
    productId: productLagosGlowHDSettingPowder.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4516.",
    createdAt: "2026-06-27T13:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productLagosGlowHDSettingPowder.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Updated certificate of analysis after a stability re-test of the current formula.",
    createdAt: "2026-07-25T13:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productLagosGlowHDSettingPowder.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms consistent stock sourced directly from Lagos Glow Cosmetics since launch.",
    createdAt: "2026-07-10T14:45:00Z",
  },

  // Lagos Glow Cosmetics — Brow Definer Pencil: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productLagosGlowBrowDefinerPencil.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4523.",
    createdAt: "2026-07-04T13:15:00Z",
  },

  // Lagos Glow Cosmetics — Sunset Amber Eau de Parfum: 1 piece, brand-only.
  // Carries a resolved report — see SEED_REPORTS.
  {
    id: crypto.randomUUID(),
    productId: productLagosGlowSunsetAmberEDP.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4530.",
    createdAt: "2026-07-11T13:15:00Z",
  },

  // Lagos Glow Cosmetics — Jasmine Rain Body Mist: 2 pieces, 1 source
  // (brand twice).
  {
    id: crypto.randomUUID(),
    productId: productLagosGlowJasmineRainBodyMist.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. L4-4537.",
    createdAt: "2026-07-18T13:15:00Z",
  },
  {
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
    productId: productBrightIvoryEvenToneBodyLotion.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. B1-0098.",
    createdAt: "2026-05-19T09:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productBrightIvoryEvenToneBodyLotion.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-06-02T15:00:00Z",
  },

  // Ifeoma Beauty Studio — Matte Setting Powder: 2 pieces, 2 sources.
  {
    id: crypto.randomUUID(),
    productId: productIfeomaMatteSettingPowder.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. I3-1004.",
    createdAt: "2026-06-26T10:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productIfeomaMatteSettingPowder.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description: "Certificate of analysis from the contract manufacturer confirming batch composition matches the declared formula.",
    createdAt: "2026-07-08T11:00:00Z",
  },

  // Ifeoma Beauty Studio — Liquid Foundation, Deep Amber: 3 pieces, 3 sources.
  {
    id: crypto.randomUUID(),
    productId: productIfeomaLiquidFoundationDeepAmber.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. I3-1011.",
    createdAt: "2026-07-02T10:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productIfeomaLiquidFoundationDeepAmber.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms consistent stock sourced directly from Ifeoma Beauty Studio since launch.",
    createdAt: "2026-07-16T14:45:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productIfeomaLiquidFoundationDeepAmber.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-07-22T15:00:00Z",
  },

  // Ifeoma Beauty Studio — Creamy Concealer: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productIfeomaCreamyConcealer.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. I3-1018.",
    createdAt: "2026-07-09T10:15:00Z",
  },

  // Ifeoma Beauty Studio — Baked Highlighter Duo: 2 pieces, 2 sources.
  {
    id: crypto.randomUUID(),
    productId: productIfeomaBakedHighlighterDuo.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. I3-1025.",
    createdAt: "2026-07-16T10:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productIfeomaBakedHighlighterDuo.id,
    source: "retailer",
    submittedBy: ACTOR.retailerStaff,
    description: "Retailer confirms consistent stock sourced directly from Ifeoma Beauty Studio since launch.",
    createdAt: "2026-07-30T14:45:00Z",
  },

  // Ifeoma Beauty Studio — Waterproof Eyeliner Pen: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productIfeomaWaterproofEyelinerPen.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. I3-1032.",
    createdAt: "2026-07-23T10:15:00Z",
  },

  // Ifeoma Beauty Studio — Volumizing Mascara: 2 pieces, 1 source (brand twice).
  {
    id: crypto.randomUUID(),
    productId: productIfeomaVolumizingMascara.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. I3-1039.",
    createdAt: "2026-07-30T10:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productIfeomaVolumizingMascara.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Updated certificate of analysis after a stability re-test of the current formula.",
    createdAt: "2026-08-13T10:15:00Z",
  },

  // Ifeoma Beauty Studio — Satin Lipstick, Terracotta: 1 piece, brand-only.
  // Carries a dismissed report — see SEED_REPORTS.
  {
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
    productId: productAdaezeAmberNightsEDP.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. D6-2207.",
    createdAt: "2026-07-08T11:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productAdaezeAmberNightsEDP.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description: "Certificate of analysis from the contract manufacturer confirming batch composition matches the declared formula.",
    createdAt: "2026-07-20T11:00:00Z",
  },

  // Adaeze Parfum House — Ylang Bloom Eau de Toilette: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
    productId: productAdaezeYlangBloomEDT.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. D6-2214.",
    createdAt: "2026-07-15T11:15:00Z",
  },

  // Adaeze Parfum House — Musk & Oud Body Spray: 1 piece, brand-only.
  {
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
    productId: productOnyinyeInstantGlowBodyCream.id,
    source: "brand",
    submittedBy: ACTOR.brandRep,
    description: "Product registration and ingredient declaration, NAFDAC reg. no. G8-0550.",
    createdAt: "2026-04-18T09:15:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productOnyinyeInstantGlowBodyCream.id,
    source: "manufacturer",
    submittedBy: ACTOR.manufacturer,
    description: "Certificate of analysis from the contract manufacturer confirming batch composition matches the declared formula.",
    createdAt: "2026-04-29T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productOnyinyeInstantGlowBodyCream.id,
    source: "consumer",
    submittedBy: ACTOR.consumer,
    description: "Consumer submitted packaging photos matching the official listing after a verified purchase.",
    createdAt: "2026-05-10T15:00:00Z",
  },

  // Onyinye Glow Essentials — Brightening Night Serum: 1 piece, brand-only.
  // Carries the third under-investigation report — see SEED_REPORTS.
  {
    id: crypto.randomUUID(),
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
  id: crypto.randomUUID(),
  name: "Balogun Beauty Mart",
  type: "physical_store",
  status: "approved",
  contactEmail: "orders@balogunbeautymart.ng",
  createdAt: "2026-05-15T09:00:00Z",
};

const retailerGlowMartNG: Retailer = {
  id: crypto.randomUUID(),
  name: "GlowMart NG",
  type: "online_store",
  status: "approved",
  contactEmail: "support@glowmart.ng",
  createdAt: "2026-05-19T09:00:00Z",
};

const retailerCityMallBeautyCorner: Retailer = {
  id: crypto.randomUUID(),
  name: "CityMall Beauty Corner",
  type: "marketplace",
  status: "approved",
  contactEmail: "hello@citymallbeauty.ng",
  createdAt: "2026-05-24T09:00:00Z",
};

const retailerNaijaGlowDeals: Retailer = {
  id: crypto.randomUUID(),
  name: "NaijaGlowDeals",
  type: "social_commerce",
  status: "pending",
  contactEmail: "naijaglowdeals@gmail.com",
  createdAt: "2026-08-08T09:00:00Z",
};

const retailerAlabaBeautyEmporium: Retailer = {
  id: crypto.randomUUID(),
  name: "Alaba Beauty Emporium",
  type: "physical_store",
  status: "approved",
  contactEmail: "sales@alababeautyemporium.ng",
  createdAt: "2026-06-10T09:00:00Z",
};

const retailerAbujaGlowBoutique: Retailer = {
  id: crypto.randomUUID(),
  name: "Abuja Glow Boutique",
  type: "physical_store",
  status: "approved",
  contactEmail: "hello@abujaglowboutique.ng",
  createdAt: "2026-06-24T09:00:00Z",
};

const retailerShopNaijaBeauty: Retailer = {
  id: crypto.randomUUID(),
  name: "ShopNaija Beauty",
  type: "online_store",
  status: "approved",
  contactEmail: "orders@shopnaijabeauty.com",
  createdAt: "2026-07-05T09:00:00Z",
};

const retailerMarketSquareBeautyHub: Retailer = {
  id: crypto.randomUUID(),
  name: "MarketSquare Beauty Hub",
  type: "marketplace",
  status: "approved",
  contactEmail: "hub@marketsquarebeauty.ng",
  createdAt: "2026-07-19T09:00:00Z",
};

const retailerBeautyDeals247: Retailer = {
  id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
    retailerId: retailerBalogunBeautyMart.id,
    productId: productAdukeRadianceCream.id,
    status: "verified",
    createdAt: "2026-05-25T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerBalogunBeautyMart.id,
    productId: productAdukeBlackSoapCleanser.id,
    status: "verified",
    createdAt: "2026-05-25T10:05:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerBalogunBeautyMart.id,
    productId: productOsazeBeardOil.id,
    status: "verified",
    createdAt: "2026-06-09T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerBalogunBeautyMart.id,
    productId: productLagosGlowLipstick.id,
    status: "verified",
    createdAt: "2026-06-17T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerGlowMartNG.id,
    productId: productAdukeRadianceCream.id,
    status: "verified",
    createdAt: "2026-05-26T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerGlowMartNG.id,
    productId: productZuriVitaminCSerum.id,
    status: "verified",
    createdAt: "2026-05-30T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerGlowMartNG.id,
    productId: productZuriClayFaceMask.id,
    status: "verified",
    createdAt: "2026-06-06T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerGlowMartNG.id,
    productId: productOsazeCocoaPomade.id,
    status: "verified",
    createdAt: "2026-06-20T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerGlowMartNG.id,
    productId: productLagosGlowFoundation.id,
    status: "verified",
    createdAt: "2026-06-07T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerCityMallBeautyCorner.id,
    productId: productAdukeCoconutSerum.id,
    status: "verified",
    createdAt: "2026-06-01T12:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerCityMallBeautyCorner.id,
    productId: productEwaMoringaHairButter.id,
    status: "verified",
    createdAt: "2026-06-05T12:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerCityMallBeautyCorner.id,
    productId: productLagosGlowAnkaraBloomEDP.id,
    status: "verified",
    createdAt: "2026-06-12T12:00:00Z",
  },

  // -- New retailer coverage, added alongside the catalogue expansion.
  // Balogun Beauty Mart
  {
    id: crypto.randomUUID(),
    retailerId: retailerBalogunBeautyMart.id,
    productId: productAdukeTurmericGlowMask.id,
    status: "verified",
    createdAt: "2026-06-20T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerBalogunBeautyMart.id,
    productId: productZuriRetinolNightRepairSerum.id,
    status: "verified",
    createdAt: "2026-06-25T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerBalogunBeautyMart.id,
    productId: productIfeomaMatteSettingPowder.id,
    status: "verified",
    createdAt: "2026-07-05T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerBalogunBeautyMart.id,
    productId: productIfeomaLiquidFoundationDeepAmber.id,
    status: "verified",
    createdAt: "2026-07-10T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerBalogunBeautyMart.id,
    productId: productAdaezeAmberNightsEDP.id,
    status: "verified",
    createdAt: "2026-07-15T10:00:00Z",
  },

  // GlowMart NG
  {
    id: crypto.randomUUID(),
    retailerId: retailerGlowMartNG.id,
    productId: productAdukeAloeVeraSoothingGel.id,
    status: "verified",
    createdAt: "2026-06-22T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerGlowMartNG.id,
    productId: productZuriNiacinamidePoreRefiningGel.id,
    status: "verified",
    createdAt: "2026-06-28T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerGlowMartNG.id,
    productId: productEwaCastorOilGrowthSerum.id,
    status: "verified",
    createdAt: "2026-07-10T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerGlowMartNG.id,
    productId: productLagosGlowCoralReefLipstick.id,
    status: "verified",
    createdAt: "2026-07-02T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerGlowMartNG.id,
    productId: productIfeomaBakedHighlighterDuo.id,
    status: "verified",
    createdAt: "2026-07-25T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerGlowMartNG.id,
    productId: productAdaezeMuskOudBodySpray.id,
    status: "verified",
    createdAt: "2026-08-01T11:00:00Z",
  },

  // CityMall Beauty Corner
  {
    id: crypto.randomUUID(),
    retailerId: retailerCityMallBeautyCorner.id,
    productId: productOsazeSandalwoodAftershaveBalm.id,
    status: "verified",
    createdAt: "2026-06-16T12:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerCityMallBeautyCorner.id,
    productId: productLagosGlowHDSettingPowder.id,
    status: "verified",
    createdAt: "2026-07-05T12:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerCityMallBeautyCorner.id,
    productId: productIfeomaCreamyConcealer.id,
    status: "verified",
    createdAt: "2026-07-18T12:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerCityMallBeautyCorner.id,
    productId: productZuriCeramideBarrierCream.id,
    status: "verified",
    createdAt: "2026-07-10T12:00:00Z",
  },

  // Alaba Beauty Emporium
  {
    id: crypto.randomUUID(),
    retailerId: retailerAlabaBeautyEmporium.id,
    productId: productAdukeCharcoalDetoxScrub.id,
    status: "verified",
    createdAt: "2026-07-03T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerAlabaBeautyEmporium.id,
    productId: productAdukeCocoaButterBodyCream.id,
    status: "verified",
    createdAt: "2026-06-28T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerAlabaBeautyEmporium.id,
    productId: productOsazeCharcoalShampooBar.id,
    status: "verified",
    createdAt: "2026-06-15T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerAlabaBeautyEmporium.id,
    productId: productZuriRoseGlowToner.id,
    status: "verified",
    createdAt: "2026-06-18T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerAlabaBeautyEmporium.id,
    productId: productLagosGlowLipstick.id,
    status: "verified",
    createdAt: "2026-06-30T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerAlabaBeautyEmporium.id,
    productId: productIfeomaVolumizingMascara.id,
    status: "verified",
    createdAt: "2026-08-05T10:00:00Z",
  },

  // Abuja Glow Boutique
  {
    id: crypto.randomUUID(),
    retailerId: retailerAbujaGlowBoutique.id,
    productId: productAdukeBaobabRepairOil.id,
    status: "verified",
    createdAt: "2026-07-20T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerAbujaGlowBoutique.id,
    productId: productEwaMoringaHairButter.id,
    status: "verified",
    createdAt: "2026-07-01T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerAbujaGlowBoutique.id,
    productId: productOsazeMatteClayWax.id,
    status: "verified",
    createdAt: "2026-07-05T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerAbujaGlowBoutique.id,
    productId: productIfeomaSatinLipstickTerracotta.id,
    status: "verified",
    createdAt: "2026-08-12T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerAbujaGlowBoutique.id,
    productId: productAdukeRadianceCream.id,
    status: "verified",
    createdAt: "2026-07-01T10:00:00Z",
  },

  // ShopNaija Beauty
  {
    id: crypto.randomUUID(),
    retailerId: retailerShopNaijaBeauty.id,
    productId: productZuriVitaminCSerum.id,
    status: "verified",
    createdAt: "2026-07-12T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerShopNaijaBeauty.id,
    productId: productEwaRiceWaterSpray.id,
    status: "verified",
    createdAt: "2026-07-15T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerShopNaijaBeauty.id,
    productId: productLagosGlowFoundation.id,
    status: "verified",
    createdAt: "2026-07-18T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerShopNaijaBeauty.id,
    productId: productLagosGlowSunsetAmberEDP.id,
    status: "verified",
    createdAt: "2026-07-22T11:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerShopNaijaBeauty.id,
    productId: productAdaezeYlangBloomEDT.id,
    status: "verified",
    createdAt: "2026-07-28T11:00:00Z",
  },

  // MarketSquare Beauty Hub
  {
    id: crypto.randomUUID(),
    retailerId: retailerMarketSquareBeautyHub.id,
    productId: productOsazeBeardOil.id,
    status: "verified",
    createdAt: "2026-07-25T12:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerMarketSquareBeautyHub.id,
    productId: productLagosGlowCitrusMuskMist.id,
    status: "verified",
    createdAt: "2026-07-28T12:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerMarketSquareBeautyHub.id,
    productId: productZuriClayFaceMask.id,
    status: "verified",
    createdAt: "2026-08-02T12:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    retailerId: retailerMarketSquareBeautyHub.id,
    productId: productIfeomaWaterproofEyelinerPen.id,
    status: "verified",
    createdAt: "2026-08-06T12:00:00Z",
  },
  {
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
    productId: productAdukeBlackSoapCleanser.id,
    reporterContact: "concerned.shopper@example.com",
    description:
      "Bought two bars three weeks apart from different stores — the scent and lather are noticeably different between them. Might just be batch variation, but flagging it.",
    evidenceIds: [],
    status: "under_investigation",
    createdAt: "2026-08-02T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productLagosGlowCitrusMuskMist.id,
    description: "Box was slightly crushed on arrival and the spray nozzle felt loose.",
    evidenceIds: [],
    status: "submitted",
    createdAt: "2026-08-10T19:20:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productZuriPapayaEnzymePeel.id,
    reporterContact: "skincare.watch@example.com",
    description:
      "Two different batches purchased a month apart show visibly different peel texture — one gritty, one smooth. Possibly a formulation change, but worth checking against the declared formula.",
    evidenceIds: [],
    status: "under_investigation",
    createdAt: "2026-08-05T10:00:00Z",
  },
  {
    id: crypto.randomUUID(),
    productId: productOnyinyeBrighteningNightSerum.id,
    reporterContact: "worried.buyer@example.com",
    description:
      "Applied as directed for a week and developed a burning sensation and visible irritation — stopped use immediately. This needs to be looked at.",
    evidenceIds: [],
    status: "under_investigation",
    createdAt: "2026-08-12T09:00:00Z",
  },
  {
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
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
    id: crypto.randomUUID(),
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
