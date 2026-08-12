import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_GATE_COOKIE } from "@/lib/adminGate";

/**
 * TEMPORARY PRE-AUTH GATE FOR /admin — THIS IS NOT AUTHENTICATION.
 *
 * It's a single shared secret compared against a cookie value. There are
 * no user accounts, no sessions, no expiry beyond the cookie's own
 * `maxAge`, no rate limiting, and no audit trail. Anyone who has the
 * secret — or who guesses or steals the cookie value — has full access.
 * This does not defend against a motivated attacker; it exists only to
 * stop `/admin/dashboard` being one click away for a casual visitor with
 * the URL, until backend-issued JWTs land. See `docs/architecture.md` →
 * "The backend seam" and `docs/progress-tracker.md` → Security.
 *
 * Delete this file, `src/lib/adminGate.ts`, `src/app/admin-gate/`,
 * `src/app/api/admin-gate/`, and `ADMIN_ACCESS_SECRET` entirely once real
 * auth exists. Do not extend this pattern to gate anything else — brand
 * and retailer portals, and every consumer route, stay open on purpose
 * (AGENTS.md rule 4: consumers never need an account to verify).
 *
 * Named `proxy.ts`, not `middleware.ts`: Next.js 16 deprecates the
 * `middleware` file convention in favour of `proxy` (same mechanism, new
 * name) — see `node_modules/next/dist/docs/.../file-conventions/proxy.md`.
 *
 * Lives at `src/proxy.ts`, not the true project root: this app's routes
 * live under `src/app`, and Next requires the proxy file at the same
 * level as `app` — that's `src/`, not the repo root, when a `src/`
 * layout is in use.
 */

// Only two things are gated: every /admin/* page, and the two admin-only
// mutations the dashboard calls (brand/retailer status PATCH). Everything
// else — consumer routes, brand/retailer portals, every GET the site
// depends on to render — is untouched. See the matcher below for the
// exact scope; it's intentionally narrow.
const ADMIN_MUTATION_PATTERN = /^\/api\/v1\/(brands|retailers)\/[^/]+\/status$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminMutation = request.method === "PATCH" && ADMIN_MUTATION_PATTERN.test(pathname);

  if (!isAdminPage && !isAdminMutation) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_ACCESS_SECRET;

  // Fail closed: an unset secret denies everyone, in every environment.
  // "Not configured" must never be read as "open."
  if (!secret) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[admin-gate] ADMIN_ACCESS_SECRET is not set — denying ${request.method} ${pathname}. ` +
          "Set it in .env.local and restart the dev server."
      );
    }
    if (isAdminMutation) {
      return new NextResponse(null, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin-gate?reason=unset", request.url));
  }

  if (request.cookies.get(ADMIN_GATE_COOKIE)?.value === secret) {
    return NextResponse.next();
  }

  if (isAdminMutation) {
    // No body detail, per instruction — don't help an attacker distinguish
    // "wrong secret" from "no secret" from anything else.
    return new NextResponse(null, { status: 401 });
  }

  const unlockUrl = new URL("/admin-gate", request.url);
  unlockUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(unlockUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/v1/brands/:id/status", "/api/v1/retailers/:id/status"],
};
