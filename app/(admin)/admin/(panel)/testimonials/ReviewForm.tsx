"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveReview } from "@/lib/actions/reviews";

type ReviewRow = { id: string; name: string; role: string; body: string; sortOrder: number; published: boolean };

export function ReviewForm({ initial }: { initial: ReviewRow | null }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [pending, startTransition] = useTransition();

  const onSubmit = (fd: FormData) => {
    setErr("");
    if (initial) fd.set("id", initial.id);
    startTransition(async () => {
      const res = await saveReview(fd);
      if (!res.ok) setErr(res.error);
      else router.push("/admin/testimonials");
    });
  };

  return (
    <form className="frm" action={onSubmit}>
      <div className="frm__top">
        <Link className="frm__back" href="/admin/testimonials">← Back to testimonials</Link>
        <span className="frm__hint">{initial ? "Editing testimonial" : "New testimonial"}</span>
      </div>
      {err ? <p className="frm__err">{err}</p> : null}
      <div className="frm__grid">
        <label className="frm__field">
          <span>Name *</span>
          <input name="name" defaultValue={initial?.name} placeholder="Sneha Kulkarni" required />
        </label>
        <label className="frm__field">
          <span>Role / line *</span>
          <input name="role" defaultValue={initial?.role} placeholder="NEET 2026 · AIR 2,105" required />
        </label>
        <label className="frm__field frm__field--full">
          <span>Review text *</span>
          <textarea name="body" rows={5} defaultValue={initial?.body} required />
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
