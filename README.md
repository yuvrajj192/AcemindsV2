# Ace Minds — website

Frontend + content layer for **aceminds.in** (Ace Minds Private Tutorials · An IIT Alumni Initiative), built with **Next.js (App Router) + TypeScript**. Site content now lives in **Postgres (Neon)** via Drizzle ORM; `lib/data.ts` is only the seed source. The admin panel is not built yet.

## Run it

```bash
npm install
cp .env.example .env.local    # fill in DATABASE_URL (Neon pooled URL)
npm run db:push               # create tables
npm run db:seed               # load content from lib/data.ts
npm run dev                   # http://localhost:3000
npm run build && npm start    # production build
```

## Database

| Command | What it does |
| --- | --- |
| `npm run db:push` | Push `lib/db/schema.ts` to the DB (drizzle-kit) |
| `npm run db:seed` | Truncate content tables and re-seed from `lib/data.ts` (re-runnable) |
| `npm run db:generate` | Generate SQL migration files into `drizzle/` |
| `npm run db:studio` | Browse the DB in Drizzle Studio |

- **Driver:** `pg` + `drizzle-orm/node-postgres`. Use Neon's **pooled** connection string in `DATABASE_URL`.
- **Caching:** content queries in `lib/queries.ts` are wrapped in `unstable_cache` with tags (`courses`, `toppers`, `posts`, …), 1h fallback. Admin actions (Phase 1+) will call `revalidateTag` for instant updates.
- **Seed:** `scripts/seed.ts` — imports `ACE` from `lib/data.ts`. Edit that file and re-run `db:seed` to refresh sample content until the admin panel lands.

## Pages

| Route | What's on it |
| --- | --- |
| `/` | Hero with lecture slider, stats, 2-click course finder, courses (filter tabs), toppers slider, Why Ace Minds, posters, free YouTube lectures, the ACE method, video stories, handwritten notes, Google-style reviews, faculty, FAQs, blog, CTA |
| `/courses` | All programs with category tabs (`/courses?cat=neet` pre-filters), finder, inclusions, FAQs |
| `/results` | Results wall with exam + year filters, stats, topper stories |
| `/faculty` | Founder spotlight (Deepak Rana Sir) + faculty grid |
| `/admissions` | 4-step process, ACE-SAT scholarship table, counselling booking form |
| `/testimonials` | Video stories, handwritten notes, reviews |
| `/about` | Story, values, timeline, team |
| `/blog`, `/blog/[slug]` | Filterable blog/news list and statically generated article pages |
| `/contact` | Contact cards, map, full enquiry form |

Shared on every page: sticky header with dropdowns, live-updates ticker, enquiry / brochure modal, video modal, WhatsApp + call buttons, mobile action bar, and a one-time "result alerts" toast.

## Where things live

```
app/                 routes + globals.css (design tokens & all styles)
components/
  ui.tsx             UIProvider: enquiry modal, video modal, floating actions, toast,
                     EnquireButton / VideoButton for use inside Server Components
  Interactive.tsx    client widgets: course explorer, results wall, blog filter, sliders,
                     hero slider, course finder, FAQ accordion, story cards
  Cards.tsx          course / topper / faculty / review / letter / poster / post cards
  EnquiryForm.tsx    validated enquiry form
  Header, Footer, Ticker, Sections, Reveal, Icons
lib/
  types.ts           shared domain types (SiteData shape, Course, Topper, …)
  utils.ts           pure helpers (initials, colorFor, formatDate, …)
  queries.ts         Drizzle queries + unstable_cache — what pages call
  db/schema.ts       Drizzle tables
  data.ts            SEED ONLY — the original static content
scripts/seed.ts      loads lib/data.ts into Postgres
public/img/          lecture thumbnails, faculty photos, favicon
```

## Hooking up the backend later

- **Content:** done for Phase 0 — pages read from Postgres via `lib/queries.ts`. The admin panel (Phase 1+) will mutate the same tables and call `revalidateTag`.
- **Enquiries:** `components/EnquiryForm.tsx` still saves submissions to `localStorage` (`ace_enquiries`). Phase 5 replaces the marked block with a `POST /api/enquiries` (admin + email alert + Excel export).

## ⚠️ Replace before going live

Toppers, scores, reviews, student letters, phone number, address, map, social links and YouTube video URLs seeded into the database are **sample placeholders**. Only Deepak Rana Sir's photos and lecture thumbnails are real assets. Edit them in Postgres (or re-seed after updating `lib/data.ts`) before launch.

## Design

The palette comes from the Ace Minds lecture thumbnails: deep navy panels, warm cream, trophy gold, plus the logo's red and electric blue. It reuses their diagonal navy/cream split, condensed display type (Anton), handwritten notes (Caveat) and cream "tag" highlights.
