import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { VideoStoryForm } from "../../VideoStoryForm";

export default async function EditVideoStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.videoStories.findFirst({ where: eq(schema.videoStories.id, id) });
  if (!row) notFound();
  return (
    <VideoStoryForm
      initial={{
        id: row.id,
        name: row.name,
        batch: row.batch,
        headline: row.headline,
        lines: row.lines ?? [],
        videoUrl: row.videoUrl,
        sortOrder: row.sortOrder,
        published: row.published,
      }}
    />
  );
}
