import type { Brand } from "@/lib/types/entities";
import { SEED_BRANDS, SEED_ENABLED } from "@/lib/mock/seedData";

/**
 * In-memory mock store — resets whenever the dev server restarts.
 * Stands in for a real database until the backend exists. Do not
 * reach for this pattern once a real API is available.
 *
 * Seeded with demo data at module init (see seedData.ts) so a fresh
 * serverless cold start always has something to demo, not an empty
 * store. Set NEXT_PUBLIC_SEED_DEMO_DATA=false to disable.
 */
const brands: Brand[] = SEED_ENABLED ? [...SEED_BRANDS] : [];

export function listBrands(status?: Brand["status"]): Brand[] {
  return status ? brands.filter((b) => b.status === status) : brands;
}

export function addBrand(brand: Brand): Brand {
  brands.push(brand);
  return brand;
}

export function findBrand(id: string): Brand | undefined {
  return brands.find((b) => b.id === id);
}

export function updateBrandStatus(id: string, status: Brand["status"]): Brand | undefined {
  const brand = findBrand(id);
  if (!brand) return undefined;
  brand.status = status;
  brand.updatedAt = new Date().toISOString();
  return brand;
}