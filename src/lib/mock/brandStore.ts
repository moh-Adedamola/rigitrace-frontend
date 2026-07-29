import type { Brand } from "@/lib/types/entities";

/**
 * In-memory mock store — resets whenever the dev server restarts.
 * Stands in for a real database until the backend exists. Do not
 * reach for this pattern once a real API is available.
 */
const brands: Brand[] = [];

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