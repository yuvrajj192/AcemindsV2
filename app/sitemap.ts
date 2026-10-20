import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/queries";

const BASE = "https://aceminds.in";

const PAGES: { path: string; changeFrequency: "daily" | "weekly" | "monthly"; priority: number }[] = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/courses", changeFrequency: "weekly", priority: 0.9 },
  { path: "/admissions", changeFrequency: "weekly", priority: 0.9 },
  { path: "/results", changeFrequency: "weekly", priority: 0.8 },
  { path: "/faculty", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/testimonials", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  return [
    ...PAGES.map((p) => ({
      url: `${BASE}${p.path}`,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
