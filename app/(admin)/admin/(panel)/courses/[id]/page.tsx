import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { CourseForm } from "../CourseForm";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row, categories] = await Promise.all([
    db.query.courses.findFirst({ where: eq(schema.courses.id, id) }),
    db.query.categories.findMany(),
  ]);
  if (!row) notFound();
  return (
    <CourseForm
      initial={{
        id: row.id,
        catId: row.catId,
        title: row.title,
        forLine: row.forLine,
        duration: row.duration,
        mode: row.mode,
        start: row.start,
        batch: row.batch,
        badge: row.badge,
        hot: row.hot,
        seats: row.seats,
        features: row.features ?? [],
        sortOrder: row.sortOrder,
        published: row.published,
      }}
      categories={categories.map((c) => ({ id: c.id, label: c.label }))}
    />
  );
}
