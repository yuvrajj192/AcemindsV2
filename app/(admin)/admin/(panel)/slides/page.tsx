import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deleteSlide } from "@/lib/actions/slides";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Sliders", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function SlidesAdminPage() {
  const rows = await db.query.slides.findMany({
    orderBy: asc(schema.slides.sortOrder),
    with: { image: true },
  });
  return (
    <div className="adm-list">
      <div className="adm-list__bar">
        <p>
          {rows.length} slide{rows.length === 1 ? "" : "s"}
        </p>
        <Link className="btn-gold btn-gold--sm" href="/admin/slides/new">
          + Add slide
        </Link>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th>Image</th>
            <th>Kicker</th>
            <th>Title</th>
            <th>Order</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id}>
              <td>
                {s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="tbl__thumb tbl__thumb--wide" src={s.image.url} alt="" />
                ) : (
                  <span className="tbl__noimg" aria-hidden>
                    —
                  </span>
                )}
              </td>
              <td>{s.kicker}</td>
              <td>{s.title}</td>
              <td>{s.sortOrder}</td>
              <td>{s.published ? "Published" : "Draft"}</td>
              <td className="tbl__row-actions">
                <Link className="btn-s" href={`/admin/slides/${s.id}`}>
                  Edit
                </Link>
                <DeleteButton action={deleteSlide.bind(null, s.id)} confirmText="Delete this slide?" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
