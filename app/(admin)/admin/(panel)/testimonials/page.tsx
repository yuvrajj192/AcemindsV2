import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deleteReview } from "@/lib/actions/reviews";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Testimonials", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const rows = await db.query.reviews.findMany({ orderBy: [desc(schema.reviews.createdAt)] });
  return (
    <div className="adm-list">
      <div className="adm-list__bar">
        <p>
          {rows.length} testimonial{rows.length === 1 ? "" : "s"}
        </p>
        <Link className="btn-gold btn-gold--sm" href="/admin/testimonials/new">
          + Add testimonial
        </Link>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role / line</th>
            <th>Review</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.role}</td>
              <td className="tbl__wrap">{r.body.length > 90 ? `${r.body.slice(0, 90)}…` : r.body}</td>
              <td>{r.published ? "Published" : "Draft"}</td>
              <td className="tbl__row-actions">
                <Link className="btn-s" href={`/admin/testimonials/${r.id}`}>
                  Edit
                </Link>
                <DeleteButton action={deleteReview.bind(null, r.id)} confirmText="Delete this testimonial?" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
