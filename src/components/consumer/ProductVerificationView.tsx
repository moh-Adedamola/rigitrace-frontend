"use client";

import { useEffect, useState } from "react";
import { StatusPill } from "@/components/status/StatusPill";
import { TrustBadge } from "@/components/trust/TrustBadge";
import { EvidenceTimeline } from "@/components/evidence/EvidenceTimeline";
import { TrustScoreHistory } from "@/components/trust/TrustScoreHistory";
import { ReportForm } from "@/components/forms/ReportForm";
import { ProductImage } from "@/components/product/ProductImage";
import { apiFetch } from "@/lib/api/client";
import type { Product, Evidence, TrustScore, Retailer } from "@/lib/types/entities";
import type { TrustScoreHistoryPoint } from "@/lib/trust/reconstructTrustScoreAt";

interface ListResponse<T> {
  data: T[];
}

interface TrustScoreHistoryResponse {
  productId: string;
  points: TrustScoreHistoryPoint[];
}

export function ProductVerificationView({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [historyPoints, setHistoryPoints] = useState<TrustScoreHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [productRes, evidenceRes, trustRes, retailersRes, historyRes] = await Promise.all([
          apiFetch<Product>(`/api/v1/products/${productId}`),
          apiFetch<ListResponse<Evidence>>(`/api/v1/products/${productId}/evidence`),
          apiFetch<TrustScore>(`/api/v1/products/${productId}/trust-score`),
          apiFetch<ListResponse<Retailer>>(`/api/v1/products/${productId}/retailers`),
          apiFetch<TrustScoreHistoryResponse>(`/api/v1/products/${productId}/trust-score/history`),
        ]);
        if (cancelled) return;
        setProduct(productRes);
        setEvidence(evidenceRes.data);
        setTrustScore(trustRes);
        setRetailers(retailersRes.data);
        setHistoryPoints(historyRes.points);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load product.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
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
    <div className="space-y-8 sm:space-y-10">
      {/* Identity — compact on purpose. It sets context; it isn't the answer. */}
      <div className="flex items-center gap-3">
        <ProductImage
          images={product.images}
          category={product.category}
          name={product.name}
          className="h-14 w-14 shrink-0 sm:h-16 sm:w-16"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold text-foreground sm:text-xl">{product.name}</h1>
            <StatusPill status={product.status} />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {product.category}
            {product.barcode && (
              <>
                {" · Barcode: "}
                <span className="font-mono">{product.barcode}</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Trust status — the centre of the page. Everything below supports this. */}
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-eyebrow">
          Trust status {recalculating && "(recalculating…)"}
        </h2>
        {trustScore && <TrustBadge trustScore={trustScore} size="large" />}
      </section>

      {/* Supporting detail — one tier down visually: muted headings, a
          shared panel background, grouped together rather than each
          reading as its own equally-weighted section. */}
      <div className="space-y-6 rounded-lg border border-border bg-section-raised p-4 sm:p-6">
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Available at
          </h2>
          {retailers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No verified retailers linked yet.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {retailers.map((r) => (
                <li
                  key={r.id}
                  className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
                >
                  <span className="font-medium">{r.name}</span>
                  <span className="ml-1.5 text-muted-foreground">{r.type.replace("_", " ")}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border-t border-border pt-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Evidence on record
          </h2>
          <EvidenceTimeline evidence={evidence} />
        </section>

        <section className="border-t border-border pt-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Trust history
          </h2>
          <TrustScoreHistory points={historyPoints} />
        </section>
      </div>

      {/* Report — a low-key exit, not competing for attention. */}
      <section>
        <ReportForm productId={productId} onSubmitted={handleReportSubmitted} />
      </section>
    </div>
  );
}