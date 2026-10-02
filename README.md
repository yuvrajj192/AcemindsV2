# Ace Minds — website frontend

Frontend for **aceminds.in** (Ace Minds Private Tutorials · An IIT Alumni Initiative), built with **Next.js (App Router) + TypeScript**. The backend and admin panel are not built yet. All content comes from one typed data file, so it can be swapped for an API later.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production build
```

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
lib/data.ts          ALL site content (typed). One list per future admin module.
public/img/          lecture thumbnails, faculty photos, favicon
```

## Hooking up the backend later

- **Content**: every list in `lib/data.ts` (courses, toppers, testimonials, faculty, slides, posters, FAQs, posts, notices) matches a planned admin module. Replace it with a fetch in Server Components that returns the same shape.
- **Enquiries**: `components/EnquiryForm.tsx` currently saves submissions to `localStorage` (`ace_enquiries`) so the flow can be demoed. Replace the marked block with a `POST /api/enquiries` that stores the enquiry and handles the email alert and Excel export.

## ⚠️ Replace before going live

Toppers, scores, reviews, student letters, phone number, address, map, social links and YouTube video URLs in `lib/data.ts` are **sample placeholders**. Only Deepak Rana Sir's photos and lecture thumbnails are real assets.

## Design

The palette comes from the Ace Minds lecture thumbnails: deep navy panels, warm cream, trophy gold, plus the logo's red and electric blue. It reuses their diagonal navy/cream split, condensed display type (Anton), handwritten notes (Caveat) and cream "tag" highlights.
