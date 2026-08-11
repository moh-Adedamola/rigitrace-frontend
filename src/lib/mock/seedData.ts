import type { Brand, Evidence, Product, Report, Retailer, RetailerProductLink } from "@/lib/types/entities";

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
} as const;

// ---- Brands ------------------------------------------------------------
// 7 total: 5 approved, 1 pending (demoes the admin approval queue), 1
// suspended (demoes a brand losing trust independent of past evidence).

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

export const SEED_BRANDS: Brand[] = [
  brandAdukeNaturals,
  brandZuriSkinRituals,
  brandOsazeGrooming,
  brandEwaBotanicals,
  brandLagosGlowCosmetics,
  brandKanemHairLab,
  brandBrightIvorySkincare,
];

// ---- Products ------------------------------------------------------------
// 17 across skincare, haircare, makeup, fragrance, and personal care.
// Statuses land wherever the evidence below actually puts them — see the
// module doc comment. Kanem Hair Lab (pending) has none, since the real
// product route requires an approved brand; Bright Ivory (suspended) kept
// the one it published before suspension, which is the point of it.

const productAdukeRadianceCream: Product = {
  id: crypto.randomUUID(),
  brandId: brandAdukeNaturals.id,
  name: "Aduke Naturals Shea Butter Radiance Cream",
  category: "Skincare",
  barcode: "6156001112223",
  images: ["https://demo-assets.rigitrace-demo.internal/aduke-naturals/radiance-cream-1.jpg"],
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
  images: ["https://demo-assets.rigitrace-demo.internal/aduke-naturals/black-soap-cleanser-1.jpg"],
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
  images: ["https://demo-assets.rigitrace-demo.internal/zuri-skin-rituals/clay-face-mask-1.jpg"],
  status: "published",
  createdAt: "2026-05-22T10:00:00Z",
  updatedAt: "2026-05-22T10:00:00Z",
};

const productZuriRoseGlowToner: Product = {
  id: crypto.randomUUID(),
  brandId: brandZuriSkinRituals.id,
  name: "Zuri Skin Rituals Rose Glow Toner",
  category: "Skincare",
  images: ["https://demo-assets.rigitrace-demo.internal/zuri-skin-rituals/rose-glow-toner-1.jpg"],
  status: "published",
  createdAt: "2026-05-29T10:00:00Z",
  updatedAt: "2026-05-29T10:00:00Z",
};

const productOsazeBeardOil: Product = {
  id: crypto.randomUUID(),
  brandId: brandOsazeGrooming.id,
  name: "Osaze Grooming Co. Beard & Scalp Oil",
  category: "Personal Care",
  barcode: "6158003334452",
  images: ["https://demo-assets.rigitrace-demo.internal/osaze-grooming/beard-scalp-oil-1.jpg"],
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
  images: ["https://demo-assets.rigitrace-demo.internal/osaze-grooming/cocoa-pomade-1.jpg"],
  status: "published",
  createdAt: "2026-06-02T11:00:00Z",
  updatedAt: "2026-06-02T11:00:00Z",
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
  images: ["https://demo-assets.rigitrace-demo.internal/ewa-botanicals/braid-sheen-spray-1.jpg"],
  status: "published",
  createdAt: "2026-08-09T08:00:00Z",
  updatedAt: "2026-08-09T08:00:00Z",
};

const productLagosGlowLipstick: Product = {
  id: crypto.randomUUID(),
  brandId: brandLagosGlowCosmetics.id,
  name: "Lagos Glow Cosmetics Matte Liquid Lipstick — Ruby Coast",
  category: "Makeup",
  barcode: "6160005556674",
  images: ["https://demo-assets.rigitrace-demo.internal/lagos-glow/matte-lipstick-ruby-coast-1.jpg"],
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
  images: ["https://demo-assets.rigitrace-demo.internal/lagos-glow/ankara-bloom-edp-1.jpg"],
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

export const SEED_PRODUCTS: Product[] = [
  productAdukeRadianceCream,
  productAdukeBlackSoapCleanser,
  productAdukeCoconutSerum,
  productZuriVitaminCSerum,
  productZuriClayFaceMask,
  productZuriRoseGlowToner,
  productOsazeBeardOil,
  productOsazeCharcoalShampooBar,
  productOsazeCocoaPomade,
  productEwaMoringaHairButter,
  productEwaRiceWaterSpray,
  productEwaBraidSheenSpray,
  productLagosGlowLipstick,
  productLagosGlowFoundation,
  productLagosGlowAnkaraBloomEDP,
  productLagosGlowCitrusMuskMist,
  productBrightIvoryWhiteningCream,
];

// ---- Evidence --------------------------------------------------------
// Spread unevenly on purpose. `productEwaBraidSheenSpray` gets none at
// all — freshly registered, "not yet verified" — nothing else about its
// record implies a problem. `productAdukeRadianceCream` gets the richest,
// most diverse set, so it's the one worth pointing at as "this is what a
// well-evidenced product looks like."

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
];

// ---- Retailers -------------------------------------------------------
// 4, one of each type. NaijaGlowDeals is left pending so the admin
// retailer-approval queue has something in it too.

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

export const SEED_RETAILERS: Retailer[] = [
  retailerBalogunBeautyMart,
  retailerGlowMartNG,
  retailerCityMallBeautyCorner,
  retailerNaijaGlowDeals,
];

// ---- Retailer ↔ Product links -----------------------------------------
// Only approved retailers link, only to published products — mirrors what
// the real POST route would allow. NaijaGlowDeals (pending) has none yet.

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
];

// ---- Reports -----------------------------------------------------------
// One of each kind, deliberately: a "submitted" report that has NOT been
// reviewed yet (must NOT move a score — see calculateTrustScore.ts /
// reportStore.ts), and one moved to "under_investigation" by a person
// (the only kind that does move a score). This is the clearest possible
// demo of the reviewed-reports fix: the second one visibly costs
// productAdukeBlackSoapCleanser 15 points; the first costs
// productLagosGlowCitrusMuskMist nothing.

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
];
