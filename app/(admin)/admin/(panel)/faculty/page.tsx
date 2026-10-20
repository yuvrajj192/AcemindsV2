import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deleteFaculty } from "@/lib/actions/faculty";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Faculty", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FacultyAdminPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  const tab = t === "founders" ? "founders" : t === "team" ? "team" : "all";
  const rows = await db.query.faculty.findMany({ orderBy: desc(schema.faculty.sortOrder), with: { photo: true } });
  const foundersCount = rows.filter((f) => f.isFounder).length;
  const shown =
    tab === "founders" ? rows.filter((f) => f.isFounder) : tab === "team" ? rows.filter((f) => !f.isFounder) : rows;
  return (
    <div className="adm-list">
      <div className="adm-tabs">
        <Link className={tab === "all" ? "adm-tabs__link active" : "adm-tabs__link"} href="/admin/faculty">
          All ({rows.length})
        </Link>
        <Link className={tab === "founders" ? "adm-tabs__link active" : "adm-tabs__link"} href="/admin/faculty?t=founders">
          Founders ({foundersCount})
        </Link>
        <Link className={tab === "team" ? "adm-tabs__link active" : "adm-tabs__link"} href="/admin/faculty?t=team">
          Team ({rows.length - foundersCount})
        </Link>
      </div>
      <div className="adm-list__bar">
        <p>
          {shown.length} member{shown.length === 1 ? "" : "s"}
          {tab === "founders" ? " · shown in the Founders section on the About page" : ""}
          {tab === "team" ? " · shown in The team section on the About page" : ""}
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
          {shown.map((f) => (
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
              <td>{f.isFounder ? <span className="tbl__tag tbl__tag--gold">★ Founder</span> : ""}</td>
              <td>{f.published ? "Published" : "Draft"}</td>
              <td className="tbl__row-actions">
                <Link className="btn-s" href={`/admin/faculty/${f.id}`}>
                  Edit
                </Link>
                <DeleteButton action={deleteFaculty.bind(null, f.id)} confirmText="Delete this faculty member?" />
              </td>
            </tr>
          ))}
          {shown.length === 0 && (
            <tr>
              <td colSpan={7} className="tbl__empty">
                {tab === "founders"
                  ? "No founders yet — open a faculty member and tick “Founder” to show them in the Founders section."
                  : "Nothing here."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
