/**
 * TEMPORARY PRE-AUTH GATE — NOT AUTHENTICATION. Full explanation in
 * `proxy.ts` at the project root. This file exists only because `proxy.ts`
 * lives outside `src/` and can't use relative imports into it cleanly, so
 * the cookie name is factored out here where both `proxy.ts` and the
 * unlock route (`src/app/api/admin-gate/route.ts`) can import it via the
 * `@/` alias without duplicating the literal string.
 *
 * Delete this file along with `proxy.ts` and `ADMIN_ACCESS_SECRET` once
 * real, backend-issued auth exists.
 */
export const ADMIN_GATE_COOKIE = "rigitrace_admin_gate";
