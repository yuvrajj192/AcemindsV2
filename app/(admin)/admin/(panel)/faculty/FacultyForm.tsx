"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImagePicker, type PickedMedia } from "@/components/admin/ImagePicker";
import { saveFaculty } from "@/lib/actions/faculty";

type FacultyRow = {
  id: string;
  name: string;
  role: string;
  edu: string;
  exp: string;
  subject: string;
  mediaId: string | null;
  photoUrl: string | null;
  tags: string[];
  bio: string;
  isFounder: boolean;
  sortOrder: number;
  published: boolean;
};

export function FacultyForm({ initial }: { initial: FacultyRow | null }) {
  const router = useRouter();
  const [img, setImg] = useState<PickedMedia | null>(
    initial?.mediaId && initial.photoUrl ? { id: initial.mediaId, url: initial.photoUrl } : null
  );
  const [err, setErr] = useState("");
  const [pending, startTransition] = useTransition();

  const onSubmit = (fd: FormData) => {
    setErr("");
    if (img) fd.set("mediaId", img.id);
    else fd.set("mediaId", "");
    if (initial) fd.set("id", initial.id);
    startTransition(async () => {
      const res = await saveFaculty(fd);
      if (!res.ok) setErr(res.error);
      else router.push("/admin/faculty");
    });
  };

  return (
    <form className="frm" action={onSubmit}>
      <div className="frm__top">
        <Link className="frm__back" href="/admin/faculty">← Back to faculty</Link>
        <span className="frm__hint">{initial ? "Editing faculty" : "New faculty member"}</span>
      </div>
      {err ? <p className="frm__err">{err}</p> : null}
      <div className="frm__grid">
        <label className="frm__field">
          <span>Name *</span>
          <input name="name" defaultValue={initial?.name} required />
        </label>
        <label className="frm__field">
          <span>Role *</span>
          <input name="role" defaultValue={initial?.role} placeholder="Physics Faculty" required />
        </label>
        <label className="frm__field">
          <span>Subject *</span>
          <input name="subject" defaultValue={initial?.subject} placeholder="Physics" required />
        </label>
        <label className="frm__field">
          <span>Education</span>
          <input name="edu" defaultValue={initial?.edu} placeholder="B.Tech, IIT Bombay" />
        </label>
        <label className="frm__field">
          <span>Experience</span>
          <input name="exp" defaultValue={initial?.exp} placeholder="8+ years" />
        </label>
        <label className="frm__field">
          <span>Tags (comma separated)</span>
          <input name="tags" defaultValue={initial?.tags.join(", ")} placeholder="IIT Alumni, JEE" />
        </label>
        <label className="frm__field frm__field--full">
          <span>Bio</span>
          <textarea name="bio" rows={4} defaultValue={initial?.bio} />
        </label>
        <label className="frm__field">
          <span>Sort order</span>
          <input name="sortOrder" type="number" defaultValue={initial?.sortOrder ?? 0} />
        </label>
        <div className="frm__field">
          <span className="frm__checks">
            <label>
              <input name="isFounder" type="checkbox" defaultChecked={initial?.isFounder} /> ★ Founder
            </label>
            <label>
              <input name="published" type="checkbox" defaultChecked={initial ? initial.published : true} /> Published
            </label>
          </span>
          <small>Founders get their own section right after “Our story” on the About page — everyone else shows under “The team”.</small>
        </div>
        <div className="frm__field frm__field--full">
          <ImagePicker value={img} onChange={setImg} label="Photo" aspect={4 / 4.4} aspectLabel="4:4.4 portrait" />
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
