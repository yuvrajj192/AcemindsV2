"use client";

import { useEffect, useRef, useState, useCallback, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { requestUpload, saveMedia, deleteMedia } from "@/lib/actions/media";

type MediaItem = {
  id: string;
  key: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string;
  folder: string;
  createdAt: string;
};

const MAX_DIM = 2000;
const WEBP_QUALITY = 0.82;
const SKIP_TYPES = new Set(["image/gif", "image/svg+xml"]);

type Picked = {
  file: File;
  blob: Blob;
  width: number;
  height: number;
  mimeType: string;
  filename: string;
  status: "ready" | "uploading" | "saving" | "done" | "error";
  error?: string;
  publicUrl?: string;
};

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function compressToWebp(file: File): Promise<Pick<Picked, "blob" | "width" | "height" | "mimeType" | "filename">> {
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
  return { blob, width, height, mimeType: "image/webp", filename: `${base}.webp` };
}

export function MediaLibrary({ initial, q = "" }: { initial: MediaItem[]; q?: string }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [queue, setQueue] = useState<Picked[]>([]);
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState(q);
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  // server search results arrive as new props — keep the grid in sync
  useEffect(() => setItems(initial), [initial]);
  useEffect(() => setQuery(q), [q]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setErr("");
    const accepted: Picked[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      try {
        if (SKIP_TYPES.has(file.type)) {
          accepted.push({
            file,
            blob: file,
            width: 0,
            height: 0,
            mimeType: file.type,
            filename: file.name,
            status: "ready",
          });
        } else {
          const c = await compressToWebp(file);
          accepted.push({ file, ...c, status: "ready" });
        }
      } catch {
        setErr(`Could not read ${file.name} — skipped.`);
      }
    }
    if (!accepted.length) return;
    setQueue((q) => [...q, ...accepted]);
    for (const item of accepted) {
      setQueue((q) => q.map((p) => (p.file === item.file ? { ...p, status: "uploading" } : p)));
      try {
        const ticket = await requestUpload(item.filename, item.mimeType, item.blob.size);
        const put = await fetch(ticket.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": item.mimeType },
          body: item.blob,
        });
        if (!put.ok) throw new Error(`R2 upload failed (${put.status}).`);
        setQueue((q) => q.map((p) => (p.file === item.file ? { ...p, status: "saving" } : p)));
        await saveMedia({
          key: ticket.key,
          filename: item.filename,
          mimeType: item.mimeType,
          size: item.blob.size,
          width: item.width || undefined,
          height: item.height || undefined,
          folder: ticket.folder,
        });
        setQueue((q) => q.map((p) => (p.file === item.file ? { ...p, status: "done", publicUrl: ticket.publicUrl } : p)));
        setItems((prev) => [
          {
            id: ticket.key,
            key: ticket.key,
            url: ticket.publicUrl,
            filename: item.filename,
            mimeType: item.mimeType,
            size: item.blob.size,
            width: item.width || null,
            height: item.height || null,
            alt: "",
            folder: ticket.folder,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Upload failed.";
        setQueue((q) => q.map((p) => (p.file === item.file ? { ...p, status: "error", error: msg } : p)));
      }
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files?.length) void handleFiles(e.dataTransfer.files);
  };

  const remove = (id: string) => {
    if (!confirm("Delete this file from R2 and the library?")) return;
    startTransition(async () => {
      await deleteMedia(id);
      setItems((prev) => prev.filter((m) => m.id !== id));
    });
  };

  return (
    <div className="media">
      <form
        className="media__search"
        onSubmit={(e) => {
          e.preventDefault();
          const term = query.trim();
          router.push(term ? `/admin/media?q=${encodeURIComponent(term)}` : "/admin/media");
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by filename, alt or key…"
          aria-label="Search media"
        />
        <button className="btn-s" type="submit">
          Search
        </button>
        {q ? (
          <button
            className="btn-s"
            type="button"
            onClick={() => {
              setQuery("");
              router.push("/admin/media");
            }}
          >
            Clear
          </button>
        ) : null}
      </form>
      {q ? (
        <p className="media__search-note">
          {items.length
            ? `${items.length} result${items.length === 1 ? "" : "s"} for “${q}”`
            : `No images match “${q}”.`}
        </p>
      ) : null}
      <div
        className={`media__drop${drag ? " is-drag" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <strong>Drop images here</strong>
        <span>or click to browse — auto-compressed to WebP (max {MAX_DIM}px)</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files?.length) void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {err ? <p className="media__err">{err}</p> : null}

      {queue.length ? (
        <ul className="media__queue" aria-label="Upload progress">
          {queue.map((p, i) => (
            <li key={i} className={`media__queue-item is-${p.status}`}>
              <span className="media__queue-name">{p.filename}</span>
              <span className="media__queue-size">
                {fmtSize(p.blob.size)}
                {p.file.size !== p.blob.size ? ` (was ${fmtSize(p.file.size)})` : ""}
              </span>
              <span className="media__queue-status">
                {p.status === "ready" && "queued"}
                {p.status === "uploading" && "uploading…"}
                {p.status === "saving" && "saving…"}
                {p.status === "done" && "done ✓"}
                {p.status === "error" && (p.error ?? "failed")}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="media__grid">
        {items.map((m) => (
          <figure className="media__card" key={m.id}>
            <div className="media__thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt={m.alt || m.filename} loading="lazy" />
            </div>
            <figcaption>
              <div className="media__meta">
                <span title={m.key}>{m.filename}</span>
                <span>
                  {fmtSize(m.size)}
                  {m.width && m.height ? ` · ${m.width}×${m.height}` : ""}
                </span>
              </div>
              <div className="media__actions">
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(m.url);
                  }}
                >
                  Copy URL
                </button>
                <button type="button" className="media__del" disabled={pending} onClick={() => remove(m.id)}>
                  Delete
                </button>
              </div>
            </figcaption>
          </figure>
        ))}
        {!items.length ? <p className="media__empty">No uploads yet — your library starts here.</p> : null}
      </div>
    </div>
  );
}
