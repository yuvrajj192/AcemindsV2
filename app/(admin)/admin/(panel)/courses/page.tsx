import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deleteCourse } from "@/lib/actions/courses";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Courses", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function CoursesAdminPage() {
  const rows = await db.query.courses.findMany({
    orderBy: [asc(schema.courses.sortOrder), asc(schema.courses.title)],
    with: { category: true },
  });
  return (
    <div className="adm-list">
      <div className="adm-list__bar">
        <p>
          {rows.length} course{rows.length === 1 ? "" : "s"}
        </p>
        <Link className="btn-gold btn-gold--sm" href="/admin/courses/new">
          + Add course
        </Link>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Duration</th>
            <th>Mode</th>
            <th>Start</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id}>
              <td>
                {c.title}
                {c.hot ? <span className="tbl__tag"> hot</span> : null}
                <span className="tbl__sub">{c.forLine}</span>
              </td>
              <td>{c.category?.label ?? c.catId}</td>
              <td>{c.duration}</td>
              <td>{c.mode}</td>
              <td>{c.start}</td>
              <td>{c.published ? "Published" : "Draft"}</td>
              <td className="tbl__row-actions">
                <Link className="btn-s" href={`/admin/courses/${c.id}`}>
                  Edit
                </Link>
                <DeleteButton action={deleteCourse.bind(null, c.id)} confirmText="Delete this course?" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
