import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { TopperForm } from "../TopperForm";

export default async function EditTopperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row, categories] = await Promise.all([
    db.query.toppers.findFirst({ where: eq(schema.toppers.id, id), with: { photo: true } }),
    db.query.categories.findMany(),
  ]);
  if (!row) notFound();
  return (
    <TopperForm
      initial={{
        id: row.id,
        name: row.name,
        exam: row.exam,
        year: row.year,
        rank: row.rank,
        score: row.score,
        college: row.college,
        catId: row.catId,
        mediaId: row.mediaId,
        photoUrl: row.photo?.url ?? null,
        sortOrder: row.sortOrder,
        published: row.published,
      }}
      categories={categories.map((c) => ({ id: c.id, label: c.label }))}
    />
  );
}
