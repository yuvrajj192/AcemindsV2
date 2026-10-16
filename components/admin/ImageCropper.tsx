"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

const MAX_DIM = 2000;
const WEBP_QUALITY = 0.82;

export function ImageCropper({
  src,
  aspect,
  aspectLabel,
  busy = false,
  err = "",
  onCancel,
  onUseOriginal,
  onDone,
}: {
  src: string;
  aspect: number;
  aspectLabel?: string;
  busy?: boolean;
  err?: string;
  onCancel: () => void;
  onUseOriginal?: () => void;
  onDone: (blob: Blob, width: number, height: number) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPx, setAreaPx] = useState<Area | null>(null);
  const [cropErr, setCropErr] = useState("");

  const onCropComplete = useCallback((_: Area, px: Area) => setAreaPx(px), []);

  const apply = async () => {
    if (!areaPx || areaPx.width < 1 || areaPx.height < 1) return;
    setCropErr("");
    try {
      /* R2 URLs go through the same-origin proxy: a direct cross-origin fetch can
         hit the cached no-Origin `<img>` response (no ACAO) → "Failed to fetch". */
      const media = src.match(/^https?:\/\/[^/]+\/(media\/[\w./-]+?)(?:[?#].*)?$/);
      const fetchUrl = media ? `/api/media/file?key=${encodeURIComponent(media[1])}` : src;
      const resp = await fetch(fetchUrl);
      if (!resp.ok) throw new Error(`Could not load image (${resp.status}).`);
      const bitmap = await createImageBitmap(await resp.blob());
      const scale = Math.min(1, MAX_DIM / Math.max(areaPx.width, areaPx.height));
      const width = Math.max(1, Math.round(areaPx.width * scale));
      const height = Math.max(1, Math.round(areaPx.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable.");
      ctx.drawImage(bitmap, areaPx.x, areaPx.y, areaPx.width, areaPx.height, 0, 0, width, height);
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", WEBP_QUALITY));
      if (!blob) throw new Error("Could not encode the crop.");
      onDone(blob, width, height);
    } catch (e) {
      setCropErr(e instanceof Error ? e.message : "Crop failed.");
    }
  };

  return (
    <div className="crp">
      <p className="crp__hint">
        Drag to reposition, pinch or scroll to zoom — output fits {aspectLabel ?? "the section"} exactly.
      </p>
      <div className="crp__stage">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <label className="crp__zoom">
        <span>Zoom</span>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
      </label>
      {(cropErr || err) ? <p className="media__err">{cropErr || err}</p> : null}
      <div className="crp__actions">
        <button type="button" className="btn-s" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        {onUseOriginal ? (
          <button type="button" className="btn-s" onClick={onUseOriginal} disabled={busy}>
            Use original
          </button>
        ) : null}
        <button type="button" className="btn-gold btn-gold--sm" onClick={() => void apply()} disabled={busy}>
          {busy ? "Working…" : "Apply crop"}
        </button>
      </div>
    </div>
  );
}
