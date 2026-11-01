import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deleteFaculty } from "@/lib/actions/faculty";
import { deleteFounder } from "@/lib/actions/founders";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Faculty", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  name: string;
  role: string;
  subject: string;
  published: boolean;
  founder: boolean;
};

export default async function FacultyAdminPage() {
  const [team, founders] = await Promise.all([
    db.query.faculty.findMany({
      orderBy: [asc(schema.faculty.sortOrder), asc(schema.faculty.name)],
      with: { photo: true },
    }),
    db.query.founders.findMany({
      orderBy: [asc(schema.founders.sortOrder), asc(schema.founders.name)],
    }),
  ]);
  /* founders are faculties too — they lead the list (physics first); their photo lives in the Founders section only */
  const rows: (Row & { photoUrl: string | null })[] = [
    ...founders.map((f) => ({
      id: f.id,
      name: f.name,
      role: f.role,
      subject: f.subject,
      published: f.published,
      founder: true,
      photoUrl: null,
    })),
    ...team.map((f) => ({
      id: f.id,
      name: f.name,
      role: f.role,
      subject: f.subject,
      published: f.published,
      founder: false,
      photoUrl: f.photo?.url ?? null,
    })),
  ];
  return (
    <div className="adm-list">
      <div className="adm-list__bar">
        <p>
          {team.length} team member{team.length === 1 ? "" : "s"} + {founders.length} founder
          {founders.length === 1 ? "" : "s"} · founders open in <Link href="/admin/founders">Founders</Link> (their
          photo lives there) · team shows under “The team” on the About page
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
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => (
            <tr key={(f.founder ? "f-" : "t-") + f.id}>
              <td>
                {f.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="tbl__thumb" src={f.photoUrl} alt="" />
                ) : (
                  <span className="tbl__noimg" aria-hidden>
                    —
                  </span>
                )}
              </td>
              <td>{f.name}{f.founder ? " ★" : ""}</td>
              <td>{f.role}</td>
              <td>{f.subject}</td>
              <td>{f.published ? "Published" : "Draft"}</td>
              <td className="tbl__row-actions">
                <Link className="btn-s" href={f.founder ? `/admin/founders/${f.id}` : `/admin/faculty/${f.id}`}>
                  Edit
                </Link>
                {f.founder ? (
                  <DeleteButton action={deleteFounder.bind(null, f.id)} confirmText="Delete this founder?" />
                ) : (
                  <DeleteButton action={deleteFaculty.bind(null, f.id)} confirmText="Delete this faculty member?" />
                )}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="tbl__empty">
                No team members yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
