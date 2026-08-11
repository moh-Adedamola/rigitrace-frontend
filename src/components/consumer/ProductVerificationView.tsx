"use client";

import { useEffect, useState } from "react";
import { StatusPill } from "@/components/status/StatusPill";
import { TrustBadge } from "@/components/trust/TrustBadge";
import { EvidenceTimeline } from "@/components/evidence/EvidenceTimeline";
import { ReportForm } from "@/components/forms/ReportForm";
import { apiFetch } from "@/lib/api/client";
import type { Product, Evidence, TrustScore, Retailer } from "@/lib/types/entities";

interface ListResponse<T> {
  data: T[];
}

export function ProductVerificationView({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [productRes, evidenceRes, trustRes, retailersRes] = await Promise.all([
          apiFetch<Product>(`/api/v1/products/${productId}`),
          apiFetch<ListResponse<Evidence>>(`/api/v1/products/${productId}/evidence`),
          apiFetch<TrustScore>(`/api/v1/products/${productId}/trust-score`),
          apiFetch<ListResponse<Retailer>>(`/api/v1/products/${productId}/retailers`),
        ]);
        setProduct(productRes);
        setEvidence(evidenceRes.data);
        setTrustScore(trustRes);
        setRetailers(retailersRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId]);

  async function handleReportSubmitted() {
    // A new report changes the picture — recalculate rather than let the
    // badge silently go stale. Mirrors ProductDetailClient's evidence flow.
    setRecalculating(true);
    try {
      const updated = await apiFetch<TrustScore>(
        `/api/v1/products/${productId}/trust-score/recalculate`,
        { method: "POST" }
      );
      setTrustScore(updated);
    } catch {
      // Non-fatal — the report is still saved even if recalculation fails.
    } finally {
      setRecalculating(false);
    }
  }

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
          Trust status {recalculating && "(recalculating…)"}
        </h2>
        {trustScore && <TrustBadge trustScore={trustScore} />}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-eyebrow">
          Available at
        </h2>
        {retailers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No verified retailers linked yet.</p>
        ) : (
          <ul className="space-y-2">
            {retailers.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-border bg-card p-3 text-sm text-foreground"
              >
                <span className="font-medium">{r.name}</span>
                <span className="ml-2 text-muted-foreground">{r.type.replace("_", " ")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-eyebrow">
          Evidence on record
        </h2>
        <EvidenceTimeline evidence={evidence} />
      </section>

      <section>
        <ReportForm productId={productId} onSubmitted={handleReportSubmitted} />
      </section>
    </div>
  );
}