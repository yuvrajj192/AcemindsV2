import type { Metadata } from "next";
import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deletePost } from "@/lib/actions/posts";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Blog posts", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PostsAdminPage() {
  const rows = await db.query.posts.findMany({
    orderBy: [sql`${schema.posts.publishedAt} desc nulls last`, desc(schema.posts.createdAt)],
    with: { cover: true },
  });
  return (
    <div className="adm-list">
      <div className="adm-list__bar">
        <p>
          {rows.length} post{rows.length === 1 ? "" : "s"}
        </p>
        <Link className="btn-gold btn-gold--sm" href="/admin/posts/new">
          + Write post
        </Link>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Published</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id}>
              <td>
                {p.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="tbl__thumb" src={p.cover.url} alt="" />
                ) : (
                  <span className="tbl__noimg" aria-hidden>
                    —
                  </span>
                )}
              </td>
              <td>
                {p.title}
                <span className="tbl__sub">/{p.slug}</span>
              </td>
              <td>{p.cat}</td>
              <td>{p.status === "published" ? "Published" : "Draft"}</td>
              <td>{p.publishedAt ? p.publishedAt.toISOString().slice(0, 10) : "—"}</td>
              <td className="tbl__row-actions">
                <Link className="btn-s" href={`/admin/posts/${p.id}`}>
                  Edit
                </Link>
                {p.status === "published" ? (
                  <Link className="btn-s" href={`/blog/${p.slug}`} target="_blank">
                    View
                  </Link>
                ) : null}
                <DeleteButton action={deletePost.bind(null, p.id)} confirmText="Delete this post?" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
