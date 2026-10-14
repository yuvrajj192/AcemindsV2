import { NextRequest, NextResponse } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/session";

const LOGIN = "/admin/login";
const ADMIN = "/admin";

/* Optimistic check only (no DB, jose-only) — real authorization lives in layouts/actions. */
export async function proxy(request: NextRequest) {
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
