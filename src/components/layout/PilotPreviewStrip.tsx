/**
 * Persistent, site-wide label — not an alert. Lives in the root layout
 * (src/app/layout.tsx), above every route group's own header, so it's
 * guaranteed on every page without depending on each route group
 * remembering to render it. Deliberately not sticky and not dismissible:
 * this is the same kind of fact as the wordmark, not a notice a visitor
 * is meant to act on or close.
 *
 * Colour is an inverted read of the existing neutral tokens (background
 * on foreground) — no destructive/warning hue, nothing borrowed from the
 * trust-status scale. The two other places this task adds a matching
 * treatment (docs: /trust, /how-it-works, the report flow) use the same
 * neutral-muted vocabulary, never this inverted one — the inversion is
 * reserved for this one, singular, page-spanning label.
 */
export function PilotPreviewStrip() {
  return (
    <div className="bg-foreground text-background">
      <p className="mx-auto max-w-6xl px-4 py-1.5 text-center text-xs font-medium tracking-wide">
        <span className="sm:hidden">Pilot preview</span>
        <span className="hidden sm:inline">Pilot preview — using demonstration data.</span>
      </p>
    </div>
  );
}
