import type { Metadata } from "next";

/* Every /admin route inherits noindex — belt on top of the per-page
   robots flags and the /admin disallow in robots.ts. */
export const metadata: Metadata = {
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
