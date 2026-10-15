import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getAdminPostCategories } from "@/lib/admin-queries";
import { PostForm } from "../PostForm";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row, categories] = await Promise.all([
    db.query.posts.findFirst({ where: eq(schema.posts.id, id), with: { cover: true } }),
    getAdminPostCategories(),
  ]);
  if (!row) notFound();

  const body = row.body as { paragraphs?: string[] } | null;
  return (
    <PostForm
      initial={{
        id: row.id,
        slug: row.slug,
        cat: row.cat,
        title: row.title,
        excerpt: row.excerpt,
        bodyParagraphs: Array.isArray(body?.paragraphs) ? body!.paragraphs! : [],
        mediaId: row.mediaId,
        coverUrl: row.cover?.url ?? null,
        colorHex: row.colorHex,
        readTime: row.readTime,
        status: row.status,
        publishedAt: row.publishedAt?.toISOString() ?? null,
      }}
      categories={categories}
    />
  );
}
