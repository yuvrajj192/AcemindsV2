import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deleteTopper, reorderToppers } from "@/lib/actions/toppers";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { DragTable } from "@/components/admin/DragTable";

export const metadata: Metadata = { title: "Toppers", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ToppersAdminPage() {
  const rows = await db.query.toppers.findMany({
    orderBy: [asc(schema.toppers.sortOrder), asc(schema.toppers.name)],
    with: { photo: true, category: true },
  });
  return (
    <div className="adm-list">
      <div className="adm-list__bar">
        <p>
          {rows.length} topper{rows.length === 1 ? "" : "s"} · drag the ⠿ handle to reposition — the site shows them
          in this exact order
        </p>
        <Link className="btn-gold btn-gold--sm" href="/admin/toppers/new">
          + Add topper
        </Link>
      </div>
      <DragTable
        headers={["Photo", "Name", "Exam", "Year", "Rank", "Category", "Status", ""]}
        emptyText="No toppers yet."
        onReorder={reorderToppers}
        rows={rows.map((t) => ({
          id: t.id,
          cells: [
            t.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="tbl__thumb" src={t.photo.url} alt="" />
            ) : (
              <span className="tbl__noimg" aria-hidden>
                —
              </span>
            ),
            t.name,
            t.exam,
            t.year,
            t.rank,
            t.category?.label ?? t.catId,
            t.published ? "Published" : "Draft",
            <div className="tbl__row-actions" key="a">
              <Link className="btn-s" href={`/admin/toppers/${t.id}`}>
                Edit
              </Link>
              <DeleteButton action={deleteTopper.bind(null, t.id)} confirmText="Delete this topper?" />
            </div>,
          ],
        }))}
      />
    </div>
  );
}
