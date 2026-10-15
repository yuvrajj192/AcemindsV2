import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deletePoster } from "@/lib/actions/posters";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Posters", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PostersAdminPage() {
  const rows = await db.query.posters.findMany({ orderBy: [asc(schema.posters.sortOrder)] });
  return (
    <div className="adm-list">
      <div className="adm-list__bar">
        <p>
          {rows.length} poster{rows.length === 1 ? "" : "s"}
        </p>
        <Link className="btn-gold btn-gold--sm" href="/admin/posters/new">
          + Add poster
        </Link>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date line</th>
            <th>Theme</th>
            <th>Button</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id}>
              <td>
                {p.title}
                <span className="tbl__sub">{p.body}</span>
              </td>
              <td>{p.dateText}</td>
              <td>{p.theme.replace("p-", "")}</td>
              <td>{p.cta || "—"}</td>
              <td>{p.published ? "Published" : "Draft"}</td>
              <td className="tbl__row-actions">
                <Link className="btn-s" href={`/admin/posters/${p.id}`}>
                  Edit
                </Link>
                <DeleteButton action={deletePoster.bind(null, p.id)} confirmText="Delete this poster?" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
