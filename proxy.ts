import { NextRequest, NextResponse, type NextFetchEvent } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/session";
import { db, schema } from "@/lib/db";

const LOGIN = "/admin/login";
const ADMIN = "/admin";

/* ---------- lead-gen traffic tracking (public pages only) ---------- */

const BOT_RE =
  /(bot|crawl|spider|slurp|headless|preview|monitor|lighthouse|pingdom|uptime|facebookexternalhit|embed|validator|scrapy|axios|python-requests)/i;

function shouldTrack(request: NextRequest): boolean {
  const p = request.nextUrl.pathname;
  if (p.startsWith("/admin") || p.startsWith("/api")) return false;
  if (/\.[a-z0-9]{2,8}$/i.test(p)) return false; // asset-like paths (/img/x.webp, favicon.ico)
  if (request.headers.get("next-router-prefetch")) return false; // Link prefetch
  if (request.headers.has("next-action")) return false; // server actions
  const ua = request.headers.get("user-agent") ?? "";
  if (!ua || BOT_RE.test(ua)) return false;
  return true;
}

async function hashVisitor(seed: string): Promise<string> {
  const data = new TextEncoder().encode(seed + (process.env.JWT_SECRET ?? "ace"));
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function recordView(request: NextRequest): Promise<void> {
  const { pathname } = request.nextUrl;
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const ua = request.headers.get("user-agent") ?? "";
  const ip =
    (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "local";
  const refHost = referrerHost(request);
  const visitor = await hashVisitor(`${ip}|${ua}`);
  await db.insert(schema.pageViews).values({ path, visitor, referrer: refHost });
}

/** External referral host only; same-origin / none → "" (counted as direct). */
function referrerHost(request: NextRequest): string {
  const raw = request.headers.get("referer");
  if (!raw) return "";
  try {
    const ref = new URL(raw);
    if (ref.host === request.nextUrl.host) return "";
    return ref.host.replace(/^www\./, "").slice(0, 120);
  } catch {
    return "";
  }
}

/* ---------- auth (optimistic check only, no DB in the hot path) ---------- */

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  if (shouldTrack(request)) {
    event.waitUntil(recordView(request).catch(() => {}));
  }

  /* Never redirect server-action POSTs. A 307 makes the browser fetch follow to a
     page that doesn't register the action, so the Flight response never resolves
     and the client's pending state hangs forever ("Signing in…" stuck). Actions
     guard themselves with requireStaff(). */
  if (request.headers.has("next-action")) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const isLogin = pathname === LOGIN;
  const isAdminArea = pathname.startsWith(ADMIN);
  if (!isAdminArea) return NextResponse.next(); // public route — skip session work

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decrypt(token);

  if (isLogin && session) {
    return NextResponse.redirect(new URL(ADMIN, request.url));
  }
  if (!isLogin && !session) {
    return NextResponse.redirect(new URL(LOGIN, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/((?!_next/|api/).*)"],
};
