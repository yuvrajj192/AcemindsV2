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

export async function saveTopper(fd: FormData): Promise<SaveResult> {
  try {
    await requireStaff();
    const name = text(fd, "name");
    const exam = text(fd, "exam");
    const catId = text(fd, "catId");
    const year = Number(fd.get("year"));
    if (!name || !exam || !catId || !year) return { ok: false, error: "Name, exam, year and category are required." };

    const values = {
      name,
      exam,
      year,
      rank: text(fd, "rank"),
      score: text(fd, "score"),
      college: text(fd, "college"),
      catId,
      mediaId: text(fd, "mediaId") || null,
      sortOrder: Number(fd.get("sortOrder") || 0),
      published: fd.get("published") === "on",
    };

    const id = text(fd, "id");
    let savedId = id;
    if (id) {
      await db.update(schema.toppers).set(values).where(eq(schema.toppers.id, id));
    } else {
      const [row] = await db.insert(schema.toppers).values(values).returning({ id: schema.toppers.id });
      savedId = row.id;
    }
    updateTag("toppers");
    revalidatePath("/admin/toppers");
    return { ok: true, id: savedId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function deleteTopper(id: string): Promise<void> {
  await requireStaff();
  await db.delete(schema.toppers).where(eq(schema.toppers.id, id));
  updateTag("toppers");
  revalidatePath("/admin/toppers");
}
