import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";

const CANONICAL = ["Exam updates", "Strategy", "Concepts", "Announcements", "Toppers"];

/** Distinct post categories (existing + canonical), for the admin editor. */
export async function getAdminPostCategories(): Promise<string[]> {
  const rows = await db.selectDistinct({ cat: schema.posts.cat }).from(schema.posts);
  return [...new Set([...rows.map((r) => r.cat), ...CANONICAL])].sort((a, b) => a.localeCompare(b));
}

/* ---------- lead-gen traffic stats (dashboard) ---------- */

export type TrafficStats = {
  today: number;
  yesterday: number;
  week: number;
  prevWeek: number;
  month: number;
  uniquesWeek: number;
  uniquesMonth: number;
  directMonth: number;
  series: { day: string; views: number; uniques: number }[];
  topPaths: { path: string; views: number }[];
  topReferrers: { referrer: string; views: number }[];
};

export async function getTrafficStats(): Promise<TrafficStats> {
  const [totalsRes, seriesRes, pathsRes, refsRes] = await Promise.all([
    db.execute(sql`
      select
        count(*) filter (where created_at >= date_trunc('day', now())) as today,
        count(*) filter (where created_at >= date_trunc('day', now()) - interval '1 day'
                          and created_at < date_trunc('day', now())) as yesterday,
        count(*) filter (where created_at >= now() - interval '7 days') as week,
        count(*) filter (where created_at >= now() - interval '14 days' and created_at < now() - interval '7 days') as prev_week,
        count(*) filter (where created_at >= now() - interval '30 days') as month,
        count(distinct visitor) filter (where created_at >= now() - interval '7 days') as uniques_week,
        count(distinct visitor) filter (where created_at >= now() - interval '30 days') as uniques_month,
        count(*) filter (where created_at >= now() - interval '30 days' and referrer = '') as direct_month
      from page_views
    `),
    db.execute(sql`
      select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
             count(*) as views,
             count(distinct visitor) as uniques
      from page_views
      where created_at >= date_trunc('day', now()) - interval '29 days'
      group by 1 order by 1
    `),
    db.execute(sql`
      select path, count(*) as views
      from page_views
      where created_at >= now() - interval '30 days'
      group by path order by views desc limit 6
    `),
    db.execute(sql`
      select referrer, count(*) as views
      from page_views
      where created_at >= now() - interval '30 days' and referrer <> ''
      group by referrer order by views desc limit 5
    `),
  ]);

  const t = (totalsRes.rows[0] ?? {}) as Record<string, unknown>;

  // zero-fill the 30-day window (UTC keys — the DB groups days in GMT,
  // and local-date keys shift bars by one day during IST night hours)
  const byDay = new Map<string, { views: number; uniques: number }>();
  for (const r of seriesRes.rows as { day: string; views: unknown; uniques: unknown }[]) {
    byDay.set(r.day, { views: Number(r.views), uniques: Number(r.uniques) });
  }
  const series: TrafficStats["series"] = [];
  for (let i = 29; i >= 0; i--) {
    const key = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    series.push({ day: key, views: byDay.get(key)?.views ?? 0, uniques: byDay.get(key)?.uniques ?? 0 });
  }

  return {
    today: Number(t.today ?? 0),
    yesterday: Number(t.yesterday ?? 0),
    week: Number(t.week ?? 0),
    prevWeek: Number(t.prev_week ?? 0),
    month: Number(t.month ?? 0),
    uniquesWeek: Number(t.uniques_week ?? 0),
    uniquesMonth: Number(t.uniques_month ?? 0),
    directMonth: Number(t.direct_month ?? 0),
    series,
    topPaths: (pathsRes.rows as { path: string; views: unknown }[]).map((r) => ({
      path: r.path,
      views: Number(r.views),
    })),
    topReferrers: (refsRes.rows as { referrer: string; views: unknown }[]).map((r) => ({
      referrer: r.referrer,
      views: Number(r.views),
    })),
  };
}

/* ---------- enquiries (lead inbox) ---------- */

export type EnquiryFilter = { status?: string; q?: string };

function enquiryWhere({ status, q }: EnquiryFilter) {
  const conds = [];
  if (status === "new" || status === "read" || status === "replied") {
    conds.push(eq(schema.enquiries.status, status));
  }
  const term = (q ?? "").trim();
  if (term) {
    conds.push(
      or(
        ilike(schema.enquiries.name, `%${term}%`),
        ilike(schema.enquiries.phone, `%${term}%`),
        ilike(schema.enquiries.email, `%${term}%`),
        ilike(schema.enquiries.course, `%${term}%`)
      )
    );
  }
  return conds.length ? and(...conds) : undefined;
}

export async function getEnquiries(f: EnquiryFilter = {}, limit = 500) {
  return db.query.enquiries.findMany({
    where: enquiryWhere(f),
    orderBy: desc(schema.enquiries.createdAt),
    limit,
  });
}

/** { all, new, read, replied } counts for the inbox tabs. */
export async function getEnquiryCounts() {
  const rows = await db
    .select({ status: schema.enquiries.status, n: count() })
    .from(schema.enquiries)
    .groupBy(schema.enquiries.status);
  const out = { all: 0, new: 0, read: 0, replied: 0 };
  for (const r of rows) {
    out.all += r.n;
    if (r.status === "new" || r.status === "read" || r.status === "replied") out[r.status] = r.n;
  }
  return out;
}

/** Dashboard lead-gen numbers: today / yesterday / 7d / prev-7d / 30d / still-new. */
export async function getEnquiryStats() {
  const res = await db.execute(sql`
    select
      count(*) filter (where created_at >= date_trunc('day', now())) as today,
      count(*) filter (where created_at >= now() - interval '7 days') as week,
      count(*) filter (where created_at >= now() - interval '7 days' and created_at < now() - interval '14 days') as prev_week,
      count(*) filter (where created_at >= now() - interval '30 days') as month,
      count(*) filter (where status = 'new') as unread
    from enquiries`);
  const r = (res.rows[0] ?? {}) as Record<string, unknown>;
  return {
    today: Number(r.today ?? 0),
    week: Number(r.week ?? 0),
    prevWeek: Number(r.prev_week ?? 0),
    month: Number(r.month ?? 0),
    unread: Number(r.unread ?? 0),
  };
}
