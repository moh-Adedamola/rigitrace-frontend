import type { RetailerProductLink } from "@/lib/types/entities";

const links: RetailerProductLink[] = [];

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