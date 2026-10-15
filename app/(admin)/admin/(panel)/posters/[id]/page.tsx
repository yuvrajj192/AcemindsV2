import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PosterForm } from "../PosterForm";

export default async function EditPosterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.posters.findFirst({ where: eq(schema.posters.id, id) });
  if (!row) notFound();
  return (
    <PosterForm
      initial={{
        id: row.id,
        theme: row.theme,
        dateText: row.dateText,
        title: row.title,
        body: row.body,
        cta: row.cta,
        href: row.href,
        deco: row.deco,
        sortOrder: row.sortOrder,
        published: row.published,
      }}
    />
  );
}
