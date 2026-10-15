"use server";

import { updateTag } from "next/cache";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db, schema } from "@/lib/db";
import { getSession } from "@/lib/session";
import { presignUpload, deleteObject, publicUrlFor } from "@/lib/r2";

const ALLOWED = new Set(["image/webp", "image/jpeg", "image/png", "image/gif", "image/svg+xml"]);
const MAX_ORIGINAL_BYTES = 15 * 1024 * 1024;

export type UploadTicket = { key: string; uploadUrl: string; publicUrl: string; folder: string };

async function requireStaff() {
  const user = await getSession();
  if (!user) throw new Error("Not signed in.");
  return user;
}

/** Step 1 — get a presigned PUT for an already-compressed client blob. */
export async function requestUpload(filename: string, mimeType: string, size: number): Promise<UploadTicket> {
  await requireStaff();
  if (!ALLOWED.has(mimeType)) throw new Error("Unsupported file type. Use JPEG, PNG, WebP, GIF or SVG.");
  if (size <= 0 || size > MAX_ORIGINAL_BYTES) throw new Error("File is too large (max 15 MB).");

  const month = new Date().toISOString().slice(0, 7);
  const ext = mimeType === "image/webp" ? "webp" : mimeType === "image/svg+xml" ? "svg" : mimeType === "image/gif" ? "gif" : mimeType === "image/png" ? "png" : "jpg";
  const key = `media/${month}/${randomUUID()}.${ext}`;
  const uploadUrl = await presignUpload(key, mimeType);
  return { key, uploadUrl, publicUrl: publicUrlFor(key), folder: month };
}

/** Step 2 — persist metadata after the browser PUT succeeded. */
export async function saveMedia(input: {
  key: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  folder?: string;
}): Promise<{ id: string }> {
  await requireStaff();
  if (!input.key.startsWith("media/")) throw new Error("Invalid key.");
  const [row] = await db
    .insert(schema.media)
    .values({
      key: input.key,
      url: publicUrlFor(input.key),
      filename: input.filename.slice(0, 200),
      mimeType: input.mimeType,
      size: input.size,
      width: input.width ?? null,
      height: input.height ?? null,
      alt: (input.alt ?? "").slice(0, 300),
      folder: input.folder ?? "",
    })
    .returning({ id: schema.media.id });
  updateTag("media");
  return { id: row.id };
}

export async function deleteMedia(id: string): Promise<void> {
  const user = await requireStaff();
  if (user.role !== "owner" && user.role !== "editor") throw new Error("Not allowed.");
  const row = await db.query.media.findFirst({ where: eq(schema.media.id, id) });
  if (!row) return;
  await db.delete(schema.media).where(and(eq(schema.media.id, id)));
  try {
    await deleteObject(row.key);
  } catch {
    /* object may already be gone — row delete is what matters */
  }
  updateTag("media");
}

export async function updateAlt(id: string, alt: string): Promise<void> {
  await requireStaff();
  await db.update(schema.media).set({ alt: alt.slice(0, 300) }).where(eq(schema.media.id, id));
  updateTag("media");
}

/** Lightweight listing for the image picker modal. */
export async function listMedia(q = "", limit = 80): Promise<
  { id: string; url: string; filename: string; width: number | null; height: number | null; size: number; alt: string }[]
> {
  await requireStaff();
  const term = q.trim();
  const rows = await db.query.media.findMany({
    where: term
      ? or(ilike(schema.media.filename, `%${term}%`), ilike(schema.media.alt, `%${term}%`))
      : undefined,
    orderBy: desc(schema.media.createdAt),
    limit,
  });
  return rows.map((m) => ({
    id: m.id,
    url: m.url,
    filename: m.filename,
    width: m.width,
    height: m.height,
    size: m.size,
    alt: m.alt,
  }));
}
