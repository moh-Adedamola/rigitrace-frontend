"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import type { EventLogEntry } from "@/lib/types/entities";

interface ListResponse<T> {
  data: T[];
}

const ENTITY_TYPE_LABELS: Record<EventLogEntry["entityType"], string> = {
  brand: "Brand",
  product: "Product",
  retailer: "Retailer",
  report: "Report",
  evidence: "Evidence",
};

const ACTOR_ROLE_LABELS: Record<EventLogEntry["actorRole"], string> = {
  admin: "Admin",
  brand: "Brand",
  retailer: "Retailer",
  consumer: "Consumer",
  manufacturer: "Manufacturer",
  regulator: "Regulator",
  system: "System",
};

interface EventTimelineProps {
  /** Scope to one entity's history. Omit both, with `limit`, for a platform-wide feed. */
  entityType?: EventLogEntry["entityType"];
  entityId?: string;
  /** Caps how many entries render, after the newest-first sort. Unset = all. */
  limit?: number;
}

/**
 * Read-only, on purpose — no edit or delete affordance anywhere in this
 * component, matching EvidenceTimeline. The event log is a history, not a
 * list of editable rows.
 *
 * Unlike EvidenceTimeline, this component fetches its own data (it's given
 * `entityType`/`entityId`, not a pre-fetched array) so the same component
 * can serve both an entity-scoped history and a platform-wide activity feed
 * from one implementation.
 *
 * Actor identity is a placeholder until auth lands — `actorId` is shown
 * exactly as the API returns it ("unknown", "anonymous", or a raw brand/
 * retailer id). No friendly-name lookup; that would misrepresent a gap as
 * working code.
 */
export function EventTimeline({ entityType, entityId, limit }: EventTimelineProps) {
  const [events, setEvents] = useState<EventLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (entityType) params.set("entityType", entityType);
        if (entityId) params.set("entityId", entityId);
        const query = params.toString();
        const res = await apiFetch<ListResponse<EventLogEntry>>(`/api/v1/events${query ? `?${query}` : ""}`);
        if (cancelled) return;
        setEvents(res.data);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load activity.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, [entityType, entityId]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading activity…</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;

  const visible = typeof limit === "number" ? events.slice(0, limit) : events;

  if (visible.length === 0) {
    return <p className="text-sm text-muted-foreground">No recorded activity yet.</p>;
  }

  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {visible.map((event) => (
        <li key={event.id} className="relative">
          <span className="absolute -left-[1.6rem] top-1 h-2 w-2 rounded-full bg-primary" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-eyebrow">
              {ENTITY_TYPE_LABELS[event.entityType]}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(event.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground">{event.description}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {ACTOR_ROLE_LABELS[event.actorRole]} · <span className="font-mono">{event.actorId}</span>
          </p>
        </li>
      ))}
    </ol>
  );
}
