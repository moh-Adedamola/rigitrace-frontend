import type { RetailerProductLink } from "@/lib/types/entities";
import { SEED_ENABLED, SEED_RETAILER_PRODUCT_LINKS } from "@/lib/mock/seedData";

// Seeded with demo data at module init — see seedData.ts.
const links: RetailerProductLink[] = SEED_ENABLED ? [...SEED_RETAILER_PRODUCT_LINKS] : [];

export function addLink(link: RetailerProductLink): RetailerProductLink {
  links.push(link);
  return link;
}

export function listLinksByProduct(
  productId: string,
  status?: RetailerProductLink["status"]
): RetailerProductLink[] {
  return links.filter((l) => l.productId === productId && (!status || l.status === status));
}