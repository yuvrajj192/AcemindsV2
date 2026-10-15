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

export async function saveReview(fd: FormData): Promise<SaveResult> {
  try {
    await requireStaff();
    const name = text(fd, "name");
    const role = text(fd, "role");
    const body = text(fd, "body");
    if (!name || !role || !body) return { ok: false, error: "Name, role and review text are required." };

    const values = {
      name,
      role,
      body,
      sortOrder: Number(fd.get("sortOrder") || 0),
      published: fd.get("published") === "on",
    };

    const id = text(fd, "id");
    let savedId = id;
    if (id) {
      await db.update(schema.reviews).set(values).where(eq(schema.reviews.id, id));
    } else {
      const [row] = await db.insert(schema.reviews).values(values).returning({ id: schema.reviews.id });
      savedId = row.id;
    }
    updateTag("reviews");
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    revalidatePath("/testimonials");
    return { ok: true, id: savedId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function deleteReview(id: string): Promise<void> {
  await requireStaff();
  await db.delete(schema.reviews).where(eq(schema.reviews.id, id));
  updateTag("reviews");
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  revalidatePath("/testimonials");
}
