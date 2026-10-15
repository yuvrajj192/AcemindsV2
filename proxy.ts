import { NextRequest, NextResponse } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/session";

const LOGIN = "/admin/login";
const ADMIN = "/admin";

/* Optimistic check only (no DB, jose-only) — real authorization lives in layouts/actions. */
export async function proxy(request: NextRequest) {
  /* Never redirect server-action POSTs. A 307 makes the browser fetch follow to a
     page that doesn't register the action, so the Flight response never resolves
     and the client's pending state hangs forever ("Signing in…" stuck). Actions
     guard themselves with requireStaff(). */
  if (request.headers.has("next-action")) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decrypt(token);

  const isLogin = pathname === LOGIN;
  const isAdminArea = pathname.startsWith(ADMIN);

  if (isAdminArea && !isLogin && !session) {
    return NextResponse.redirect(new URL(LOGIN, request.url));
  }
  if (isLogin && session) {
    return NextResponse.redirect(new URL(ADMIN, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
