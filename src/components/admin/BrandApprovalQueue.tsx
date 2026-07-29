"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/status/StatusPill";
import { apiFetch } from "@/lib/api/client";
import type { Brand } from "@/lib/types/entities";

interface ListResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export function BrandApprovalQueue() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingOn, setActingOn] = useState<string | null>(null);

  async function loadPendingBrands() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<ListResponse<Brand>>("/api/v1/brands?status=pending");
      setBrands(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load brands.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPendingBrands();
  }, []);

  async function handleDecision(id: string, status: "approved" | "suspended") {
    setActingOn(id);
    try {
      await apiFetch<Brand>(`/api/v1/brands/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update brand.");
    } finally {
      setActingOn(null);
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading pending brands…</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (brands.length === 0)
    return <p className="text-sm text-muted-foreground">No brands awaiting review.</p>;

  return (
    <ul className="space-y-3">
      {brands.map((brand) => (
        <li
          key={brand.id}
          className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{brand.name}</span>
              <StatusPill status={brand.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              {brand.registrationNumber} · {brand.contactEmail}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={actingOn === brand.id}
              onClick={() => handleDecision(brand.id, "suspended")}
            >
              Reject
            </Button>
            <Button
              disabled={actingOn === brand.id}
              onClick={() => handleDecision(brand.id, "approved")}
            >
              Approve
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}