"use server";

import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getSession } from "@/lib/session";

async function requireStaff() {
  const user = await getSession();
  if (!user) throw new Error("Not signed in.");
}

function text(fd: FormData, key: string, fallback = "") {
  return String(fd.get(key) ?? fallback).trim();
}

export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

export async function savePost(fd: FormData): Promise<SaveResult> {
  try {
    await requireStaff();
    const user = await getSession();
    const title = text(fd, "title");
    const slug = text(fd, "slug");
    if (!title || !slug) return { ok: false, error: "Title and slug are required." };

    const bodyText = text(fd, "body");
    const paragraphs = bodyText
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
    const status = text(fd, "status", "draft") === "published" ? "published" : "draft";
    const publishedAtRaw = text(fd, "publishedAt");

    const values = {
      slug,
      cat: text(fd, "cat", "General"),
      title,
      excerpt: text(fd, "excerpt"),
      body: paragraphs.length ? { paragraphs } : null,
      mediaId: text(fd, "mediaId") || null,
      colorHex: text(fd, "colorHex", "#2e7bea"),
      readTime: text(fd, "readTime", "4 min"),
      status: status as "draft" | "published",
      publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : status === "published" ? new Date() : null,
      authorId: user?.id ?? null,
    };

    const id = text(fd, "id");
    let savedId = id;
    if (id) {
      await db.update(schema.posts).set(values).where(eq(schema.posts.id, id));
    } else {
      const [row] = await db.insert(schema.posts).values(values).returning({ id: schema.posts.id });
      savedId = row.id;
    }
    updateTag("posts");
    revalidatePath("/admin/posts");
    revalidatePath("/");
    revalidatePath("/blog");
    return { ok: true, id: savedId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function deletePost(id: string): Promise<void> {
  await requireStaff();
  await db.delete(schema.posts).where(eq(schema.posts.id, id));
  updateTag("posts");
  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/blog");
}
