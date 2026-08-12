import type { Metadata } from "next";

// TEMPORARY PRE-AUTH GATE — NOT AUTHENTICATION. See proxy.ts at the
// project root for the full explanation. This page is the "minimal unlock
// page" proxy.ts redirects to: a plain HTML form, no client JS, that
// POSTs a shared secret to /api/admin-gate. Deliberately outside the
// design system used for real product pages — this isn't one.
export const metadata: Metadata = {
  title: "Admin access — RigiTrace",
  robots: "noindex, nofollow",
};

export default async function AdminGatePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; reason?: string; error?: string }>;
}) {
  const { from, reason, error } = await searchParams;
  const redirectTo = from && from.startsWith("/admin") ? from : "/admin/dashboard";

  return (
    <main className="mx-auto max-w-sm px-4 py-24">
      <p className="text-xs font-semibold uppercase tracking-wide text-eyebrow">
        Temporary stopgap, not a login
      </p>
      <h1 className="mt-2 text-xl font-semibold text-foreground">Admin access</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This is a shared-secret gate, not authentication — see the comment in{" "}
        <code className="font-mono text-xs">proxy.ts</code>.
      </p>

      {reason === "unset" && (
        <p className="mt-4 rounded border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <code className="font-mono text-xs">ADMIN_ACCESS_SECRET</code> is not set on this
          server, so access is denied by default. Set it in <code className="font-mono text-xs">.env.local</code>{" "}
          (dev) or your deployment&apos;s environment variables, then restart or redeploy.
        </p>
      )}

      {error === "1" && (
        <p className="mt-4 rounded border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          That wasn&apos;t right.
        </p>
      )}

      <form method="POST" action="/api/admin-gate" className="mt-6 space-y-4">
        <input type="hidden" name="from" value={redirectTo} />
        <div>
          <label htmlFor="secret" className="mb-1 block text-sm font-medium text-foreground">
            Secret
          </label>
          <input
            id="secret"
            name="secret"
            type="password"
            autoFocus
            autoComplete="off"
            className="w-full rounded border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Enter
        </button>
      </form>
    </main>
  );
}
