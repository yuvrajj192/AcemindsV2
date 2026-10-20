/* Shared domain types — the shape every page/component consumes.
   DB rows are mapped into these in lib/queries.ts, so UI code never
   depends on Drizzle table types. */

export type CategoryId = "jee" | "neet" | "cet" | "boards" | "foundation";

export interface Notice { text: string; href: string }
export interface Slide { img: string; kicker: string; title: string; video: string }
export interface Category { id: CategoryId; label: string; short: string; desc: string; color: string }
export interface Course {
  cat: CategoryId; title: string; for: string; duration: string; mode: string; start: string; batch: string;
  badge?: string; hot?: boolean; seats: number; features: string[];
}
export interface Topper { name: string; exam: string; year: number; rank: string; score: string; college: string; cat: CategoryId; img?: string }
export interface Stat { value: number; suffix: string; label: string }
export interface VideoStory { name: string; batch: string; headline: string; lines: string[]; video: string }
export interface Letter { name: string; tag: string; text: string }
export interface Review { name: string; role: string; when: string; text: string }
export interface Faculty { name: string; role: string; edu: string; exp: string; subject: string; img?: string; tags: string[]; bio: string; founder?: boolean }
export interface Pillar { icon: "target" | "cap" | "clipboard" | "heart"; title: string; text: string }
export interface Poster { theme: "p-gold" | "p-navy" | "p-cream"; date: string; title: string; text: string; cta: string; href: string; deco: string }
export interface Faq { q: string; a: string }
export interface Post { slug: string; cat: string; date: string; read: string; title: string; excerpt: string; color: string; img?: string; html?: string; paragraphs?: string[] }

export interface SiteInfo {
  name: string; tagline: string; initiative: string; domain: string; phone: string; phoneRaw: string; whatsapp: string;
  email: string; address: string; hours: string; mapEmbed: string; youtube: string; instagram: string; facebook: string;
  brochure: string; founded: number;
}

export interface ReviewSummary { rating: number; count: number }

export interface SiteData {
  site: SiteInfo;
  notices: Notice[]; slides: Slide[]; categories: Category[]; courses: Course[]; toppers: Topper[]; resultStats: Stat[];
  videoStories: VideoStory[]; letters: Letter[]; reviews: Review[]; reviewSummary: ReviewSummary;
  faculty: Faculty[]; pillars: Pillar[]; posters: Poster[]; faqs: Faq[]; posts: Post[];
}
