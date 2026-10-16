import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deleteReview } from "@/lib/actions/reviews";
import { deleteVideoStory } from "@/lib/actions/videoStories";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Testimonials", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  const tab = t === "stories" ? "stories" : "reviews";
  const [reviews, stories] = await Promise.all(
    tab === "stories"
      ? [Promise.resolve([]), db.query.videoStories.findMany({ orderBy: [desc(schema.videoStories.sortOrder)] })]
      : [db.query.reviews.findMany({ orderBy: [desc(schema.reviews.createdAt)] }), Promise.resolve([])]
  );

  return (
    <div className="adm-list">
      <div className="adm-tabs">
        <Link className={tab === "stories" ? "adm-tabs__link active" : "adm-tabs__link"} href="/admin/testimonials?t=stories">
          Video stories
        </Link>
        <Link className={tab === "reviews" ? "adm-tabs__link active" : "adm-tabs__link"} href="/admin/testimonials">
          Text reviews
        </Link>
      </div>

      {tab === "stories" ? (
        <>
          <div className="adm-list__bar">
            <p>
              {stories.length} video stor{stories.length === 1 ? "y" : "ies"} · shown on Home, Results &amp; Testimonials
            </p>
            <Link className="btn-gold btn-gold--sm" href="/admin/testimonials/videos/new">
              + Add video story
            </Link>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Name</th>
                <th>Batch</th>
                <th>Headline</th>
                <th>Video</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {stories.map((s) => {
                const id = s.videoUrl.includes("youtube.com/embed/")
                  ? s.videoUrl.split("/embed/")[1]?.split(/[?&]/)[0]
                  : null;
                return (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.batch}</td>
                    <td>{s.headline}</td>
                    <td className="tbl__wrap">
                      {id ? (
                        <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener">
                          YouTube ↗
                        </a>
                      ) : (
                        <span style={{ opacity: 0.55 }}>{s.videoUrl || "—"}</span>
                      )}
                    </td>
                    <td>{s.published ? "Published" : "Draft"}</td>
                    <td className="tbl__row-actions">
                      <Link className="btn-s" href={`/admin/testimonials/videos/${s.id}`}>
                        Edit
                      </Link>
                      <DeleteButton action={deleteVideoStory.bind(null, s.id)} confirmText="Delete this video story?" />
                    </td>
                  </tr>
                );
              })}
              {stories.length === 0 && (
                <tr>
                  <td colSpan={6} className="tbl__empty">
                    No video stories yet — add one to play student videos on the site.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <div className="adm-list__bar">
            <p>
              {reviews.length} testimonial{reviews.length === 1 ? "" : "s"}
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
              {reviews.map((r) => (
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
        </>
      )}
    </div>
  );
}
