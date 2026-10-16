import type { NextRequest } from "next/server";

/**
 * Same-origin proxy for R2 media bytes.
 *
 * Why: R2 omits `Vary: Origin` on responses to no-Origin requests (`<img>` loads),
 * so the browser caches that variant un-keyed and later serves it to the crop's
 * CORS fetch — which then lacks `Access-Control-Allow-Origin` and fails with
 * "Failed to fetch". Fetching same-origin bypasses CORS entirely and works from
 * any dev origin (localhost, LAN, tunnels).
 */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key") ?? "";
  if (!/^media\/[\w./-]+$/.test(key) || key.includes("..")) {
    return new Response("Bad key.", { status: 400 });
  }
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!base) return new Response("R2 is not configured.", { status: 500 });

  let upstream: Response;
  try {
    upstream = await fetch(`${base}/${key}`);
  } catch {
    return new Response("Media storage is unreachable.", { status: 502 });
  }
  if (!upstream.ok) {
    return new Response(upstream.status === 404 ? "Not found." : "Upstream error.", {
      status: upstream.status === 404 ? 404 : 502,
    });
  }
  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
