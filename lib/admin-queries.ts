import { db, schema } from "@/lib/db";

const CANONICAL = ["Exam updates", "Strategy", "Concepts", "Announcements", "Toppers"];

/** Distinct post categories (existing + canonical), for the admin editor. */
export async function getAdminPostCategories(): Promise<string[]> {
  const rows = await db.selectDistinct({ cat: schema.posts.cat }).from(schema.posts);
  return [...new Set([...rows.map((r) => r.cat), ...CANONICAL])].sort((a, b) => a.localeCompare(b));
}
