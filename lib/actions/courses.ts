"use server";

import { revalidatePath, updateTag } from "next/cache";
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

export async function saveCourse(fd: FormData): Promise<SaveResult> {
  try {
    await requireStaff();
    const catId = text(fd, "catId");
    const title = text(fd, "title");
    if (!catId || !title) return { ok: false, error: "Category and title are required." };

    const values = {
      catId,
      title,
      forLine: text(fd, "forLine"),
      duration: text(fd, "duration"),
      mode: text(fd, "mode"),
      start: text(fd, "start"),
      batch: text(fd, "batch"),
      badge: text(fd, "badge") || null,
      hot: fd.get("hot") === "on",
      seats: Number(fd.get("seats") || 0),
      features: text(fd, "features")
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      sortOrder: Number(fd.get("sortOrder") || 0),
      published: fd.get("published") === "on",
    };

    const id = text(fd, "id");
    let savedId = id;
    if (id) {
      await db.update(schema.courses).set(values).where(eq(schema.courses.id, id));
    } else {
      const [row] = await db.insert(schema.courses).values(values).returning({ id: schema.courses.id });
      savedId = row.id;
    }
    updateTag("courses");
    revalidatePath("/admin/courses");
    revalidatePath("/");
    revalidatePath("/courses");
    revalidatePath("/admissions");
    revalidatePath("/contact");
    return { ok: true, id: savedId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function deleteCourse(id: string): Promise<void> {
  await requireStaff();
  await db.delete(schema.courses).where(eq(schema.courses.id, id));
  updateTag("courses");
  revalidatePath("/admin/courses");
  revalidatePath("/");
  revalidatePath("/courses");
}
