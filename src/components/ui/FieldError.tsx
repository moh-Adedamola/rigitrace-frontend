export function FieldError({ id, children }: { id?: string; children?: string | null }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1 text-xs text-destructive" aria-live="polite">
      {children}
    </p>
  );
}