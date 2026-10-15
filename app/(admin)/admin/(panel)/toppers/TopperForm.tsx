"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImagePicker, type PickedMedia } from "@/components/admin/ImagePicker";
import { saveTopper } from "@/lib/actions/toppers";

type Cat = { id: string; label: string };

type TopperRow = {
  id: string;
  name: string;
  exam: string;
  year: number;
  rank: string;
  score: string;
  college: string;
  catId: string;
  mediaId: string | null;
  photoUrl: string | null;
  sortOrder: number;
  published: boolean;
};

export function TopperForm({ initial, categories }: { initial: TopperRow | null; categories: Cat[] }) {
  const router = useRouter();
  const [img, setImg] = useState<PickedMedia | null>(
    initial?.mediaId && initial.photoUrl ? { id: initial.mediaId, url: initial.photoUrl } : null
  );
  const [err, setErr] = useState("");
  const [pending, startTransition] = useTransition();

  const onSubmit = (fd: FormData) => {
    setErr("");
    fd.set("mediaId", img?.id ?? "");
    if (initial) fd.set("id", initial.id);
    startTransition(async () => {
      const res = await saveTopper(fd);
      if (!res.ok) setErr(res.error);
      else router.push("/admin/toppers");
    });
  };

  return (
    <form className="frm" action={onSubmit}>
      <div className="frm__top">
        <Link className="frm__back" href="/admin/toppers">← Back to toppers</Link>
        <span className="frm__hint">{initial ? "Editing topper" : "New topper"}</span>
      </div>
      {err ? <p className="frm__err">{err}</p> : null}
      <div className="frm__grid">
        <label className="frm__field">
          <span>Name *</span>
          <input name="name" defaultValue={initial?.name} required />
        </label>
        <label className="frm__field">
          <span>Exam *</span>
          <input name="exam" defaultValue={initial?.exam} placeholder="JEE Advanced" required />
        </label>
        <label className="frm__field">
          <span>Year *</span>
          <input name="year" type="number" defaultValue={initial?.year ?? new Date().getFullYear()} required />
        </label>
        <label className="frm__field">
          <span>Rank *</span>
          <input name="rank" defaultValue={initial?.rank} placeholder="AIR 1,284" required />
        </label>
        <label className="frm__field">
          <span>Score</span>
          <input name="score" defaultValue={initial?.score} placeholder="99.62 %ile" />
        </label>
        <label className="frm__field">
          <span>College</span>
          <input name="college" defaultValue={initial?.college} placeholder="IIT Bombay" />
        </label>
        <label className="frm__field">
          <span>Category *</span>
          <select name="catId" defaultValue={initial?.catId ?? categories[0]?.id} required>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="frm__field">
          <span>Sort order</span>
          <input name="sortOrder" type="number" defaultValue={initial?.sortOrder ?? 0} />
        </label>
        <div className="frm__field frm__field--full">
          <span className="frm__checks">
            <label>
              <input name="published" type="checkbox" defaultChecked={initial ? initial.published : true} /> Published
            </label>
          </span>
        </div>
        <div className="frm__field frm__field--full">
          <ImagePicker value={img} onChange={setImg} label="Photo" aspect={1} aspectLabel="1:1 circle" />
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
