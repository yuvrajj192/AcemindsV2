import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deleteEnquiry } from "@/lib/actions/enquiries";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { EnquiryStatus } from "@/components/admin/EnquiryStatus";

export const metadata: Metadata = { title: "Enquiry detail", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function when(d: Date): string {
  return d.toLocaleString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.enquiries.findFirst({ where: eq(schema.enquiries.id, id) });
  if (!row) notFound();

  return (
    <div className="adm-list eq-detail">
      <div className="adm-list__bar">
        <p>
          <Link className="frm__back" href="/admin/enquiries">
            ← All enquiries
          </Link>
        </p>
        <div className="eq-bar-actions">
          <EnquiryStatus id={row.id} status={row.status} />
          <DeleteButton
            action={deleteEnquiry.bind(null, row.id)}
            confirmText="Delete this lead?"
            redirect="/admin/enquiries"
          />
        </div>
      </div>

      <div className="eq-card">
        <div className="eq-card__head">
          <div>
            <span className={`pill pill--${row.status}`}>{row.status}</span>
            <h2>{row.name}</h2>
            <p className="eq-card__sub">
              {row.studentClass ?? "Class not given"}
              {row.course ? ` · interested in ${row.course}` : ""}
              {" · "}
              via {row.source}
            </p>
          </div>
          <span className="eq-card__time">{when(row.createdAt)}</span>
        </div>

        <dl className="eq-card__grid">
          <div>
            <dt>Mobile</dt>
            <dd>
              <a href={`tel:${row.phone}`}>{row.phone}</a>
            </dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{row.email ? <a href={`mailto:${row.email}`}>{row.email}</a> : "—"}</dd>
          </div>
          <div>
            <dt>Interested in</dt>
            <dd>{row.course ?? "—"}</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>{row.source}</dd>
          </div>
        </dl>

        <div className="eq-card__msg">
          <h3>Message</h3>
          {row.message ? <p>{row.message}</p> : <p className="eq-muted">No message left with the form.</p>}
        </div>

        <div className="eq-card__actions">
          <a className="btn-gold btn-gold--sm" href={`tel:${row.phone}`}>
            Call {row.phone}
          </a>
          {row.email ? (
            <a className="btn-s" href={`mailto:${row.email}?subject=${encodeURIComponent("Your Ace Minds enquiry")}`}>
              Email
            </a>
          ) : null}
          <a
            className="btn-s"
            href={`https://wa.me/91${row.phone}?text=${encodeURIComponent(`Hi ${row.name}, this is Ace Minds regarding your enquiry.`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
