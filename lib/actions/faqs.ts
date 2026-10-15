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

export async function saveFaq(fd: FormData): Promise<SaveResult> {
  try {
    await requireStaff();
    const q = text(fd, "q");
    const a = text(fd, "a");
    if (!q || !a) return { ok: false, error: "Question and answer are required." };

    const values = {
      q,
      a,
      sortOrder: Number(fd.get("sortOrder") || 0),
      published: fd.get("published") === "on",
    };

    const id = text(fd, "id");
    let savedId = id;
    if (id) {
      await db.update(schema.faqs).set(values).where(eq(schema.faqs.id, id));
    } else {
      const [row] = await db.insert(schema.faqs).values(values).returning({ id: schema.faqs.id });
      savedId = row.id;
    }
    updateTag("faqs");
    revalidatePath("/admin/faqs");
    revalidatePath("/");
    revalidatePath("/courses");
    return { ok: true, id: savedId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function deleteFaq(id: string): Promise<void> {
  await requireStaff();
  await db.delete(schema.faqs).where(eq(schema.faqs.id, id));
  updateTag("faqs");
  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/courses");
}
