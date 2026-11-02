"use server";

import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";
import { eq, sql } from "drizzle-orm";
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
      published: fd.get("published") === "on",
    };

    const id = text(fd, "id");
    let savedId = id;
    if (id) {
      /* sortOrder is not in the form anymore — editing must never touch it (drag handles order) */
      await db.update(schema.toppers).set(values).where(eq(schema.toppers.id, id));
    } else {
      /* new rows land at the end; drag to position them */
      const [agg] = await db
        .select({ m: sql<number>`coalesce(max(${schema.toppers.sortOrder}), -1)` })
        .from(schema.toppers);
      const [row] = await db
        .insert(schema.toppers)
        .values({ ...values, sortOrder: (agg?.m ?? -1) + 1 })
        .returning({ id: schema.toppers.id });
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

/* Persist a drag-reposition: ids in display order → consecutive sort_order 0..n-1 */
export async function reorderToppers(ids: string[]): Promise<void> {
  await requireStaff();
  await db.transaction(async (tx) => {
    for (let i = 0; i < ids.length; i++) {
      await tx.update(schema.toppers).set({ sortOrder: i }).where(eq(schema.toppers.id, ids[i]));
    }
  });
  updateTag("toppers");
  revalidatePath("/admin/toppers");
}
