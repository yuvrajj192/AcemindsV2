import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { ReviewForm } from "../ReviewForm";

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.reviews.findFirst({ where: eq(schema.reviews.id, id) });
  if (!row) notFound();
  return <ReviewForm initial={{ id: row.id, name: row.name, role: row.role, body: row.body, sortOrder: row.sortOrder, published: row.published }} />;
}
