import type { Metadata } from "next";
import { desc, ilike, or } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { MediaLibrary } from "./MediaLibrary";

export const metadata: Metadata = { title: "Media library", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const term = (q ?? "").trim();
  const rows = await db.query.media.findMany({
    where: term
      ? or(
          ilike(schema.media.filename, `%${term}%`),
          ilike(schema.media.alt, `%${term}%`),
          ilike(schema.media.key, `%${term}%`)
        )
      : undefined,
    orderBy: desc(schema.media.createdAt),
    limit: 100,
  });
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
  return <MediaLibrary initial={initial} q={term} />;
}
