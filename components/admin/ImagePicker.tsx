"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { listMedia } from "@/lib/actions/media";
import { uploadToLibrary, uploadBlobToLibrary, fmtBytes } from "@/lib/client/media-upload";
import { ImageCropper } from "@/components/admin/ImageCropper";

export type PickedMedia = { id: string; url: string };

type MediaRow = { id: string; url: string; filename: string; width: number | null; height: number | null; size: number; alt: string };

type CropJob =
  | { src: string; mode: "library"; m: MediaRow }
  | { src: string; mode: "upload"; file: File; objectUrl: string }
  | { src: string; mode: "re" };

const SKIP_CROP = new Set(["image/gif", "image/svg+xml"]);

export function ImagePicker({
  value,
  onChange,
  label = "Photo",
  aspect,
  aspectLabel,
}: {
  value: PickedMedia | null;
  onChange: (v: PickedMedia | null) => void;
  label?: string;
  aspect?: number;
  aspectLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [rows, setRows] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [uploadState, setUploadState] = useState("");
  const [err, setErr] = useState("");
  const [cropJob, setCropJob] = useState<CropJob | null>(null);
  const [cropping, setCropping] = useState(false);
  const [cropErr, setCropErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async (search: string) => {
    setLoading(true);
    try {
      setRows(await listMedia(search));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load library.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && tab === "library" && !rows.length && !loading) void load("");
  }, [open, tab, rows.length, loading, load]);

  useEffect(() => {
    return () => {
      if (cropJob?.mode === "upload") URL.revokeObjectURL(cropJob.objectUrl);
    };
  }, [cropJob]);

  const pick = (m: MediaRow) => {
    onChange({ id: m.id, url: m.url });
    setOpen(false);
  };

  const closeCrop = () => {
    if (cropJob?.mode === "upload") URL.revokeObjectURL(cropJob.objectUrl);
    setCropJob(null);
    setCropErr("");
  };

  const uploadOne = async (file: File) => {
    setErr("");
    setUploadState(`Compressing ${file.name}…`);
    try {
      const stored = await uploadToLibrary(file);
      setUploadState(`Saving ${stored.filename}…`);
      onChange({ id: stored.id, url: stored.url });
      setRows((prev) => [
        { id: stored.id, url: stored.url, filename: stored.filename, width: stored.width || null, height: stored.height || null, size: stored.size, alt: "" },
        ...prev,
      ]);
      setUploadState("");
      setOpen(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
      setUploadState("");
    }
  };

  const doUpload = async (files: FileList | File[]) => {
    setErr("");
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (aspect && !SKIP_CROP.has(file.type)) {
        const objectUrl = URL.createObjectURL(file);
        setCropJob({ src: objectUrl, mode: "upload", file, objectUrl });
        return;
      }
      await uploadOne(file);
      return;
    }
  };

  const onCropDone = async (blob: Blob, width: number, height: number) => {
    if (!cropJob) return;
    setCropping(true);
    setCropErr("");
    const base =
      cropJob.mode === "upload"
        ? cropJob.file.name.replace(/\.[^.]+$/, "")
        : cropJob.src.split("/").pop()?.split("?")[0]?.replace(/\.[^.]+$/, "") || "image";
    const filename = `${base}-crop.webp`;
    try {
      const stored = await uploadBlobToLibrary(blob, filename, "image/webp", { width, height });
      onChange({ id: stored.id, url: stored.url });
      setRows((prev) => [
        { id: stored.id, url: stored.url, filename, width, height, size: blob.size, alt: "" },
        ...prev,
      ]);
      if (cropJob.mode === "upload") URL.revokeObjectURL(cropJob.objectUrl);
      setCropJob(null);
      setOpen(false);
    } catch (e) {
      setCropErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setCropping(false);
    }
  };

  const useOriginal = () => {
    if (!cropJob) return;
    if (cropJob.mode === "library") {
      pick(cropJob.m);
      closeCrop();
    } else if (cropJob.mode === "upload") {
      const { file, objectUrl } = cropJob;
      setCropJob(null);
      URL.revokeObjectURL(objectUrl);
      void uploadOne(file);
    }
  };

  return (
    <div className="ip">
      <div className="ip__row">
        <span className="ip__label">{label}</span>
        <div className="ip__preview">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.url} alt="" />
          ) : (
            <span className="ip__empty">No image</span>
          )}
        </div>
        <div className="ip__btns">
          <button type="button" className="btn-s" onClick={() => { setOpen(true); setTab("library"); if (!rows.length) void load(""); }}>
            Choose…
          </button>
          <button type="button" className="btn-s" onClick={() => { setOpen(true); setTab("upload"); }}>
            Upload new
          </button>
          {value && aspect ? (
            <button
              type="button"
              className="btn-s"
              onClick={() => { setOpen(true); setCropJob({ src: value.url, mode: "re" }); }}
            >
              Crop…
            </button>
          ) : null}
          {value ? (
            <button type="button" className="btn-s btn-s--danger" onClick={() => onChange(null)}>
              Remove
            </button>
          ) : null}
        </div>
      </div>

      {open ? (
        <div className="ip__overlay" role="dialog" aria-modal="true" aria-label="Media picker" onClick={() => setOpen(false)}>
          <div className="ip__modal" onClick={(e) => e.stopPropagation()}>
            <div className="ip__head">
              <div className="ip__tabs">
                <button type="button" className={tab === "library" && !cropJob ? "is-active" : ""} onClick={() => { setTab("library"); closeCrop(); }}>
                  Library
                </button>
                <button type="button" className={tab === "upload" && !cropJob ? "is-active" : ""} onClick={() => { setTab("upload"); closeCrop(); }}>
                  Upload
                </button>
                {aspect ? <span className="ip__ratio">Crop: {aspectLabel}</span> : null}
              </div>
              <button type="button" className="ip__close" onClick={() => setOpen(false)} aria-label="Close">
                ×
              </button>
            </div>

            {cropJob ? (
              <div className="ip__body">
                <ImageCropper
                  src={cropJob.src}
                  aspect={aspect ?? 1}
                  aspectLabel={aspectLabel}
                  busy={cropping}
                  err={cropErr}
                  onCancel={closeCrop}
                  onUseOriginal={cropJob.mode === "re" ? undefined : useOriginal}
                  onDone={(blob, w, h) => void onCropDone(blob, w, h)}
                />
              </div>
            ) : tab === "library" ? (
              <div className="ip__body">
                <input
                  className="ip__search"
                  placeholder="Search filename or alt…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void load(q);
                  }}
                />
                {err ? <p className="media__err">{err}</p> : null}
                <div className="ip__grid">
                  {loading ? <p className="media__empty">Loading…</p> : null}
                  {!loading && !rows.length ? <p className="media__empty">Library is empty — upload something first.</p> : null}
                  {rows.map((m) => (
                    <button
                      type="button"
                      className={`ip__cell${value?.id === m.id ? " is-selected" : ""}`}
                      key={m.id}
                      onClick={() => (aspect ? setCropJob({ src: m.url, mode: "library", m }) : pick(m))}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.url} alt={m.alt || m.filename} loading="lazy" />
                      <span title={m.filename}>
                        {m.filename}
                        <em>{fmtBytes(m.size)}</em>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="ip__body">
                <div
                  className="media__drop"
                  onClick={() => fileRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
                  }}
                >
                  <strong>Drop an image or click to browse</strong>
                  <span>{aspect ? `Auto-compressed, then crop to ${aspectLabel}` : "Auto-compressed to WebP before upload"}</span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      if (e.target.files?.length) void doUpload(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </div>
                {uploadState ? <p className="ip__status">{uploadState}</p> : null}
                {err ? <p className="media__err">{err}</p> : null}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
