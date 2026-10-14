import { relations } from "drizzle-orm";
import { boolean, integer, jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/* Every content table shares this tail. */
const stamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
};
const listMeta = {
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
};

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["owner", "editor"] }).notNull().default("editor"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  short: text("short").notNull(),
  desc: text("desc").notNull(),
  color: text("color").notNull(),
  ...listMeta,
});

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  url: text("url").notNull(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull().default(0),
  width: integer("width"),
  height: integer("height"),
  alt: text("alt").notNull().default(""),
  folder: text("folder").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  catId: text("cat_id").notNull().references(() => categories.id),
  title: text("title").notNull(),
  forLine: text("for_line").notNull(),
  duration: text("duration").notNull(),
  mode: text("mode").notNull(),
  start: text("start").notNull(),
  batch: text("batch").notNull(),
  badge: text("badge"),
  hot: boolean("hot").notNull().default(false),
  seats: integer("seats").notNull().default(0),
  features: text("features").array().notNull().default([]),
  ...listMeta,
  ...stamps,
});

export const toppers = pgTable("toppers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  exam: text("exam").notNull(),
  year: integer("year").notNull(),
  rank: text("rank").notNull(),
  score: text("score").notNull(),
  college: text("college").notNull(),
  catId: text("cat_id").notNull().references(() => categories.id),
  mediaId: uuid("media_id").references(() => media.id, { onDelete: "set null" }),
  ...listMeta,
  ...stamps,
});

export const resultStats = pgTable("result_stats", {
  id: uuid("id").defaultRandom().primaryKey(),
  value: integer("value").notNull(),
  suffix: text("suffix").notNull().default(""),
  label: text("label").notNull(),
  ...listMeta,
  ...stamps,
});

export const slides = pgTable("slides", {
  id: uuid("id").defaultRandom().primaryKey(),
  mediaId: uuid("media_id").references(() => media.id, { onDelete: "set null" }),
  kicker: text("kicker").notNull(),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  ...listMeta,
  ...stamps,
});

export const videoStories = pgTable("video_stories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  batch: text("batch").notNull(),
  headline: text("headline").notNull(),
  lines: text("lines").array().notNull().default([]),
  videoUrl: text("video_url").notNull(),
  ...listMeta,
  ...stamps,
});

export const letters = pgTable("letters", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  tag: text("tag").notNull(),
  body: text("body").notNull(),
  ...listMeta,
  ...stamps,
});

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  body: text("body").notNull(),
  ...listMeta,
  ...stamps,
});

export const reviewSummary = pgTable("review_summary", {
  id: text("id").primaryKey(),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull().default("4.9"),
  count: integer("count").notNull().default(0),
});

export const faculty = pgTable("faculty", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  edu: text("edu").notNull(),
  exp: text("exp").notNull(),
  subject: text("subject").notNull(),
  mediaId: uuid("media_id").references(() => media.id, { onDelete: "set null" }),
  tags: text("tags").array().notNull().default([]),
  bio: text("bio").notNull(),
  isFounder: boolean("is_founder").notNull().default(false),
  ...listMeta,
  ...stamps,
});

export const posters = pgTable("posters", {
  id: uuid("id").defaultRandom().primaryKey(),
  theme: text("theme", { enum: ["p-gold", "p-navy", "p-cream"] }).notNull().default("p-gold"),
  dateText: text("date_text").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  cta: text("cta").notNull(),
  href: text("href").notNull(),
  deco: text("deco").notNull().default(""),
  ...listMeta,
  ...stamps,
});

export const faqs = pgTable("faqs", {
  id: uuid("id").defaultRandom().primaryKey(),
  q: text("q").notNull(),
  a: text("a").notNull(),
  ...listMeta,
  ...stamps,
});

export const notices = pgTable("notices", {
  id: uuid("id").defaultRandom().primaryKey(),
  text: text("text").notNull(),
  href: text("href").notNull(),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  cat: text("cat").notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: jsonb("body"),
  mediaId: uuid("media_id").references(() => media.id, { onDelete: "set null" }),
  colorHex: text("color_hex").notNull().default("#2e7bea"),
  readTime: text("read_time").notNull().default("4 min"),
  status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
  ...stamps,
});

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  initiative: text("initiative").notNull(),
  domain: text("domain").notNull(),
  phone: text("phone").notNull(),
  phoneRaw: text("phone_raw").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  hours: text("hours").notNull(),
  mapEmbed: text("map_embed").notNull(),
  youtube: text("youtube").notNull(),
  instagram: text("instagram").notNull(),
  facebook: text("facebook").notNull(),
  brochure: text("brochure").notNull(),
  founded: integer("founded").notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  courses: many(courses),
  toppers: many(toppers),
}));

export const coursesRelations = relations(courses, ({ one }) => ({
  category: one(categories, { fields: [courses.catId], references: [categories.id] }),
}));

export const toppersRelations = relations(toppers, ({ one }) => ({
  category: one(categories, { fields: [toppers.catId], references: [categories.id] }),
  photo: one(media, { fields: [toppers.mediaId], references: [media.id] }),
}));

export const slidesRelations = relations(slides, ({ one }) => ({
  image: one(media, { fields: [slides.mediaId], references: [media.id] }),
}));

export const facultyRelations = relations(faculty, ({ one }) => ({
  photo: one(media, { fields: [faculty.mediaId], references: [media.id] }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  cover: one(media, { fields: [posts.mediaId], references: [media.id] }),
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
