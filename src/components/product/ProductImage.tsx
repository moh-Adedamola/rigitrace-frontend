"use client";

import { useState } from "react";
import { BottlePlaceholder, CATEGORY_PLACEHOLDERS } from "@/components/product/ProductPlaceholder";

interface ProductImageProps {
  images: string[];
  category: string;
  name: string;
  /** Sizing utilities (e.g. `h-12 w-12`) — this component fills its box. */
  className?: string;
}

/**
 * A real product photo when one resolves; an illustrated category
 * placeholder otherwise — including when a submitted URL fails to load
 * (`onError` swaps to the placeholder rather than a broken-image icon).
 * Real photography comes from brands; the placeholder is only ever the
 * fallback, and is built deliberately not to be mistaken for one — see
 * ProductPlaceholder.tsx.
 */
export function ProductImage({ images, category, name, className = "" }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const src = images[0];

  if (src && !failed) {
    return (
      // DECISION: plain <img>, not next/image. Brand-submitted URLs are
      // arbitrary external domains — next/image's optimizer would need
      // remotePatterns opened to any host to proxy them, a real (if
      // modest) request-proxying surface not worth adding to an app with
      // no auth yet for a mock-backend feature. Revisit once brand image
      // upload is real (docs/architecture.md — the backend seam).
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className={`rounded-lg border border-border bg-muted object-cover ${className}`}
      />
    );
  }

  // Soft lookup, deliberately: `category` is free-form config/API data
  // (AGENTS.md rule 5), not a fixed enum, so an unrecognised value falls
  // back to the generic bottle shape instead of breaking.
  const Placeholder = (CATEGORY_PLACEHOLDERS as Record<string, typeof BottlePlaceholder>)[category] ?? BottlePlaceholder;

  return (
    <div
      role="img"
      aria-label={`${category} product — no photo submitted yet`}
      className={`flex items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground ${className}`}
    >
      <Placeholder className="h-full w-full p-3" />
    </div>
  );
}
