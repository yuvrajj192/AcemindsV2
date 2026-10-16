import type { Metadata } from "next";
import Link from "next/link";
import { count } from "drizzle-orm";
import type { AnyPgTable } from "drizzle-orm/pg-core";
import { db, schema } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getEnquiryStats, getTrafficStats } from "@/lib/admin-queries";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

export const dynamic = "force-dynamic";

async function counts() {
  const q = (table: AnyPgTable) => db.select({ value: count() }).from(table);
  const [courses, toppers, faculty, posts, slides, posters, reviews, notices, faqs, media, users, enquiries] =
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
      q(schema.enquiries),
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
    enquiries: enquiries[0].value,
  };
}

const TILES: {
  key: keyof Awaited<ReturnType<typeof counts>>;
  label: string;
  href: string;
  lead?: boolean;
}[] = [
  { key: "enquiries", label: "Enquiries", href: "/admin/enquiries", lead: true },
  { key: "courses", label: "Courses", href: "/admin/courses" },
  { key: "toppers", label: "Toppers & results", href: "/admin/toppers" },
  { key: "faculty", label: "Faculty", href: "/admin/faculty" },
  { key: "posts", label: "Blog posts", href: "/admin/posts" },
  { key: "slides", label: "Sliders", href: "/admin/slides" },
  { key: "posters", label: "Posters", href: "/admin/posters" },
  { key: "reviews", label: "Testimonials", href: "/admin/testimonials" },
  { key: "notices", label: "Notice ticker", href: "/admin/notices" },
  { key: "faqs", label: "FAQs", href: "/admin/faqs" },
  { key: "media", label: "Media library", href: "/admin/media" },
  { key: "users", label: "Staff users", href: "/admin/settings" },
];

function dayLabel(day: string): string {
  const d = new Date(`${day}T12:00:00Z`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function delta(week: number, prev: number): { text: string; cls: string } {
  if (!prev && !week) return { text: "no traffic yet", cls: "is-flat" };
  if (!prev) return { text: "new traffic", cls: "is-up" };
  const pct = Math.round(((week - prev) / prev) * 100);
  if (pct > 0) return { text: `▲ ${pct}% vs last week`, cls: "is-up" };
  if (pct < 0) return { text: `▼ ${Math.abs(pct)}% vs last week`, cls: "is-down" };
  return { text: "— level vs last week", cls: "is-flat" };
}

function greeting(h: number): string {
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default async function AdminDashboard() {
  const [user, c, t, s] = await Promise.all([getSession(), counts(), getTrafficStats(), getEnquiryStats()]);
  const d = delta(t.week, t.prevWeek);
  const ld = delta(s.week, s.prevWeek);
  const maxDay = Math.max(1, ...t.series.map((s) => s.views));
  const maxPath = Math.max(1, ...t.topPaths.map((p) => p.views));
  const maxRef = Math.max(1, ...t.topReferrers.map((r) => r.views));
  const now = new Date();
  const firstName = (user?.name || "there").split(" ")[0];
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="dash">
      <section className="dash__hero" aria-label="Welcome">
        <div className="dash__hero-glow" aria-hidden="true" />
        <div className="dash__hero-main">
          <span className="dash__eyebrow">Overview</span>
          <h2>
            {greeting(now.getHours())}, {firstName}
          </h2>
          <p>{dateStr} · here&apos;s how aceminds.in is doing today.</p>
        </div>
        <div className="dash__hero-chips">
          <Link className="dash__chip" href="/admin/enquiries">
            <b>{s.unread}</b>
            <span>unread lead{s.unread === 1 ? "" : "s"}</span>
          </Link>
          <div className="dash__chip">
            <b>{t.today}</b>
            <span>view{t.today === 1 ? "" : "s"} today</span>
          </div>
          <div className="dash__chip dash__chip--dim">
            <b>{c.enquiries}</b>
            <span>total leads</span>
          </div>
        </div>
      </section>

      <section className="dash__kpis" aria-label="Key metrics">
        <div className="dash__kpi" style={{ ["--accent" as string]: "#2e7bea" }}>
          <span>Views today</span>
          <strong>{t.today}</strong>
        </div>
        <div className="dash__kpi" style={{ ["--accent" as string]: "#2e7bea" }}>
          <span>Views · 7 days</span>
          <strong>{t.week}</strong>
          <em className={`dash__kpi-delta ${d.cls}`}>{d.text}</em>
        </div>
        <div className="dash__kpi" style={{ ["--accent" as string]: "#7c5cff" }}>
          <span>Visitors · 7 days</span>
          <strong>{t.uniquesWeek}</strong>
          <em className="dash__kpi-delta is-flat">unique visitors</em>
        </div>
        <div className="dash__kpi" style={{ ["--accent" as string]: "#0ea5b7" }}>
          <span>Views · 30 days</span>
          <strong>{t.month}</strong>
        </div>
        <div className="dash__kpi dash__kpi--leads" style={{ ["--accent" as string]: "#e0a516" }}>
          <span>Leads · 7 days</span>
          <strong>{s.week}</strong>
          <em className={`dash__kpi-delta ${s.unread ? "is-up" : ld.cls}`}>
            {s.unread ? `${s.unread} new in inbox` : ld.text}
          </em>
        </div>
      </section>

      <section className="dash__traffic" aria-label="Lead generation and traffic">
        <div className="dash__section-head">
          <h2>Lead generation &amp; traffic</h2>
          <span>public pages · bot traffic excluded</span>
        </div>

        <div className="dash__traffic-grid">
          <div className="dash__panel dash__panel--chart">
            <div className="dash__panel-head">
              <h3>Daily views</h3>
              <span>last 14 days</span>
            </div>
            <div className="dash__chart" role="img" aria-label="Daily page views for the last 14 days">
              {t.series.map((s, i) => (
                <div className="dash__bar-col" key={s.day}>
                  <div
                    className={`dash__bar${s.views ? "" : " is-zero"}${i === t.series.length - 1 ? " is-today" : ""}`}
                    style={{ height: `${Math.max(3, Math.round((s.views / maxDay) * 100))}%` }}
                    title={`${dayLabel(s.day)} — ${s.views} views · ${s.uniques} visitors`}
                  />
                </div>
              ))}
            </div>
            <div className="dash__chart-axis">
              <span>{dayLabel(t.series[0]?.day ?? "")}</span>
              <span>{dayLabel(t.series[t.series.length - 1]?.day ?? "")}</span>
            </div>
          </div>

          <div className="dash__panel">
            <div className="dash__panel-head">
              <h3>Top pages</h3>
              <span>30 days</span>
            </div>
            {t.topPaths.length ? (
              <ul className="dash__rank">
                {t.topPaths.map((p) => (
                  <li key={p.path}>
                    <span className="dash__rank-name" title={p.path}>
                      {p.path}
                    </span>
                    <span className="dash__rank-track">
                      <i style={{ width: `${Math.max(6, Math.round((p.views / maxPath) * 100))}%` }} />
                    </span>
                    <span className="dash__rank-val">{p.views}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dash__empty">No page views recorded yet — views appear here as visitors land on the site.</p>
            )}
          </div>

          <div className="dash__panel">
            <div className="dash__panel-head">
              <h3>Where visits come from</h3>
              <span>30 days</span>
            </div>
            {t.topReferrers.length ? (
              <ul className="dash__rank">
                {t.topReferrers.map((r) => (
                  <li key={r.referrer}>
                    <span className="dash__rank-name" title={r.referrer}>
                      {r.referrer}
                    </span>
                    <span className="dash__rank-track">
                      <i style={{ width: `${Math.max(6, Math.round((r.views / maxRef) * 100))}%` }} />
                    </span>
                    <span className="dash__rank-val">{r.views}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dash__empty">Referral sources (Google, social, etc.) show up here after the first visits.</p>
            )}
          </div>
        </div>
      </section>

      <section className="dash__content" aria-label="Site content">
        <div className="dash__section-head">
          <h2>Site content</h2>
          <span>jump to any section</span>
        </div>
        <div className="dash__tiles">
          {TILES.map((tile) => (
            <Link className={`dash__tile${tile.lead ? " dash__tile--lead" : ""}`} href={tile.href} key={tile.key}>
              <span className="dash__tile-label">{tile.label}</span>
              <strong className="dash__tile-count">{c[tile.key]}</strong>
              {tile.lead && s.unread ? <b className="dash__tile-badge">{s.unread} new</b> : null}
              <span className="dash__tile-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="dash__note">
        <h2>About these numbers</h2>
        <p>
          Page views are recorded server-side for public pages (admin, assets, prefetches and bots are excluded).
          Visitors are de-duplicated by a hashed IP + user-agent fingerprint over 7 days. Leads from the contact,
          admissions and floating enquiry forms land in Enquiries with an email alert and one-click Excel export.
        </p>
      </section>
    </div>
  );
}
