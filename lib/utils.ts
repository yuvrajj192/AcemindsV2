import type { Category } from "./types";

export const catOf = (categories: Category[], id: string) => categories.find((c) => c.id === id);

export const initials = (n: string) => n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const palette = ["#2e7bea", "#e63946", "#f28c28", "#16315f", "#e0a516", "#1f427a"];
export const colorFor = (s: string) => palette[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length];

/** "2026-09-28" | Date → "28 Sep 2026" */
export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/** Date → "2 months ago" (for review cards) */
export function timeAgo(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const secs = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  const units: [number, string][] = [
    [31536000, "year"], [2592000, "month"], [604800, "week"], [86400, "day"], [3600, "hour"], [60, "minute"],
  ];
  for (const [s, name] of units) {
    const v = Math.floor(secs / s);
    if (v >= 1) return `${v} ${name}${v > 1 ? "s" : ""} ago`;
  }
  return "just now";
}
