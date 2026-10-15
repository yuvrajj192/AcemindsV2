import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { NoticeForm } from "../NoticeForm";

export default async function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.notices.findFirst({ where: eq(schema.notices.id, id) });
  if (!row) notFound();
  return <NoticeForm initial={{ id: row.id, text: row.text, href: row.href, active: row.active, sortOrder: row.sortOrder }} />;
}
