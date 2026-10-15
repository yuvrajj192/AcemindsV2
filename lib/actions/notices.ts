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

export async function saveNotice(fd: FormData): Promise<SaveResult> {
  try {
    await requireStaff();
    const noticeText = text(fd, "text");
    if (!noticeText) return { ok: false, error: "Ticker text is required." };

    const values = {
      text: noticeText,
      href: text(fd, "href", "/"),
      active: fd.get("active") === "on",
      sortOrder: Number(fd.get("sortOrder") || 0),
    };

    const id = text(fd, "id");
    let savedId = id;
    if (id) {
      await db.update(schema.notices).set(values).where(eq(schema.notices.id, id));
    } else {
      const [row] = await db.insert(schema.notices).values(values).returning({ id: schema.notices.id });
      savedId = row.id;
    }
    updateTag("notices");
    revalidatePath("/admin/notices");
    revalidatePath("/", "layout");
    return { ok: true, id: savedId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function deleteNotice(id: string): Promise<void> {
  await requireStaff();
  await db.delete(schema.notices).where(eq(schema.notices.id, id));
  updateTag("notices");
  revalidatePath("/admin/notices");
  revalidatePath("/", "layout");
}
