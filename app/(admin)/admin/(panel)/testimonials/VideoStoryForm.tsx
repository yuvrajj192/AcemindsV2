"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveVideoStory } from "@/lib/actions/videoStories";

type VideoStoryRow = {
  id: string;
  name: string;
  batch: string;
  headline: string;
  lines: string[];
  videoUrl: string;
  sortOrder: number;
  published: boolean;
};

export function VideoStoryForm({ initial }: { initial: VideoStoryRow | null }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [pending, startTransition] = useTransition();

  const onSubmit = (fd: FormData) => {
    setErr("");
    if (initial) fd.set("id", initial.id);
    startTransition(async () => {
      const res = await saveVideoStory(fd);
      if (!res.ok) setErr(res.error);
      else router.push("/admin/testimonials?t=stories");
    });
  };

  return (
    <form className="frm" action={onSubmit}>
      <div className="frm__top">
        <Link className="frm__back" href="/admin/testimonials?t=stories">← Back to video stories</Link>
        <span className="frm__hint">{initial ? "Editing video story" : "New video story"}</span>
      </div>
      {err ? <p className="frm__err">{err}</p> : null}
      <div className="frm__grid">
        <label className="frm__field">
          <span>Student name *</span>
          <input name="name" defaultValue={initial?.name} placeholder="Aarav Sharma" required />
        </label>
        <label className="frm__field">
          <span>Batch / year *</span>
          <input name="batch" defaultValue={initial?.batch} placeholder="2026 Batch" required />
        </label>
        <label className="frm__field">
          <span>Headline (big result) *</span>
          <input name="headline" defaultValue={initial?.headline} placeholder="IIT Bombay" required />
        </label>
        <label className="frm__field frm__field--full">
          <span>Result lines (one per line)</span>
          <textarea name="lines" rows={3} defaultValue={initial?.lines.join("\n")} placeholder={"JEE Adv AIR 1,284\nJEE Main 99.62 %ile"} />
        </label>
        <label className="frm__field frm__field--full">
          <span>YouTube video link *</span>
          <input name="videoUrl" defaultValue={initial?.videoUrl} placeholder="https://www.youtube.com/watch?v=… or https://youtu.be/…" required />
          <small>Paste any YouTube link (watch, share, Shorts or embed) — it plays in the site&apos;s video player automatically.</small>
        </label>
        <label className="frm__field">
          <span>Sort order</span>
          <input name="sortOrder" type="number" defaultValue={initial?.sortOrder ?? 0} />
        </label>
        <div className="frm__field">
          <span className="frm__checks">
            <label>
              <input name="published" type="checkbox" defaultChecked={initial ? initial.published : true} /> Published
            </label>
          </span>
        </div>
      </div>
      <div className="frm__actions">
        <button className="btn-gold btn-gold--sm" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
