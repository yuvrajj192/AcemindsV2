"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { savePoster } from "@/lib/actions/posters";

type PosterRow = {
  id: string;
  theme: "p-gold" | "p-navy" | "p-cream";
  dateText: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  deco: string;
  sortOrder: number;
  published: boolean;
};

export function PosterForm({ initial }: { initial: PosterRow | null }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [pending, startTransition] = useTransition();

  const onSubmit = (fd: FormData) => {
    setErr("");
    if (initial) fd.set("id", initial.id);
    startTransition(async () => {
      const res = await savePoster(fd);
      if (!res.ok) setErr(res.error);
      else router.push("/admin/posters");
    });
  };

  return (
    <form className="frm" action={onSubmit}>
      <div className="frm__top">
        <Link className="frm__back" href="/admin/posters">← Back to posters</Link>
        <span className="frm__hint">{initial ? "Editing poster" : "New poster"}</span>
      </div>
      {err ? <p className="frm__err">{err}</p> : null}
      <div className="frm__grid">
        <label className="frm__field frm__field--full">
          <span>Title *</span>
          <input name="title" defaultValue={initial?.title} placeholder="CET Crash Course" required />
        </label>
        <label className="frm__field">
          <span>Date line *</span>
          <input name="dateText" defaultValue={initial?.dateText} placeholder="Starting soon" required />
        </label>
        <label className="frm__field">
          <span>Theme</span>
          <select name="theme" defaultValue={initial?.theme ?? "p-gold"}>
            <option value="p-gold">Gold</option>
            <option value="p-navy">Navy</option>
            <option value="p-cream">Cream</option>
          </select>
        </label>
        <label className="frm__field frm__field--full">
          <span>Body</span>
          <textarea name="body" rows={3} defaultValue={initial?.body} placeholder="45 days · 15 full mocks · formula booklet included." />
        </label>
        <label className="frm__field">
          <span>Button label</span>
          <input name="cta" defaultValue={initial?.cta} placeholder="View course" />
        </label>
        <label className="frm__field">
          <span>Button link</span>
          <input name="href" defaultValue={initial?.href} placeholder="/courses?cat=cet" />
        </label>
        <label className="frm__field">
          <span>Deco number (big background figure)</span>
          <input name="deco" defaultValue={initial?.deco} placeholder="45" />
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
