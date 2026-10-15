import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deleteTopper } from "@/lib/actions/toppers";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Toppers", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ToppersAdminPage() {
  const rows = await db.query.toppers.findMany({
    orderBy: [desc(schema.toppers.year), desc(schema.toppers.sortOrder)],
    with: { photo: true, category: true },
  });
  return (
    <div className="adm-list">
      <div className="adm-list__bar">
        <p>
          {rows.length} topper{rows.length === 1 ? "" : "s"}
        </p>
        <Link className="btn-gold btn-gold--sm" href="/admin/toppers/new">
          + Add topper
        </Link>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Exam</th>
            <th>Year</th>
            <th>Rank</th>
            <th>Category</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id}>
              <td>
                {t.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="tbl__thumb" src={t.photo.url} alt="" />
                ) : (
                  <span className="tbl__noimg" aria-hidden>
                    —
                  </span>
                )}
              </td>
              <td>{t.name}</td>
              <td>{t.exam}</td>
              <td>{t.year}</td>
              <td>{t.rank}</td>
              <td>{t.category?.label ?? t.catId}</td>
              <td>{t.published ? "Published" : "Draft"}</td>
              <td className="tbl__row-actions">
                <Link className="btn-s" href={`/admin/toppers/${t.id}`}>
                  Edit
                </Link>
                <DeleteButton action={deleteTopper.bind(null, t.id)} confirmText="Delete this topper?" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
