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

const THEMES = ["p-gold", "p-navy", "p-cream"] as const;

export async function savePoster(fd: FormData): Promise<SaveResult> {
  try {
    await requireStaff();
    const title = text(fd, "title");
    const dateText = text(fd, "dateText");
    if (!title || !dateText) return { ok: false, error: "Title and date line are required." };

    const themeRaw = text(fd, "theme", "p-gold");
    const theme: (typeof THEMES)[number] =
      themeRaw === "p-navy" || themeRaw === "p-cream" ? themeRaw : "p-gold";
    const values = {
      theme,
      dateText,
      title,
      body: text(fd, "body"),
      cta: text(fd, "cta"),
      href: text(fd, "href"),
      deco: text(fd, "deco"),
      sortOrder: Number(fd.get("sortOrder") || 0),
      published: fd.get("published") === "on",
    };

    const id = text(fd, "id");
    let savedId = id;
    if (id) {
      await db.update(schema.posters).set(values).where(eq(schema.posters.id, id));
    } else {
      const [row] = await db.insert(schema.posters).values(values).returning({ id: schema.posters.id });
      savedId = row.id;
    }
    updateTag("posters");
    revalidatePath("/admin/posters");
    revalidatePath("/");
    return { ok: true, id: savedId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function deletePoster(id: string): Promise<void> {
  await requireStaff();
  await db.delete(schema.posters).where(eq(schema.posters.id, id));
  updateTag("posters");
  revalidatePath("/admin/posters");
  revalidatePath("/");
}
