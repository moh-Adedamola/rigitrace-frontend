import type { Product, ProductVersion } from "@/lib/types/entities";

const products: Product[] = [];
const versions: ProductVersion[] = [];

export function listProducts(brandId?: string): Product[] {
  return brandId ? products.filter((p) => p.brandId === brandId) : products;
}

export function addProduct(product: Product): Product {
  products.push(product);
  return product;
}

export function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/**
 * Applies changes to a product but ALWAYS snapshots the pre-change state
 * into an append-only ProductVersion first — enforcing the PRD rule that
 * product history is never overwritten, structurally, not just by convention.
 */
export function updateProduct(
  id: string,
  changes: Partial<Product>,
  changeType: ProductVersion["changeType"],
  summary: string,
  actorId: string
): Product | undefined {
  const product = findProduct(id);
  if (!product) return undefined;

  versions.push({
    id: crypto.randomUUID(),
    productId: id,
    changeType,
    summary,
    snapshot: { ...product },
    createdAt: new Date().toISOString(),
    createdBy: actorId,
  });

  Object.assign(product, changes, { updatedAt: new Date().toISOString() });
  return product;
}

export function listProductVersions(productId: string): ProductVersion[] {
  return versions.filter((v) => v.productId === productId);
}