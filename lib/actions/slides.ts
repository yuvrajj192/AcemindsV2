"use server";

import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getSession } from "@/lib/session";

async function requireStaff() {
  const user = await getSession();
  if (!user) throw new Error("Not signed in.");
  return user;
}

function text(fd: FormData, key: string, fallback = "") {
  return String(fd.get(key) ?? fallback).trim();
}

export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

export async function saveSlide(fd: FormData): Promise<SaveResult> {
  try {
    await requireStaff();
    const kicker = text(fd, "kicker");
    const title = text(fd, "title");
    if (!kicker || !title) return { ok: false, error: "Kicker and title are required." };

    const values = {
      mediaId: text(fd, "mediaId") || null,
      kicker,
      title,
      videoUrl: text(fd, "videoUrl"),
      sortOrder: Number(fd.get("sortOrder") || 0),
      published: fd.get("published") === "on",
    };

    const id = text(fd, "id");
    let savedId = id;
    if (id) {
      await db.update(schema.slides).set(values).where(eq(schema.slides.id, id));
    } else {
      const [row] = await db.insert(schema.slides).values(values).returning({ id: schema.slides.id });
      savedId = row.id;
    }
    updateTag("slides");
    revalidatePath("/admin/slides");
    return { ok: true, id: savedId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function deleteSlide(id: string): Promise<void> {
  await requireStaff();
  await db.delete(schema.slides).where(eq(schema.slides.id, id));
  updateTag("slides");
  revalidatePath("/admin/slides");
}
