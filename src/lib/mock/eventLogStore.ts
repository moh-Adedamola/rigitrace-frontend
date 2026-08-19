import type { EventLogEntry } from "@/lib/types/entities";
import { SEED_ENABLED, SEED_EVENTS } from "@/lib/mock/seedData";

/**
 * Append-only, on purpose — there is no updateEvent or deleteEvent function
 * anywhere in this file, matching evidenceStore.ts. A permanent record of
 * everything that has happened only stays permanent if nothing can edit it.
 *
 * Seeded the same way every other store is (see seedData.ts) so demo
 * brands, products, retailers, and reports have visible timeline history
 * instead of an empty log.
 */
const events: EventLogEntry[] = SEED_ENABLED ? [...SEED_EVENTS] : [];

export function addEvent(event: EventLogEntry): EventLogEntry {
  events.push(event);
  return event;
}

export function listEvents(entityType?: EventLogEntry["entityType"], entityId?: string): EventLogEntry[] {
  return events
    .filter((e) => (entityType ? e.entityType === entityType : true))
    .filter((e) => (entityId ? e.entityId === entityId : true))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
