/* Seeds the database from lib/data.ts (the original static site content).
   Safe to re-run: content tables are truncated first (users/enquiries are kept). */

import { config } from "dotenv";
config({ path: ".env.local" });

import { count, sql } from "drizzle-orm";

function parseDisplayDate(s: string): Date {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) throw new Error(`Unparseable date: ${s}`);
  return d;
}

async function main() {
  const { db, pool } = await import("../lib/db");
  const schema = await import("../lib/db/schema");
  const { ACE } = await import("../lib/data");

  async function upsertMedia(path: string, folder: string): Promise<string | null> {
    if (!path) return null;
    const filename = path.split("/").pop() ?? path;
    const ext = filename.includes(".") ? filename.split(".").pop()!.toLowerCase() : "";
    const mimeType = ext === "webp" ? "image/webp" : ext === "png" ? "image/png" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "avif" ? "image/avif" : "application/octet-stream";
    const [row] = await db
      .insert(schema.media)
      .values({ key: path, url: path, filename, mimeType, folder, alt: filename })
      .onConflictDoUpdate({ target: schema.media.key, set: { url: path, folder } })
      .returning({ id: schema.media.id });
    return row.id;
  }

  console.log("Seeding from lib/data.ts …");

  await db.execute(sql`
    TRUNCATE TABLE
      courses, toppers, result_stats, slides, video_stories, letters, reviews,
      faculty, posters, faqs, notices, posts, media, site_settings, review_summary, categories
    RESTART IDENTITY CASCADE
  `);

  const { site, notices, slides, categories, courses, toppers, resultStats, videoStories, letters, reviews, reviewSummary, faculty, posters, faqs, posts } = ACE;

  await db.insert(schema.siteSettings).values({ id: "main", ...site });
  await db.insert(schema.reviewSummary).values({ id: "main", rating: String(reviewSummary.rating), count: reviewSummary.count });

  await db.insert(schema.categories).values(
    categories.map((c, i) => ({ id: c.id, label: c.label, short: c.short, desc: c.desc, color: c.color, sortOrder: i }))
  );

  for (const [i, s] of slides.entries()) {
    const mediaId = await upsertMedia(s.img, "slides");
    await db.insert(schema.slides).values({ mediaId, kicker: s.kicker, title: s.title, videoUrl: s.video, sortOrder: i });
  }

  await db.insert(schema.courses).values(
    courses.map((c, i) => ({
      catId: c.cat,
      title: c.title,
      forLine: c.for,
      duration: c.duration,
      mode: c.mode,
      start: c.start,
      batch: c.batch,
      badge: c.badge ?? null,
      hot: c.hot ?? false,
      seats: c.seats,
      features: c.features,
      sortOrder: i,
    }))
  );

  for (const [i, t] of toppers.entries()) {
    const mediaId = t.img ? await upsertMedia(t.img, "toppers") : null;
    await db.insert(schema.toppers).values({
      name: t.name, exam: t.exam, year: t.year, rank: t.rank, score: t.score,
      college: t.college, catId: t.cat, mediaId, sortOrder: i,
    });
  }

  await db.insert(schema.resultStats).values(
    resultStats.map((s, i) => ({ value: s.value, suffix: s.suffix, label: s.label, sortOrder: i }))
  );

  await db.insert(schema.videoStories).values(
    videoStories.map((v, i) => ({ name: v.name, batch: v.batch, headline: v.headline, lines: v.lines, videoUrl: v.video, sortOrder: i }))
  );

  await db.insert(schema.letters).values(
    letters.map((l, i) => ({ name: l.name, tag: l.tag, body: l.text, sortOrder: i }))
  );

  await db.insert(schema.reviews).values(
    reviews.map((r, i) => ({ name: r.name, role: r.role, body: r.text, sortOrder: i }))
  );

  for (const [i, f] of faculty.entries()) {
    const mediaId = f.img ? await upsertMedia(f.img, "faculty") : null;
    await db.insert(schema.faculty).values({
      name: f.name, role: f.role, edu: f.edu, exp: f.exp, subject: f.subject,
      mediaId, tags: f.tags, bio: f.bio, isFounder: f.name === "Deepak Rana", sortOrder: i,
    });
  }

  await db.insert(schema.posters).values(
    posters.map((p, i) => ({
      theme: p.theme, dateText: p.date, title: p.title, body: p.text,
      cta: p.cta, href: p.href, deco: p.deco, sortOrder: i,
    }))
  );

  await db.insert(schema.faqs).values(faqs.map((f, i) => ({ q: f.q, a: f.a, sortOrder: i })));

  await db.insert(schema.notices).values(notices.map((n, i) => ({ text: n.text, href: n.href, active: true, sortOrder: i })));

  for (const p of posts) {
    const mediaId = p.img ? await upsertMedia(p.img, "posts") : null;
    await db.insert(schema.posts).values({
      slug: p.slug, cat: p.cat, title: p.title, excerpt: p.excerpt,
      body: null, mediaId, colorHex: p.color, readTime: p.read,
      status: "published", publishedAt: parseDisplayDate(p.date),
    });
  }

  const [c0, c1, c2, c3, c4, c5, c6] = await Promise.all([
    db.select({ n: count() }).from(schema.categories),
    db.select({ n: count() }).from(schema.courses),
    db.select({ n: count() }).from(schema.toppers),
    db.select({ n: count() }).from(schema.faculty),
    db.select({ n: count() }).from(schema.posts),
    db.select({ n: count() }).from(schema.media),
    db.select({ n: count() }).from(schema.notices),
  ]);
  console.log(
    `Done. categories=${c0[0].n} courses=${c1[0].n} toppers=${c2[0].n} faculty=${c3[0].n} posts=${c4[0].n} media=${c5[0].n} notices=${c6[0].n}`
  );
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
