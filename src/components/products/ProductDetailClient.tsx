"use client";

import { useEffect, useState } from "react";
import { StatusPill } from "@/components/status/StatusPill";
import { EvidenceTimeline } from "@/components/evidence/EvidenceTimeline";
import { EvidenceSubmissionForm } from "@/components/forms/EvidenceSubmissionForm";
import { apiFetch } from "@/lib/api/client";
import type { Product, Evidence } from "@/lib/types/entities";

interface ListResponse<T> {
  data: T[];
}

export function ProductDetailClient({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [productRes, evidenceRes] = await Promise.all([
          apiFetch<Product>(`/api/v1/products/${productId}`),
          apiFetch<ListResponse<Evidence>>(`/api/v1/products/${productId}/evidence`),
        ]);
        setProduct(productRes);
        setEvidence(evidenceRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!product) return <p className="text-sm text-muted-foreground">Product not found.</p>;

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-foreground">{product.name}</h1>
          <StatusPill status={product.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {product.category}
          {product.barcode ? ` · Barcode: ${product.barcode}` : ""}
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-eyebrow">
          Evidence history
        </h2>
        <EvidenceTimeline evidence={evidence} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-eyebrow">
          Submit new evidence
        </h2>
        <EvidenceSubmissionForm
          productId={productId}
          onSubmitted={(newEvidence) => setEvidence((prev) => [newEvidence, ...prev])}
        />
      </section>
    </div>
  );
}