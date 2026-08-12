import { NextResponse } from "next/server";
import { ADMIN_GATE_COOKIE } from "@/lib/adminGate";

// TEMPORARY PRE-AUTH GATE — NOT AUTHENTICATION. See proxy.ts at the
// project root. This route only compares a submitted value to
// ADMIN_ACCESS_SECRET and, on a match, sets an httpOnly cookie holding
// that same secret — no session, no token, no database. Deliberately
// outside /api/v1: this isn't part of the versioned domain API shared
// with the backend colleague (see docs/API_CONTRACT.md), it's transport
// plumbing for a stopgap that gets deleted with the rest of this pattern.
export async function POST(request: Request) {
  const formData = await request.formData();
  const attempt = formData.get("secret");
  const fromRaw = formData.get("from");
  const from = typeof fromRaw === "string" && fromRaw.startsWith("/admin") ? fromRaw : "/admin/dashboard";

  const secret = process.env.ADMIN_ACCESS_SECRET;

  if (!secret || attempt !== secret) {
    const deniedUrl = new URL("/admin-gate", request.url);
    deniedUrl.searchParams.set("error", "1");
    deniedUrl.searchParams.set("from", from);
    return NextResponse.redirect(deniedUrl, { status: 303 });
  }

  const response = NextResponse.redirect(new URL(from, request.url), { status: 303 });
  response.cookies.set(ADMIN_GATE_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days — convenience, not a security boundary
  });
  return response;
}
