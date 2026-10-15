"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveNotice } from "@/lib/actions/notices";

type NoticeRow = { id: string; text: string; href: string; active: boolean; sortOrder: number };

export function NoticeForm({ initial }: { initial: NoticeRow | null }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [pending, startTransition] = useTransition();

  const onSubmit = (fd: FormData) => {
    setErr("");
    if (initial) fd.set("id", initial.id);
    startTransition(async () => {
      const res = await saveNotice(fd);
      if (!res.ok) setErr(res.error);
      else router.push("/admin/notices");
    });
  };

  return (
    <form className="frm" action={onSubmit}>
      <div className="frm__top">
        <Link className="frm__back" href="/admin/notices">← Back to ticker</Link>
        <span className="frm__hint">{initial ? "Editing notice" : "New notice"}</span>
      </div>
      {err ? <p className="frm__err">{err}</p> : null}
      <div className="frm__grid">
        <label className="frm__field frm__field--full">
          <span>Ticker text *</span>
          <input name="text" defaultValue={initial?.text} placeholder="New crash course for MHT-CET starting next month" required />
        </label>
        <label className="frm__field">
          <span>Link (where the ticker click goes)</span>
          <input name="href" defaultValue={initial?.href ?? "/"} placeholder="/courses?cat=cet" />
        </label>
        <label className="frm__field">
          <span>Sort order</span>
          <input name="sortOrder" type="number" defaultValue={initial?.sortOrder ?? 0} />
        </label>
        <div className="frm__field">
          <span className="frm__checks">
            <label>
              <input name="active" type="checkbox" defaultChecked={initial ? initial.active : true} /> Active
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
