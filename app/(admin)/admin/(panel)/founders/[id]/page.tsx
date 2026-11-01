import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { FounderForm } from "../FounderForm";

export default async function EditFounderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.founders.findFirst({
    where: eq(schema.founders.id, id),
    with: { photo: true },
  });
  if (!row) notFound();
  return (
    <FounderForm
      initial={{
        id: row.id,
        name: row.name,
        role: row.role,
        subject: row.subject,
        edu: row.edu,
        exp: row.exp,
        mediaId: row.mediaId,
        photoUrl: row.photo?.url ?? null,
        tags: row.tags,
        bio: row.bio,
        sortOrder: row.sortOrder,
        published: row.published,
      }}
    />
  );
}
