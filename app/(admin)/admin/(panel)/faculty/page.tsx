import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deleteFaculty } from "@/lib/actions/faculty";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Faculty", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FacultyAdminPage() {
  const rows = await db.query.faculty.findMany({ orderBy: desc(schema.faculty.sortOrder), with: { photo: true } });
  return (
    <div className="adm-list">
      <div className="adm-list__bar">
        <p>
          {rows.length} member{rows.length === 1 ? "" : "s"}
        </p>
        <Link className="btn-gold btn-gold--sm" href="/admin/faculty/new">
          + Add faculty
        </Link>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Role</th>
            <th>Subject</th>
            <th>Founder</th>
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
              <td>{f.subject}</td>
              <td>{f.isFounder ? "★" : ""}</td>
              <td>{f.published ? "Published" : "Draft"}</td>
              <td className="tbl__row-actions">
                <Link className="btn-s" href={`/admin/faculty/${f.id}`}>
                  Edit
                </Link>
                <DeleteButton action={deleteFaculty.bind(null, f.id)} confirmText="Delete this faculty member?" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
