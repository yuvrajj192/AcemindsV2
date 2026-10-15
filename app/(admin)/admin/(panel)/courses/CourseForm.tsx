"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveCourse } from "@/lib/actions/courses";

type Cat = { id: string; label: string };

type CourseRow = {
  id: string;
  catId: string;
  title: string;
  forLine: string;
  duration: string;
  mode: string;
  start: string;
  batch: string;
  badge: string | null;
  hot: boolean;
  seats: number;
  features: string[];
  sortOrder: number;
  published: boolean;
};

export function CourseForm({ initial, categories }: { initial: CourseRow | null; categories: Cat[] }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [pending, startTransition] = useTransition();

  const onSubmit = (fd: FormData) => {
    setErr("");
    if (initial) fd.set("id", initial.id);
    startTransition(async () => {
      const res = await saveCourse(fd);
      if (!res.ok) setErr(res.error);
      else router.push("/admin/courses");
    });
  };

  return (
    <form className="frm" action={onSubmit}>
      <div className="frm__top">
        <Link className="frm__back" href="/admin/courses">← Back to courses</Link>
        <span className="frm__hint">{initial ? "Editing course" : "New course"}</span>
      </div>
      {err ? <p className="frm__err">{err}</p> : null}
      <div className="frm__grid">
        <label className="frm__field frm__field--full">
          <span>Title *</span>
          <input name="title" defaultValue={initial?.title} placeholder="JEE Two-Year Classroom" required />
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
          <span>For (student line)</span>
          <input name="forLine" defaultValue={initial?.forLine} placeholder="Students moving into Class 11" />
        </label>
        <label className="frm__field">
          <span>Duration</span>
          <input name="duration" defaultValue={initial?.duration} placeholder="2 Years" />
        </label>
        <label className="frm__field">
          <span>Mode</span>
          <input name="mode" defaultValue={initial?.mode} placeholder="Classroom" />
        </label>
        <label className="frm__field">
          <span>Start</span>
          <input name="start" defaultValue={initial?.start} placeholder="April 2027" />
        </label>
        <label className="frm__field">
          <span>Batch</span>
          <input name="batch" defaultValue={initial?.batch} placeholder="Morning / Evening" />
        </label>
        <label className="frm__field">
          <span>Badge (optional)</span>
          <input name="badge" defaultValue={initial?.badge ?? ""} placeholder="Popular" />
        </label>
        <label className="frm__field">
          <span>Seats</span>
          <input name="seats" type="number" defaultValue={initial?.seats ?? 0} />
        </label>
        <label className="frm__field frm__field--full">
          <span>Features (comma separated)</span>
          <input name="features" defaultValue={initial?.features.join(", ")} placeholder="Doubt desk, Mock tests, Mentorship" />
        </label>
        <label className="frm__field">
          <span>Sort order</span>
          <input name="sortOrder" type="number" defaultValue={initial?.sortOrder ?? 0} />
        </label>
        <div className="frm__field">
          <span className="frm__checks">
            <label>
              <input name="hot" type="checkbox" defaultChecked={initial?.hot} /> Hot
            </label>
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
