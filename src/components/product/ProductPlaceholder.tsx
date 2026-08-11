import type { ReactNode, SVGProps } from "react";
import { PRODUCT_CATEGORIES } from "@/lib/constants/categories";

/**
 * Illustrated packaging silhouettes — one per launch category, shown
 * wherever a product has no real photo (or a submitted one fails to
 * load; see ProductImage.tsx). Deliberately flat and geometric — no
 * gradients, no shading, no realism — so these read at a glance as "no
 * photo yet," never as an actual product photo. Real photography comes
 * from brands.
 *
 * Colour comes entirely from `currentColor` — callers set it via a text
 * colour utility on the wrapping element (ProductImage uses
 * `text-muted-foreground`), matching the existing line-icon pattern
 * (see the icon components in `(marketing)/page.tsx`).
 */

type PlaceholderProps = SVGProps<SVGSVGElement>;

function Silhouette({ children, ...props }: PlaceholderProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Skincare — a cream jar with a lid. */
export function JarPlaceholder(props: PlaceholderProps) {
  return (
    <Silhouette {...props}>
      <rect x="17" y="10" width="30" height="9" rx="2" fill="currentColor" fillOpacity="0.12" />
      <rect x="13" y="19" width="38" height="35" rx="5" fill="currentColor" fillOpacity="0.08" />
    </Silhouette>
  );
}

/** Personal care — a simple bottle. Also the generic fallback shape. */
export function BottlePlaceholder(props: PlaceholderProps) {
  return (
    <Silhouette {...props}>
      <rect x="25" y="8" width="14" height="6" rx="1.5" fill="currentColor" fillOpacity="0.12" />
      <rect x="28" y="14" width="8" height="7" fill="currentColor" fillOpacity="0.12" />
      <rect x="15" y="21" width="34" height="33" rx="5" fill="currentColor" fillOpacity="0.08" />
    </Silhouette>
  );
}

/** Makeup — a squeeze/lipstick tube with a tapered shoulder. */
export function TubePlaceholder(props: PlaceholderProps) {
  return (
    <Silhouette {...props}>
      <rect x="26" y="8" width="12" height="7" rx="1.5" fill="currentColor" fillOpacity="0.12" />
      <polygon points="23,15 41,15 47,23 17,23" fill="currentColor" fillOpacity="0.1" />
      <rect x="17" y="23" width="30" height="31" rx="4" fill="currentColor" fillOpacity="0.08" />
    </Silhouette>
  );
}

/** Haircare — a pump bottle. */
export function PumpPlaceholder(props: PlaceholderProps) {
  return (
    <Silhouette {...props}>
      <rect x="40" y="11" width="11" height="4" rx="1.5" fill="currentColor" fillOpacity="0.12" />
      <rect x="22" y="9" width="20" height="8" rx="2" fill="currentColor" fillOpacity="0.12" />
      <rect x="27" y="17" width="10" height="9" fill="currentColor" fillOpacity="0.12" />
      <rect x="15" y="26" width="34" height="28" rx="5" fill="currentColor" fillOpacity="0.08" />
    </Silhouette>
  );
}

/** Fragrance — an atomizer bottle with spray marks. */
export function SprayPlaceholder(props: PlaceholderProps) {
  return (
    <Silhouette {...props}>
      <line x1="49" y1="8" x2="53" y2="6" />
      <line x1="50" y1="12" x2="55" y2="12" />
      <line x1="49" y1="16" x2="53" y2="18" />
      <rect x="24" y="8" width="16" height="8" rx="2" fill="currentColor" fillOpacity="0.12" />
      <rect x="38" y="10" width="9" height="4" rx="1.5" fill="currentColor" fillOpacity="0.12" />
      <rect x="29" y="16" width="6" height="7" fill="currentColor" fillOpacity="0.12" />
      <polygon points="20,23 44,23 41,54 23,54" fill="currentColor" fillOpacity="0.08" />
    </Silhouette>
  );
}

/**
 * Keyed by the exact strings in PRODUCT_CATEGORIES. `category` is a
 * free-form config/API value (AGENTS.md rule 5 — never a fixed enum), so
 * this is deliberately a soft lookup: an unrecognised category just falls
 * back to BottlePlaceholder in ProductImage rather than breaking.
 */
export const CATEGORY_PLACEHOLDERS: Record<(typeof PRODUCT_CATEGORIES)[number], typeof JarPlaceholder> = {
  Skincare: JarPlaceholder,
  Haircare: PumpPlaceholder,
  Makeup: TubePlaceholder,
  Fragrance: SprayPlaceholder,
  "Personal Care": BottlePlaceholder,
};
