import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { FaqForm } from "../FaqForm";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.faqs.findFirst({ where: eq(schema.faqs.id, id) });
  if (!row) notFound();
  return <FaqForm initial={{ id: row.id, q: row.q, a: row.a, sortOrder: row.sortOrder, published: row.published }} />;
}
