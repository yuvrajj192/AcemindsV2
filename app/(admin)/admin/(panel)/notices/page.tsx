import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deleteNotice } from "@/lib/actions/notices";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Notice ticker", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NoticesAdminPage() {
  const rows = await db.query.notices.findMany({ orderBy: [asc(schema.notices.sortOrder)] });
  return (
    <div className="adm-list">
      <div className="adm-list__bar">
        <p>
          {rows.length} notice{rows.length === 1 ? "" : "s"} in the ticker
        </p>
        <Link className="btn-gold btn-gold--sm" href="/admin/notices/new">
          + Add notice
        </Link>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Text</th>
            <th>Link</th>
            <th>Order</th>
            <th>Active</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((n) => (
            <tr key={n.id}>
              <td>{n.text}</td>
              <td>{n.href}</td>
              <td>{n.sortOrder}</td>
              <td>{n.active ? "Yes" : "No"}</td>
              <td className="tbl__row-actions">
                <Link className="btn-s" href={`/admin/notices/${n.id}`}>
                  Edit
                </Link>
                <DeleteButton action={deleteNotice.bind(null, n.id)} confirmText="Delete this ticker notice?" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
