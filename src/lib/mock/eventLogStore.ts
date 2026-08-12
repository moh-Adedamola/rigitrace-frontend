import type { EventLogEntry } from "@/lib/types/entities";

/**
 * Append-only, on purpose — there is no updateEvent or deleteEvent function
 * anywhere in this file, matching evidenceStore.ts. A permanent record of
 * everything that has happened only stays permanent if nothing can edit it.
 */
const events: EventLogEntry[] = [];

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
