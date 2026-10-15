"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImagePicker, type PickedMedia } from "@/components/admin/ImagePicker";
import { savePost } from "@/lib/actions/posts";

const NEW_CAT = "__new__";

type PostRow = {
  id: string;
  slug: string;
  cat: string;
  title: string;
  excerpt: string;
  bodyParagraphs: string[];
  mediaId: string | null;
  coverUrl: string | null;
  colorHex: string;
  readTime: string;
  status: "draft" | "published";
  publishedAt: string | null;
};

export function PostForm({ initial, categories }: { initial: PostRow | null; categories: string[] }) {
  const router = useRouter();
  const [img, setImg] = useState<PickedMedia | null>(
    initial?.mediaId && initial.coverUrl ? { id: initial.mediaId, url: initial.coverUrl } : null
  );
  const [err, setErr] = useState("");
  const [pending, startTransition] = useTransition();

  const known = useMemo(() => {
    const set = new Set(categories);
    if (initial?.cat) set.add(initial.cat);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [categories, initial?.cat]);

  const [catChoice, setCatChoice] = useState(initial?.cat ?? known[0] ?? "Exam updates");
  const [newCat, setNewCat] = useState("");

  const onSubmit = (fd: FormData) => {
    setErr("");
    fd.set("cat", catChoice === NEW_CAT ? newCat.trim() || "General" : catChoice);
    fd.set("mediaId", img?.id ?? "");
    if (initial) fd.set("id", initial.id);
    startTransition(async () => {
      const res = await savePost(fd);
      if (!res.ok) setErr(res.error);
      else router.push("/admin/posts");
    });
  };

  return (
    <form className="frm" action={onSubmit}>
      <div className="frm__top">
        <Link className="frm__back" href="/admin/posts">← Back to posts</Link>
        <span className="frm__hint">{initial ? "Editing post" : "New post"}</span>
      </div>
      {err ? <p className="frm__err">{err}</p> : null}
      <div className="frm__grid">
        <label className="frm__field frm__field--full">
          <span>Title *</span>
          <input name="title" defaultValue={initial?.title} required />
        </label>
        <label className="frm__field">
          <span>Slug *</span>
          <input name="slug" defaultValue={initial?.slug} placeholder="jee-main-2027-dates" required />
        </label>
        <label className="frm__field">
          <span>Category</span>
          <select value={catChoice} onChange={(e) => setCatChoice(e.target.value)}>
            {known.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value={NEW_CAT}>＋ New category…</option>
          </select>
        </label>
        {catChoice === NEW_CAT ? (
          <label className="frm__field">
            <span>New category name *</span>
            <input
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="e.g. Announcements"
              required
              autoFocus
            />
          </label>
        ) : null}
        <label className="frm__field frm__field--full">
          <span>Excerpt</span>
          <textarea name="excerpt" rows={2} defaultValue={initial?.excerpt} />
        </label>
        <label className="frm__field frm__field--full">
          <span>Body — one paragraph per blank line</span>
          <textarea name="body" rows={14} defaultValue={initial?.bodyParagraphs.join("\n\n")} />
        </label>
        <label className="frm__field">
          <span>Read time</span>
          <input name="readTime" defaultValue={initial?.readTime ?? "4 min"} />
        </label>
        <label className="frm__field">
          <span>Accent colour</span>
          <input name="colorHex" type="color" defaultValue={initial?.colorHex ?? "#2e7bea"} />
        </label>
        <label className="frm__field">
          <span>Status</span>
          <select name="status" defaultValue={initial?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <label className="frm__field">
          <span>Published date</span>
          <input
            name="publishedAt"
            type="datetime-local"
            defaultValue={initial?.publishedAt ? initial.publishedAt.slice(0, 16) : ""}
          />
        </label>
        <div className="frm__field frm__field--full">
          <ImagePicker value={img} onChange={setImg} label="Cover image" aspect={16 / 9} aspectLabel="16:9" />
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
