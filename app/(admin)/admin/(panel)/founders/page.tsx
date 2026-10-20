import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deleteFaculty } from "@/lib/actions/faculty";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Founders", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FoundersAdminPage() {
  const rows = await db.query.faculty.findMany({
    where: eq(schema.faculty.isFounder, true),
    orderBy: desc(schema.faculty.sortOrder),
    with: { photo: true },
  });
  return (
    <div className="adm-list">
      <div className="adm-list__bar">
        <p>
          {rows.length} founder{rows.length === 1 ? "" : "s"} · shown in the Founders section after “Our story” on the
          About page
        </p>
        <Link className="btn-gold btn-gold--sm" href="/admin/founders/new">
          + Add founder
        </Link>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Role</th>
            <th>Subject</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => (
            <tr key={f.id}>
              <td>
                {f.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="tbl__thumb" src={f.photo.url} alt="" />
                ) : (
                  <span className="tbl__noimg" aria-hidden>
                    —
                  </span>
                )}
              </td>
              <td>{f.name}</td>
              <td>{f.role}</td>
              <td>{f.subject || "—"}</td>
              <td>{f.published ? "Published" : "Draft"}</td>
              <td className="tbl__row-actions">
                <Link className="btn-s" href={`/admin/founders/${f.id}`}>
                  Edit
                </Link>
                <DeleteButton
                  action={deleteFaculty.bind(null, f.id)}
                  confirmText="Delete this founder? (They will also be removed from the team — delete permanently only if they should vanish from the site entirely.)"
                />
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="tbl__empty">
                No founders yet — add one and they&apos;ll appear right after “Our story” on the About page.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
