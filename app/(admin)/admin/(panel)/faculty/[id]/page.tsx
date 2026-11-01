import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { FacultyForm } from "../FacultyForm";

export default async function EditFacultyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.faculty.findFirst({
    where: eq(schema.faculty.id, id),
    with: { photo: true },
  });
  if (!row) notFound();
  return (
    <FacultyForm
      initial={{
        id: row.id,
        name: row.name,
        role: row.role,
        edu: row.edu,
        exp: row.exp,
        subject: row.subject,
        mediaId: row.mediaId,
        photoUrl: row.photo?.url ?? null,
        tags: row.tags,
        bio: row.bio,
        isFounder: row.isFounder,
        sortOrder: row.sortOrder,
        published: row.published,
      }}
    />
  );
}
