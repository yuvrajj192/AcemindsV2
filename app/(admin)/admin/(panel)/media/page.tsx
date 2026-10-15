import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { MediaLibrary } from "./MediaLibrary";

export const metadata: Metadata = { title: "Media library", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const rows = await db.query.media.findMany({ orderBy: desc(schema.media.createdAt), limit: 100 });
  const initial = rows.map((m) => ({
    id: m.id,
    key: m.key,
    url: m.url,
    filename: m.filename,
    mimeType: m.mimeType,
    size: m.size,
    width: m.width,
    height: m.height,
    alt: m.alt,
    folder: m.folder,
    createdAt: m.createdAt.toISOString(),
  }));
  return <MediaLibrary initial={initial} />;
}
