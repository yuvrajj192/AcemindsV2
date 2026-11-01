"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
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

export async function saveFounder(fd: FormData): Promise<SaveResult> {
  try {
    await requireStaff();
    const name = text(fd, "name");
    const role = text(fd, "role");
    if (!name || !role) return { ok: false, error: "Name and role are required." };

    const mediaId = text(fd, "mediaId") || null;
    const values = {
      name,
      role,
      subject: text(fd, "subject"),
      edu: text(fd, "edu"),
      exp: text(fd, "exp"),
      mediaId,
      tags: text(fd, "tags")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      bio: text(fd, "bio"),
      sortOrder: Number(fd.get("sortOrder") || 0),
      published: fd.get("published") === "on",
    };

    const id = text(fd, "id");
    let savedId = id;
    if (id) {
      await db.update(schema.founders).set(values).where(eq(schema.founders.id, id));
    } else {
      const [row] = await db.insert(schema.founders).values(values).returning({ id: schema.founders.id });
      savedId = row.id;
    }
    updateTag("founders");
    revalidatePath("/admin/founders");
    revalidatePath("/admin/faculty");
    return { ok: true, id: savedId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function deleteFounder(id: string): Promise<void> {
  await requireStaff();
  await db.delete(schema.founders).where(eq(schema.founders.id, id));
  updateTag("founders");
  revalidatePath("/admin/founders");
  revalidatePath("/admin/faculty");
}
