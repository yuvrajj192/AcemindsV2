import type { Metadata } from "next";
import Link from "next/link";
import { count } from "drizzle-orm";
import type { AnyPgTable } from "drizzle-orm/pg-core";
import { db, schema } from "@/lib/db";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

export const dynamic = "force-dynamic";

async function counts() {
  const q = (table: AnyPgTable) => db.select({ value: count() }).from(table);
  const [courses, toppers, faculty, posts, slides, posters, reviews, notices, faqs, media, users, categories] =
    await Promise.all([
      q(schema.courses),
      q(schema.toppers),
      q(schema.faculty),
      q(schema.posts),
      q(schema.slides),
      q(schema.posters),
      q(schema.reviews),
      q(schema.notices),
      q(schema.faqs),
      q(schema.media),
      q(schema.users),
      q(schema.categories),
    ]);
  return {
    courses: courses[0].value,
    toppers: toppers[0].value,
    faculty: faculty[0].value,
    posts: posts[0].value,
    slides: slides[0].value,
    posters: posters[0].value,
    reviews: reviews[0].value,
    notices: notices[0].value,
    faqs: faqs[0].value,
    media: media[0].value,
    users: users[0].value,
    categories: categories[0].value,
  };
}

const CARDS: { key: keyof Awaited<ReturnType<typeof counts>>; label: string; soon?: boolean }[] = [
  { key: "courses", label: "Courses" },
  { key: "toppers", label: "Toppers" },
  { key: "faculty", label: "Faculty" },
  { key: "posts", label: "Blog posts" },
  { key: "slides", label: "Sliders" },
  { key: "posters", label: "Posters" },
  { key: "reviews", label: "Testimonials" },
  { key: "notices", label: "Notices" },
  { key: "faqs", label: "FAQs" },
  { key: "media", label: "Media files" },
  { key: "categories", label: "Categories" },
  { key: "users", label: "Staff users" },
];

export default async function AdminDashboard() {
  const c = await counts();

  const quick: { href: string; label: string; desc: string; soon?: boolean }[] = [
    { href: "/admin/courses", label: "Manage courses", desc: "Add or edit courses, fees, eligibility", soon: true },
    { href: "/admin/posts", label: "Write a post", desc: "Blog editor with cover images", soon: true },
    { href: "/admin/media", label: "Media library", desc: "Upload photos to Cloudflare R2" },
    { href: "/admin/enquiries", label: "Enquiries", desc: "New leads + Excel export", soon: true },
  ];

  return (
    <div className="dash">
      <section className="dash__stats" aria-label="Content statistics">
        {CARDS.map((card) => (
          <div className="dash__stat" key={card.key}>
            <span className="dash__stat-label">{card.label}</span>
            <strong className="dash__stat-value">{c[card.key]}</strong>
          </div>
        ))}
        <div className="dash__stat dash__stat--soon">
          <span className="dash__stat-label">Enquiries</span>
          <strong className="dash__stat-value">0</strong>
          <span className="dash__badge">soon</span>
        </div>
      </section>

      <section className="dash__quick" aria-label="Quick actions">
        <h2>Quick actions</h2>
        <div className="dash__quick-grid">
          {quick.map((item) =>
            item.soon ? (
              <div className="dash__action dash__action--soon" key={item.href} aria-disabled="true">
                <strong>{item.label}</strong>
                <span>{item.desc}</span>
                <b className="dash__badge">coming soon</b>
              </div>
            ) : (
              <Link className="dash__action" href={item.href} key={item.href}>
                <strong>{item.label}</strong>
                <span>{item.desc}</span>
              </Link>
            )
          )}
        </div>
      </section>

      <section className="dash__note">
        <h2>Getting started</h2>
        <p>
          Phase 1 is live: staff login, session handling and this dashboard. Content editors (courses, blog,
          media library, enquiries) land in the next phases — the sidebar shows what&apos;s coming.
        </p>
      </section>
    </div>
  );
}
