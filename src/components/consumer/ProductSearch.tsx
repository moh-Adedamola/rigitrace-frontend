"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TrustBadgeSummary } from "@/components/trust/TrustBadge";
import { ProductImage } from "@/components/product/ProductImage";
import { apiFetch } from "@/lib/api/client";
import type { Brand, Product, TrustScore } from "@/lib/types/entities";

interface ListResponse<T> {
  data: T[];
}

interface SearchResultItem extends Product {
  brandName?: string;
  trustScore?: TrustScore;
}

/**
 * Enriches search results with brand name + trust status so the list
 * demonstrates the product's core promise, not just a name and category.
 * One request for every brand (cheaper than N single-brand lookups — no
 * such endpoint exists anyway) plus one trust-score request per result,
 * fired together via Promise.all/allSettled rather than awaited one at a
 * time, so this never waterfalls. Best-effort: if enrichment fails, the
 * bare product list still renders rather than showing nothing.
 */
async function enrichResults(products: Product[]): Promise<SearchResultItem[]> {
  if (products.length === 0) return [];
  try {
    const [brandsRes, trustSettled] = await Promise.all([
      apiFetch<ListResponse<Brand>>("/api/v1/brands"),
      Promise.allSettled(
        products.map((p) => apiFetch<TrustScore>(`/api/v1/products/${p.id}/trust-score`))
      ),
    ]);
    const brandNameById = new Map(brandsRes.data.map((b) => [b.id, b.name]));
    return products.map((p, i) => {
      const settled = trustSettled[i];
      return {
        ...p,
        brandName: brandNameById.get(p.brandId),
        trustScore: settled.status === "fulfilled" ? settled.value : undefined,
      };
    });
  } catch {
    return products.map((p) => ({ ...p }));
  }
}

interface ProductSearchProps {
  /**
   * "hero" is the homepage treatment — a bigger field and button, since
   * this is the first thing a visitor meets and the whole promise of the
   * product. Omit this prop (or pass "default") and the output is exactly
   * what it always was, so /verify's own search is untouched by this.
   */
  size?: "default" | "hero";
}

export function ProductSearch({ size = "default" }: ProductSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResultItem[] | null>(null);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    setResults(null);
    try {
      const res = await apiFetch<ListResponse<Product>>(
        `/api/v1/verify?query=${encodeURIComponent(query.trim())}`
      );
      if (res.data.length === 1) {
        // Exactly one match — verifying should take seconds, not an extra
        // click through a results list of one.
        router.push(`/verify/${res.data[0].id}`);
        return;
      }
      setResults(await enrichResults(res.data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  const isHero = size === "hero";

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={handleSearch} className={isHero ? "flex gap-3" : "flex gap-2"}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Product name or barcode…"
          className={isHero ? "h-12 text-base sm:h-14 sm:text-lg" : undefined}
        />
        <Button
          type="submit"
          disabled={searching}
          className={isHero ? "h-12 shrink-0 px-6 text-base sm:h-14 sm:px-8 sm:text-lg" : undefined}
        >
          {searching ? "Searching…" : "Verify"}
        </Button>
      </form>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      {results !== null && results.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          No matching published product found. This could mean the product isn&apos;t
          registered on RigiTrace yet, or the name/barcode doesn&apos;t match exactly.
        </p>
      )}

      {results !== null && results.length > 1 && (
        <ul className="mt-4 space-y-2">
          {results.map((product) => (
            <li key={product.id}>
              <Link
                href={`/verify/${product.id}`}
                className="flex gap-3 rounded-lg border border-border bg-card p-3 text-left text-sm text-foreground hover:border-primary"
              >
                <ProductImage
                  images={product.images}
                  category={product.category}
                  name={product.name}
                  className="h-12 w-12 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium">{product.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{product.category}</span>
                  </div>
                  {product.brandName && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{product.brandName}</p>
                  )}
                  {product.trustScore && (
                    <div className="mt-2">
                      <TrustBadgeSummary trustScore={product.trustScore} />
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}