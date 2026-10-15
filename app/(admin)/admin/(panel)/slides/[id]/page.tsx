import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { SlideForm } from "../SlideForm";

export default async function EditSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.slides.findFirst({ where: eq(schema.slides.id, id), with: { image: true } });
  if (!row) notFound();
  return (
    <SlideForm
      initial={{
        id: row.id,
        mediaId: row.mediaId,
        imageUrl: row.image?.url ?? null,
        kicker: row.kicker,
        title: row.title,
        videoUrl: row.videoUrl,
        sortOrder: row.sortOrder,
        published: row.published,
      }}
    />
  );
}
