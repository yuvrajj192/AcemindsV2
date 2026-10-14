import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { formatDate, timeAgo } from "@/lib/utils";
import type {
  Category, Course, Faculty, Faq, Letter, Notice, Post, Poster, Review, ReviewSummary, SiteInfo, Slide, Stat, Topper, VideoStory,
} from "@/lib/types";

/* One hour fallback; admin mutations call revalidateTag with these keys. */
const TAGS = {
  site: "site",
  categories: "categories",
  courses: "courses",
  toppers: "toppers",
  resultStats: "result-stats",
  slides: "slides",
  videoStories: "video-stories",
  letters: "letters",
  reviews: "reviews",
  faculty: "faculty",
  posters: "posters",
  faqs: "faqs",
  notices: "notices",
  posts: "posts",
} as const;

const REVALIDATE = 3600;

export const getSiteSettings = () =>
  unstable_cache(
    async (): Promise<SiteInfo> => {
      const row = await db.query.siteSettings.findFirst({ where: eq(schema.siteSettings.id, "main") });
      if (!row) throw new Error("site_settings row missing — run `npm run db:seed`");
      const { id: _id, ...site } = row;
      return site;
    },
    ["site-settings"],
    { tags: [TAGS.site], revalidate: REVALIDATE }
  )();

export const getCategories = () =>
  unstable_cache(
    async (): Promise<Category[]> => {
      const rows = await db.query.categories.findMany({
        where: eq(schema.categories.published, true),
        orderBy: [asc(schema.categories.sortOrder), asc(schema.categories.label)],
      });
      return rows.map(({ id, label, short, desc, color }) => ({
        id: id as Category["id"], label, short, desc, color,
      }));
    },
    ["categories"],
    { tags: [TAGS.categories], revalidate: REVALIDATE }
  )();

export const getCourses = () =>
  unstable_cache(
    async (): Promise<Course[]> => {
      const rows = await db.query.courses.findMany({
        where: eq(schema.courses.published, true),
        orderBy: [asc(schema.courses.sortOrder), asc(schema.courses.title)],
      });
      return rows.map((r) => ({
        cat: r.catId as Course["cat"],
        title: r.title,
        for: r.forLine,
        duration: r.duration,
        mode: r.mode,
        start: r.start,
        batch: r.batch,
        badge: r.badge ?? undefined,
        hot: r.hot,
        seats: r.seats,
        features: r.features ?? [],
      }));
    },
    ["courses"],
    { tags: [TAGS.courses], revalidate: REVALIDATE }
  )();

export const getToppers = () =>
  unstable_cache(
    async (): Promise<Topper[]> => {
      const rows = await db.query.toppers.findMany({
        where: eq(schema.toppers.published, true),
        with: { photo: true },
        orderBy: [desc(schema.toppers.year), asc(schema.toppers.sortOrder), asc(schema.toppers.name)],
      });
      return rows.map((r) => ({
        name: r.name,
        exam: r.exam,
        year: r.year,
        rank: r.rank,
        score: r.score,
        college: r.college,
        cat: r.catId as Topper["cat"],
        img: r.photo?.url,
      }));
    },
    ["toppers"],
    { tags: [TAGS.toppers], revalidate: REVALIDATE }
  )();

export const getResultStats = () =>
  unstable_cache(
    async (): Promise<Stat[]> => {
      const rows = await db.query.resultStats.findMany({
        where: eq(schema.resultStats.published, true),
        orderBy: [asc(schema.resultStats.sortOrder)],
      });
      return rows.map((r) => ({ value: r.value, suffix: r.suffix, label: r.label }));
    },
    ["result-stats"],
    { tags: [TAGS.resultStats], revalidate: REVALIDATE }
  )();

export const getSlides = () =>
  unstable_cache(
    async (): Promise<Slide[]> => {
      const rows = await db.query.slides.findMany({
        where: eq(schema.slides.published, true),
        with: { image: true },
        orderBy: [asc(schema.slides.sortOrder)],
      });
      return rows
        .filter((r) => r.image?.url)
        .map((r) => ({ img: r.image!.url, kicker: r.kicker, title: r.title, video: r.videoUrl }));
    },
    ["slides"],
    { tags: [TAGS.slides], revalidate: REVALIDATE }
  )();

export const getVideoStories = () =>
  unstable_cache(
    async (): Promise<VideoStory[]> => {
      const rows = await db.query.videoStories.findMany({
        where: eq(schema.videoStories.published, true),
        orderBy: [asc(schema.videoStories.sortOrder)],
      });
      return rows.map((r) => ({ name: r.name, batch: r.batch, headline: r.headline, lines: r.lines ?? [], video: r.videoUrl }));
    },
    ["video-stories"],
    { tags: [TAGS.videoStories], revalidate: REVALIDATE }
  )();

export const getLetters = () =>
  unstable_cache(
    async (): Promise<Letter[]> => {
      const rows = await db.query.letters.findMany({
        where: eq(schema.letters.published, true),
        orderBy: [asc(schema.letters.sortOrder)],
      });
      return rows.map((r) => ({ name: r.name, tag: r.tag, text: r.body }));
    },
    ["letters"],
    { tags: [TAGS.letters], revalidate: REVALIDATE }
  )();

export const getReviews = () =>
  unstable_cache(
    async (): Promise<Review[]> => {
      const rows = await db.query.reviews.findMany({
        where: eq(schema.reviews.published, true),
        orderBy: [desc(schema.reviews.createdAt)],
      });
      return rows.map((r) => ({ name: r.name, role: r.role, when: timeAgo(r.createdAt), text: r.body }));
    },
    ["reviews"],
    { tags: [TAGS.reviews], revalidate: REVALIDATE }
  )();

export const getReviewSummary = () =>
  unstable_cache(
    async (): Promise<ReviewSummary> => {
      const row = await db.query.reviewSummary.findFirst({ where: eq(schema.reviewSummary.id, "main") });
      return { rating: Number(row?.rating ?? 4.9), count: row?.count ?? 0 };
    },
    ["review-summary"],
    { tags: [TAGS.reviews], revalidate: REVALIDATE }
  )();

export const getFaculty = () =>
  unstable_cache(
    async (): Promise<Faculty[]> => {
      const rows = await db.query.faculty.findMany({
        where: eq(schema.faculty.published, true),
        with: { photo: true },
        orderBy: [desc(schema.faculty.isFounder), asc(schema.faculty.sortOrder), asc(schema.faculty.name)],
      });
      return rows.map((r) => ({
        name: r.name,
        role: r.role,
        edu: r.edu,
        exp: r.exp,
        subject: r.subject,
        img: r.photo?.url,
        tags: r.tags ?? [],
        bio: r.bio,
      }));
    },
    ["faculty"],
    { tags: [TAGS.faculty], revalidate: REVALIDATE }
  )();

export const getPosters = () =>
  unstable_cache(
    async (): Promise<Poster[]> => {
      const rows = await db.query.posters.findMany({
        where: eq(schema.posters.published, true),
        orderBy: [asc(schema.posters.sortOrder)],
      });
      return rows.map((r) => ({
        theme: r.theme,
        date: r.dateText,
        title: r.title,
        text: r.body,
        cta: r.cta,
        href: r.href,
        deco: r.deco,
      }));
    },
    ["posters"],
    { tags: [TAGS.posters], revalidate: REVALIDATE }
  )();

export const getFaqs = () =>
  unstable_cache(
    async (): Promise<Faq[]> => {
      const rows = await db.query.faqs.findMany({
        where: eq(schema.faqs.published, true),
        orderBy: [asc(schema.faqs.sortOrder)],
      });
      return rows.map((r) => ({ q: r.q, a: r.a }));
    },
    ["faqs"],
    { tags: [TAGS.faqs], revalidate: REVALIDATE }
  )();

export const getNotices = () =>
  unstable_cache(
    async (): Promise<Notice[]> => {
      const rows = await db.query.notices.findMany({
        where: eq(schema.notices.active, true),
        orderBy: [asc(schema.notices.sortOrder)],
      });
      return rows.map((r) => ({ text: r.text, href: r.href }));
    },
    ["notices"],
    { tags: [TAGS.notices], revalidate: REVALIDATE }
  )();

export const getPublishedPosts = () =>
  unstable_cache(
    async (): Promise<Post[]> => {
      const rows = await db.query.posts.findMany({
        where: eq(schema.posts.status, "published"),
        with: { cover: true },
        orderBy: [desc(schema.posts.publishedAt), desc(schema.posts.createdAt)],
      });
      return rows.map((r) => ({
        slug: r.slug,
        cat: r.cat,
        date: formatDate(r.publishedAt ?? r.createdAt),
        read: r.readTime,
        title: r.title,
        excerpt: r.excerpt,
        color: r.colorHex,
        img: r.cover?.url,
      }));
    },
    ["posts"],
    { tags: [TAGS.posts], revalidate: REVALIDATE }
  )();

export const getPostBySlug = (slug: string) =>
  unstable_cache(
    async (s: string): Promise<Post | null> => {
      const r = await db.query.posts.findFirst({
        where: eq(schema.posts.slug, s),
        with: { cover: true },
      });
      if (!r || r.status !== "published") return null;
      return {
        slug: r.slug,
        cat: r.cat,
        date: formatDate(r.publishedAt ?? r.createdAt),
        read: r.readTime,
        title: r.title,
        excerpt: r.excerpt,
        color: r.colorHex,
        img: r.cover?.url,
      };
    },
    ["post-by-slug"],
    { tags: [TAGS.posts], revalidate: REVALIDATE }
  )(slug);

/** Per-request dedupe when layout + page both need the same lists. */
export const getLayoutData = cache(async () => {
  const [site, categories, notices, courses] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getNotices(),
    getCourses(),
  ]);
  return { site, categories, notices, courses };
});

export { TAGS };
