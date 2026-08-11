"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/status/StatusPill";
import { apiFetch } from "@/lib/api/client";
import type { Retailer } from "@/lib/types/entities";

interface ListResponse<T> {
  data: T[];
}

export function RetailerApprovalQueue() {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingOn, setActingOn] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await apiFetch<ListResponse<Retailer>>("/api/v1/retailers?status=pending");
        if (cancelled) return;
        setRetailers(res.data);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load retailers.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDecision(id: string, status: "approved" | "suspended") {
    setActingOn(id);
    try {
      await apiFetch<Retailer>(`/api/v1/retailers/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setRetailers((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update retailer.");
    } finally {
      setActingOn(null);
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading pending retailers…</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (retailers.length === 0)
    return <p className="text-sm text-muted-foreground">No retailers awaiting review.</p>;

  return (
    <ul className="space-y-3">
      {retailers.map((retailer) => (
        <li
          key={retailer.id}
          className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{retailer.name}</span>
              <StatusPill status={retailer.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              {retailer.type.replace("_", " ")} · {retailer.contactEmail}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={actingOn === retailer.id}
              onClick={() => handleDecision(retailer.id, "suspended")}
            >
              Reject
            </Button>
            <Button
              disabled={actingOn === retailer.id}
              onClick={() => handleDecision(retailer.id, "approved")}
            >
              Approve
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}