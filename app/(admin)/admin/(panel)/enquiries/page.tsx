import type { Metadata } from "next";
import Link from "next/link";
import { getEnquiries, getEnquiryCounts } from "@/lib/admin-queries";
import { deleteEnquiry } from "@/lib/actions/enquiries";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Enquiries", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const TABS = [
  ["all", "All"],
  ["new", "New"],
  ["read", "Read"],
  ["replied", "Replied"],
] as const;

function when(d: Date): string {
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default async function EnquiriesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = "", q = "" } = await searchParams;
  const term = q.trim();
  const [rows, counts] = await Promise.all([getEnquiries({ status, q: term }), getEnquiryCounts()]);
  const exportQs = new URLSearchParams();
  if (status) exportQs.set("status", status);
  if (term) exportQs.set("q", term);

  return (
    <div className="adm-list">
      <div className="adm-list__bar">
        <p>
          {counts.all} lead{counts.all === 1 ? "" : "s"}
          {counts.new ? <b className="eq-newbadge">{counts.new} new</b> : null}
          {status || term ? <span className="eq-filtered"> · filtered view</span> : null}
        </p>
        <div className="eq-bar-actions">
          <form className="eq-search" action="/admin/enquiries" method="get">
            {status ? <input type="hidden" name="status" value={status} /> : null}
            <input name="q" defaultValue={term} placeholder="Search name, phone, course…" aria-label="Search enquiries" />
            <button className="btn-s" type="submit">
              Search
            </button>
            {term || status ? (
              <Link className="btn-s" href="/admin/enquiries">
                Clear
              </Link>
            ) : null}
          </form>
          <a className="btn-s" href={`/admin/enquiries/export${exportQs.size ? `?${exportQs}` : ""}`}>
            Export Excel
          </a>
        </div>
      </div>

      <nav className="eq-tabs" aria-label="Filter by status">
        {TABS.map(([k, label]) => (
          <Link
            key={k}
            href={k === "all" ? "/admin/enquiries" : `/admin/enquiries?status=${k}`}
            className={`eq-tab${(status || "all") === k ? " is-on" : ""}`}
          >
            {label} <b>{counts[k]}</b>
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <p className="adm-empty">
          {counts.all === 0
            ? "No enquiries yet — leads land here the moment someone submits the contact form, admissions form or the floating enquiry modal."
            : "No leads match this filter."}
        </p>
      ) : (
        <table className="tbl">
          <thead>
            <tr>
              <th>Received</th>
              <th>Student</th>
              <th>Class</th>
              <th>Interested in</th>
              <th>Contact</th>
              <th>Source</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <td className="eq-when">{when(e.createdAt)}</td>
                <td>
                  <Link className="eq-name" href={`/admin/enquiries/${e.id}`}>
                    {e.name}
                  </Link>
                </td>
                <td>{e.studentClass ?? "—"}</td>
                <td>{e.course ?? "—"}</td>
                <td>
                  <a href={`tel:${e.phone}`}>{e.phone}</a>
                  {e.email ? <span className="eq-email">{e.email}</span> : null}
                </td>
                <td>{e.source}</td>
                <td>
                  <span className={`pill pill--${e.status}`}>{e.status}</span>
                </td>
                <td className="tbl__row-actions">
                  <Link className="btn-s" href={`/admin/enquiries/${e.id}`}>
                    Open
                  </Link>
                  <DeleteButton action={deleteEnquiry.bind(null, e.id)} confirmText="Delete this lead?" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
