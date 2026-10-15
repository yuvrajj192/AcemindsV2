import type { NextConfig } from "next";

/* R2 public bucket hostname(s) for next/image optimisation. */
function r2Patterns(): { protocol: "https"; hostname: string }[] {
  const patterns: { protocol: "https"; hostname: string }[] = [{ protocol: "https", hostname: "*.r2.dev" }];
  const raw = process.env.R2_PUBLIC_URL;
  if (raw) {
    try {
      const host = new URL(raw).hostname;
      if (!host.endsWith(".r2.dev") && !patterns.some((p) => p.hostname === host)) {
        patterns.push({ protocol: "https", hostname: host });
      }
    } catch {
      /* ignore malformed URL — *.r2.dev pattern still applies */
    }
  }
  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: r2Patterns(),
  },
};

export default nextConfig;
