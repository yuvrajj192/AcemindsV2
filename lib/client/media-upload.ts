"use client";

import { requestUpload, saveMedia } from "@/lib/actions/media";

const MAX_DIM = 2000;
const WEBP_QUALITY = 0.82;
const SKIP_TYPES = new Set(["image/gif", "image/svg+xml"]);

export type CompressedImage = {
  blob: Blob;
  width: number;
  height: number;
  mimeType: string;
  filename: string;
  originalSize: number;
};

/** Presign → PUT to R2 → save DB row. Returns the stored media identity. */
export async function uploadBlobToLibrary(
  blob: Blob,
  filename: string,
  mimeType = "image/webp",
  dims?: { width: number; height: number }
): Promise<{ id: string; url: string; key: string; filename: string; width: number; height: number; size: number }> {
  const ticket = await requestUpload(filename, mimeType, blob.size);
  const put = await fetch(ticket.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": mimeType },
    body: blob,
  });
  if (!put.ok) throw new Error(`R2 upload failed (${put.status}).`);
  const { id } = await saveMedia({
    key: ticket.key,
    filename,
    mimeType,
    size: blob.size,
    width: dims?.width || undefined,
    height: dims?.height || undefined,
    folder: ticket.folder,
  });
  return { id, url: ticket.publicUrl, key: ticket.key, filename, width: dims?.width ?? 0, height: dims?.height ?? 0, size: blob.size };
}

export async function compressToWebp(file: File): Promise<CompressedImage> {
  if (SKIP_TYPES.has(file.type)) {
    return { blob: file, width: 0, height: 0, mimeType: file.type, filename: file.name, originalSize: file.size };
  }
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", WEBP_QUALITY));
  if (!blob) throw new Error("Could not convert image.");
  const base = file.name.replace(/\.[^.]+$/, "") || "image";
  return { blob, width, height, mimeType: "image/webp", filename: `${base}.webp`, originalSize: file.size };
}

/** Compress → presign → PUT to R2 → save DB row. Returns the stored media identity. */
export async function uploadToLibrary(file: File): Promise<{ id: string; url: string; key: string; filename: string; width: number; height: number; size: number }> {
  const c = await compressToWebp(file);
  return uploadBlobToLibrary(c.blob, c.filename, c.mimeType, { width: c.width, height: c.height });
}

export function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
