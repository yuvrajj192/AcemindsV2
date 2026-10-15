"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImagePicker, type PickedMedia } from "@/components/admin/ImagePicker";
import { saveSlide } from "@/lib/actions/slides";

type SlideRow = {
  id: string;
  mediaId: string | null;
  imageUrl: string | null;
  kicker: string;
  title: string;
  videoUrl: string;
  sortOrder: number;
  published: boolean;
};

export function SlideForm({ initial }: { initial: SlideRow | null }) {
  const router = useRouter();
  const [img, setImg] = useState<PickedMedia | null>(
    initial?.mediaId && initial.imageUrl ? { id: initial.mediaId, url: initial.imageUrl } : null
  );
  const [err, setErr] = useState("");
  const [pending, startTransition] = useTransition();

  const onSubmit = (fd: FormData) => {
    setErr("");
    fd.set("mediaId", img?.id ?? "");
    if (initial) fd.set("id", initial.id);
    startTransition(async () => {
      const res = await saveSlide(fd);
      if (!res.ok) setErr(res.error);
      else router.push("/admin/slides");
    });
  };

  return (
    <form className="frm" action={onSubmit}>
      <div className="frm__top">
        <Link className="frm__back" href="/admin/slides">← Back to slides</Link>
        <span className="frm__hint">{initial ? "Editing slide" : "New slide"}</span>
      </div>
      {err ? <p className="frm__err">{err}</p> : null}
      <div className="frm__grid">
        <label className="frm__field">
          <span>Kicker *</span>
          <input name="kicker" defaultValue={initial?.kicker} placeholder="Admissions 2027" required />
        </label>
        <label className="frm__field">
          <span>Title *</span>
          <input name="title" defaultValue={initial?.title} required />
        </label>
        <label className="frm__field frm__field--full">
          <span>Video URL (YouTube link opened by the slide CTA, optional)</span>
          <input name="videoUrl" defaultValue={initial?.videoUrl} placeholder="https://youtube.com/…" />
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
        <div className="frm__field frm__field--full">
          <ImagePicker value={img} onChange={setImg} label="Slide image" aspect={16 / 9} aspectLabel="16:9" />
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
