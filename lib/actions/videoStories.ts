"use server";

import { revalidatePath, updateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getSession } from "@/lib/session";
import { isYouTubeUrl, toYouTubeEmbed } from "@/lib/youtube";

async function requireStaff() {
  const user = await getSession();
  if (!user) throw new Error("Not signed in.");
  return user;
}

function text(fd: FormData, key: string, fallback = "") {
  return String(fd.get(key) ?? fallback).trim();
}

export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

export async function saveVideoStory(fd: FormData): Promise<SaveResult> {
  try {
    await requireStaff();
    const name = text(fd, "name");
    const batch = text(fd, "batch");
    const headline = text(fd, "headline");
    const rawVideo = text(fd, "videoUrl");
    if (!name || !batch || !headline) return { ok: false, error: "Name, batch and headline are required." };
    if (!rawVideo) return { ok: false, error: "Video link is required." };
    const videoUrl = toYouTubeEmbed(rawVideo);
    if (!isYouTubeUrl(rawVideo)) return { ok: false, error: "Please paste a valid YouTube link." };

    const lines = text(fd, "lines")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const values = {
      name,
      batch,
      headline,
      lines,
      videoUrl,
      sortOrder: Number(fd.get("sortOrder") || 0),
      published: fd.get("published") === "on",
    };

    const id = text(fd, "id");
    let savedId = id;
    if (id) {
      await db.update(schema.videoStories).set(values).where(eq(schema.videoStories.id, id));
    } else {
      const [row] = await db.insert(schema.videoStories).values(values).returning({ id: schema.videoStories.id });
      savedId = row.id;
    }
    updateTag("video-stories");
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    revalidatePath("/results");
    revalidatePath("/testimonials");
    return { ok: true, id: savedId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function deleteVideoStory(id: string): Promise<void> {
  await requireStaff();
  await db.delete(schema.videoStories).where(eq(schema.videoStories.id, id));
  updateTag("video-stories");
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  revalidatePath("/results");
  revalidatePath("/testimonials");
}
