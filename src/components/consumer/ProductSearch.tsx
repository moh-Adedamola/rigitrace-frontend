"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiFetch } from "@/lib/api/client";
import type { Product } from "@/lib/types/entities";

interface ListResponse<T> {
  data: T[];
}

export function ProductSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Product[] | null>(null);

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
      setResults(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Product name or barcode…"
        />
        <Button type="submit" disabled={searching}>
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
                className="block rounded-lg border border-border bg-card p-3 text-sm text-foreground hover:border-primary"
              >
                <span className="font-medium">{product.name}</span>
                <span className="ml-2 text-muted-foreground">{product.category}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}