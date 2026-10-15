import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deleteFaq } from "@/lib/actions/faqs";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "FAQs", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function FaqsAdminPage() {
  const rows = await db.query.faqs.findMany({ orderBy: [asc(schema.faqs.sortOrder)] });
  return (
    <div className="adm-list">
      <div className="adm-list__bar">
        <p>
          {rows.length} faq{rows.length === 1 ? "" : "s"}
        </p>
        <Link className="btn-gold btn-gold--sm" href="/admin/faqs/new">
          + Add FAQ
        </Link>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => (
            <tr key={f.id}>
              <td>{f.q}</td>
              <td className="tbl__wrap">{f.a.length > 90 ? `${f.a.slice(0, 90)}…` : f.a}</td>
              <td>{f.published ? "Published" : "Draft"}</td>
              <td className="tbl__row-actions">
                <Link className="btn-s" href={`/admin/faqs/${f.id}`}>
                  Edit
                </Link>
                <DeleteButton action={deleteFaq.bind(null, f.id)} confirmText="Delete this FAQ?" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
