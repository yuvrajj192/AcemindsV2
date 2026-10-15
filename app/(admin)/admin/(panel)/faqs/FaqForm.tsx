"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveFaq } from "@/lib/actions/faqs";

type FaqRow = { id: string; q: string; a: string; sortOrder: number; published: boolean };

export function FaqForm({ initial }: { initial: FaqRow | null }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [pending, startTransition] = useTransition();

  const onSubmit = (fd: FormData) => {
    setErr("");
    if (initial) fd.set("id", initial.id);
    startTransition(async () => {
      const res = await saveFaq(fd);
      if (!res.ok) setErr(res.error);
      else router.push("/admin/faqs");
    });
  };

  return (
    <form className="frm" action={onSubmit}>
      <div className="frm__top">
        <Link className="frm__back" href="/admin/faqs">← Back to FAQs</Link>
        <span className="frm__hint">{initial ? "Editing FAQ" : "New FAQ"}</span>
      </div>
      {err ? <p className="frm__err">{err}</p> : null}
      <div className="frm__grid">
        <label className="frm__field frm__field--full">
          <span>Question *</span>
          <input name="q" defaultValue={initial?.q} placeholder="Is the JEE batch Residential?" required />
        </label>
        <label className="frm__field frm__field--full">
          <span>Answer *</span>
          <textarea name="a" rows={5} defaultValue={initial?.a} required />
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
