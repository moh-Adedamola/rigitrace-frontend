"use client";

import { useEffect, useState } from "react";
import { StatusPill } from "@/components/status/StatusPill";
import { TrustBadge } from "@/components/trust/TrustBadge";
import { EvidenceTimeline } from "@/components/evidence/EvidenceTimeline";
import { EvidenceSubmissionForm } from "@/components/forms/EvidenceSubmissionForm";
import { EventTimeline } from "@/components/events/EventTimeline";
import { apiFetch } from "@/lib/api/client";
import type { Product, Evidence, TrustScore } from "@/lib/types/entities";

interface ListResponse<T> {
  data: T[];
}

export function ProductDetailClient({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [productRes, evidenceRes, trustRes] = await Promise.all([
          apiFetch<Product>(`/api/v1/products/${productId}`),
          apiFetch<ListResponse<Evidence>>(`/api/v1/products/${productId}/evidence`),
          apiFetch<TrustScore>(`/api/v1/products/${productId}/trust-score`),
        ]);
        if (cancelled) return;
        setProduct(productRes);
        setEvidence(evidenceRes.data);
        setTrustScore(trustRes);
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

  async function handleEvidenceSubmitted(newEvidence: Evidence) {
    setEvidence((prev) => [newEvidence, ...prev]);
    // New evidence changes the picture — recalculate rather than let the
    // badge silently go stale.
    setRecalculating(true);
    try {
      const updated = await apiFetch<TrustScore>(
        `/api/v1/products/${productId}/trust-score/recalculate`,
        { method: "POST" }
      );
      setTrustScore(updated);
    } catch {
      // Non-fatal — the evidence is still saved even if recalculation fails.
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
          Evidence history
        </h2>
        <EvidenceTimeline evidence={evidence} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-eyebrow">
          Activity history
        </h2>
        <EventTimeline entityType="product" entityId={productId} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-eyebrow">
          Submit new evidence
        </h2>
        <EvidenceSubmissionForm productId={productId} onSubmitted={handleEvidenceSubmitted} />
      </section>
    </div>
  );
}