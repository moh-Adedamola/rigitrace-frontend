import type { Retailer } from "@/lib/types/entities";
import { SEED_ENABLED, SEED_RETAILERS } from "@/lib/mock/seedData";

// Seeded with demo data at module init — see seedData.ts.
const retailers: Retailer[] = SEED_ENABLED ? [...SEED_RETAILERS] : [];

export function listRetailers(status?: Retailer["status"]): Retailer[] {
  return status ? retailers.filter((r) => r.status === status) : retailers;
}

export function addRetailer(retailer: Retailer): Retailer {
  retailers.push(retailer);
  return retailer;
}

export function findRetailer(id: string): Retailer | undefined {
  return retailers.find((r) => r.id === id);
}

export function updateRetailerStatus(id: string, status: Retailer["status"]): Retailer | undefined {
  const retailer = findRetailer(id);
  if (!retailer) return undefined;
  retailer.status = status;
  return retailer;
}