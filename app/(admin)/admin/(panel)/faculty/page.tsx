import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deleteFaculty, reorderFaculty } from "@/lib/actions/faculty";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { DragTable } from "@/components/admin/DragTable";

export const metadata: Metadata = { title: "Faculty", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FacultyAdminPage() {
  const rows = await db.query.faculty.findMany({
    orderBy: [asc(schema.faculty.sortOrder), asc(schema.faculty.name)],
    with: { photo: true },
  });
  return (
    <div className="adm-list">
      <div className="adm-list__bar">
        <p>
          {rows.length} member{rows.length === 1 ? "" : "s"} · drag the ⠿ handle to reposition · ★ founders are hidden
          from “The team” on the About page · the About Founders section (with photos) is separate — managed under{" "}
          <Link href="/admin/founders">Founders</Link>
        </p>
        <Link className="btn-gold btn-gold--sm" href="/admin/faculty/new">
          + Add faculty
        </Link>
      </div>
      <DragTable
        headers={["Photo", "Name", "Role", "Subject", "Status", ""]}
        emptyText="No team members yet."
        onReorder={reorderFaculty}
        rows={rows.map((f) => ({
          id: f.id,
          cells: [
            f.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="tbl__thumb" src={f.photo.url} alt="" />
            ) : (
              <span className="tbl__noimg" aria-hidden>
                —
              </span>
            ),
            <span>
              {f.name}
              {f.isFounder ? " ★" : ""}
            </span>,
            f.role,
            f.subject,
            f.published ? "Published" : "Draft",
            <div className="tbl__row-actions" key="a">
              <Link className="btn-s" href={`/admin/faculty/${f.id}`}>
                Edit
              </Link>
              <DeleteButton action={deleteFaculty.bind(null, f.id)} confirmText="Delete this faculty member?" />
            </div>,
          ],
        }))}
      />
    </div>
  );
}
