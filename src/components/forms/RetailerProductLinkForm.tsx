"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import { apiFetch } from "@/lib/api/client";
import type { Product, Retailer, RetailerProductLink } from "@/lib/types/entities";

interface ListResponse<T> {
  data: T[];
}

export function RetailerProductLinkForm() {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [retailerId, setRetailerId] = useState("");
  const [productId, setProductId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [link, setLink] = useState<RetailerProductLink | null>(null);

  useEffect(() => {
    apiFetch<ListResponse<Retailer>>("/api/v1/retailers?status=approved")
      .then((res) => setRetailers(res.data))
      .catch(() => setRetailers([]));
    apiFetch<ListResponse<Product>>("/api/v1/verify")
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!retailerId || !productId) {
      setError("Select both a retailer and a product.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const created = await apiFetch<RetailerProductLink>("/api/v1/retailer-product-links", {
        method: "POST",
        body: JSON.stringify({ retailerId, productId }),
      });
      setLink(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to link product.");
    } finally {
      setSubmitting(false);
    }
  }

  if (link) {
    const product = products.find((p) => p.id === link.productId);
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-sm text-foreground">
          Linked to <span className="font-medium">{product?.name ?? "this product"}</span>. It will
          now appear in the &quot;Available at&quot; list on the product&apos;s verification page.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <Label htmlFor="retailerId">Your store</Label>
        <select
          id="retailerId"
          value={retailerId}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setRetailerId(e.target.value)}
          className="w-full rounded border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">
            {retailers.length === 0 ? "No approved retailers yet" : "Select your store…"}
          </option>
          {retailers.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="productId">Product to link</Label>
        <select
          id="productId"
          value={productId}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setProductId(e.target.value)}
          className="w-full rounded border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">
            {products.length === 0 ? "No published products yet" : "Select a product…"}
          </option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <FieldError>{error}</FieldError>

      <Button type="submit" disabled={submitting || retailers.length === 0 || products.length === 0}>
        {submitting ? "Linking…" : "Link product"}
      </Button>
    </form>
  );
}