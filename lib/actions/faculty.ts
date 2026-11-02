"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getSession } from "@/lib/session";
import { updateTag } from "next/cache";

async function requireStaff() {
  const user = await getSession();
  if (!user) throw new Error("Not signed in.");
  return user;
}

function text(fd: FormData, key: string, fallback = "") {
  return String(fd.get(key) ?? fallback).trim();
}

export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

export async function saveFaculty(fd: FormData): Promise<SaveResult> {
  try {
    await requireStaff();
    const name = text(fd, "name");
    const role = text(fd, "role");
    const subject = text(fd, "subject");
    if (!name || !role || !subject) return { ok: false, error: "Name, role and subject are required." };

    const mediaId = text(fd, "mediaId") || null;
    const values = {
      name,
      role,
      edu: text(fd, "edu"),
      exp: text(fd, "exp"),
      subject,
      mediaId,
      tags: text(fd, "tags")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      bio: text(fd, "bio"),
      isFounder: fd.get("isFounder") === "on",
      published: fd.get("published") === "on",
    };

    const id = text(fd, "id");
    let savedId = id;
    if (id) {
      /* sortOrder is not in the form anymore — editing must never touch it (drag handles order) */
      await db.update(schema.faculty).set(values).where(eq(schema.faculty.id, id));
    } else {
      /* new rows land at the end; drag to position them */
      const [agg] = await db
        .select({ m: sql<number>`coalesce(max(${schema.faculty.sortOrder}), -1)` })
        .from(schema.faculty);
      const [row] = await db
        .insert(schema.faculty)
        .values({ ...values, sortOrder: (agg?.m ?? -1) + 1 })
        .returning({ id: schema.faculty.id });
      savedId = row.id;
    }
    updateTag("faculty");
    revalidatePath("/admin/faculty");
    return { ok: true, id: savedId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function deleteFaculty(id: string): Promise<void> {
  await requireStaff();
  await db.delete(schema.faculty).where(eq(schema.faculty.id, id));
  updateTag("faculty");
  revalidatePath("/admin/faculty");
}

/* Persist a drag-reposition: ids in display order → consecutive sort_order 0..n-1 */
export async function reorderFaculty(ids: string[]): Promise<void> {
  await requireStaff();
  await db.transaction(async (tx) => {
    for (let i = 0; i < ids.length; i++) {
      await tx.update(schema.faculty).set({ sortOrder: i }).where(eq(schema.faculty.id, ids[i]));
    }
  });
  updateTag("faculty");
  revalidatePath("/admin/faculty");
}
