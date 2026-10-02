/* ==========================================================================
   ACE MINDS — site content
   --------------------------------------------------------------------------
   Every list in this file maps 1:1 to a module of the future admin panel
   (courses, results/toppers, testimonials, faculty, sliders, posters, FAQs,
   blog posts, notices). When the backend lands, replace this file with an
   API call (e.g. fetch in a Server Component) returning the same shape and the pages keep
   working unchanged.

   ⚠️ Toppers, scores, reviews and some contact details below are SAMPLE
   placeholders for layout only. Replace with real data before going live.
   ========================================================================== */

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
export interface Faculty { name: string; role: string; edu: string; exp: string; subject: string; img?: string; tags: string[]; bio: string }
export interface Pillar { icon: "target" | "cap" | "clipboard" | "heart"; title: string; text: string }
export interface Poster { theme: "p-gold" | "p-navy" | "p-cream"; date: string; title: string; text: string; cta: string; href: string; deco: string }
export interface Faq { q: string; a: string }
export interface Post { slug: string; cat: string; date: string; read: string; title: string; excerpt: string; color: string; img?: string }
export interface SiteData {
  site: {
    name: string; tagline: string; initiative: string; domain: string; phone: string; phoneRaw: string; whatsapp: string;
    email: string; address: string; hours: string; mapEmbed: string; youtube: string; instagram: string; facebook: string;
    brochure: string; founded: number;
  };
  notices: Notice[]; slides: Slide[]; categories: Category[]; courses: Course[]; toppers: Topper[]; resultStats: Stat[];
  videoStories: VideoStory[]; letters: Letter[]; reviews: Review[]; reviewSummary: { rating: number; count: number };
  faculty: Faculty[]; pillars: Pillar[]; posters: Poster[]; faqs: Faq[]; posts: Post[];
}

export const ACE: SiteData = {
  site: {
    name: "Ace Minds",
    tagline: "Private Tutorials",
    initiative: "An IIT Alumni Initiative",
    domain: "aceminds.in",
    phone: "+91 90000 00000",
    phoneRaw: "+919000000000",
    whatsapp: "919000000000",
    email: "info@aceminds.in",
    address: "Ace Minds Private Tutorials, Your Centre Address, City – 400000",
    hours: "Mon – Sat · 8:00 AM – 8:00 PM",
    mapEmbed: "https://www.google.com/maps?q=India&output=embed",
    youtube: "https://www.youtube.com/@aceminds",
    instagram: "https://www.instagram.com/aceminds",
    facebook: "https://www.facebook.com/aceminds",
    brochure: "#brochure",
    founded: 2016
  },

  // Rolling exam/news ticker
  notices: [
    { text: "Admissions open for 2026–28 JEE / NEET two-year batch", href: "/admissions" },
    { text: "ACE-SAT scholarship test on Sunday — up to 90% fee waiver", href: "/admissions#scholarship" },
    { text: "JEE Main 2027 session-1 dates announced — read the analysis", href: "/blog" },
    { text: "Free Physics demo class every Saturday with Deepak Sir", href: "/contact" },
    { text: "New crash course for MHT-CET starting next month", href: "/courses?cat=cet" }
  ],

  // Hero slider (admin: Sliders)
  slides: [
    { img: "/img/lectures/equation-of-trajectory.webp", kicker: "Free lecture", title: "Equation of Trajectory — eliminate t, find y(x)", video: "https://www.youtube.com/embed/videoseries?list=PLACEHOLDER" },
    { img: "/img/lectures/power-work-done.webp", kicker: "Free lecture", title: "Power: work done per unit time", video: "https://www.youtube.com/embed/videoseries?list=PLACEHOLDER" }
  ],

  // Course categories (admin: Course categories)
  categories: [
    { id: "jee", label: "IIT-JEE", short: "JEE", desc: "Main + Advanced, 11th–12th & droppers", color: "#2e7bea" },
    { id: "neet", label: "NEET", short: "NEET", desc: "Physics, Chemistry & Biology for NEET-UG", color: "#e63946" },
    { id: "cet", label: "MHT-CET", short: "CET", desc: "State CET with board integration", color: "#f28c28" },
    { id: "boards", label: "Boards", short: "BRD", desc: "CBSE / ICSE / State 11th–12th", color: "#16315f" },
    { id: "foundation", label: "Foundation", short: "8–10", desc: "Olympiad & NTSE base, class 8–10", color: "#e0a516" }
  ],

  // Courses (admin: Courses)
  courses: [
    {
      cat: "jee", title: "JEE Two-Year Classroom", for: "Students moving into Class 11", duration: "2 Years", mode: "Classroom",
      start: "April & June batches", batch: "Max 30 students", badge: "Most popular", hot: true, seats: 8,
      features: ["Complete Main + Advanced syllabus", "Weekly tests with All-India ranking", "1:1 doubt slots with IIT alumni", "Printed modules + DPPs"]
    },
    {
      cat: "jee", title: "JEE One-Year Target", for: "Class 12 & dropper students", duration: "1 Year", mode: "Classroom + Online",
      start: "June batch", batch: "Max 30 students", badge: "Droppers", seats: 12,
      features: ["Fast-track syllabus completion", "40+ full-length mock tests", "Rank-improvement mentoring", "Previous-year paper drills"]
    },
    {
      cat: "neet", title: "NEET Two-Year Classroom", for: "Students moving into Class 11", duration: "2 Years", mode: "Classroom",
      start: "April batch", batch: "Max 35 students", badge: "New batch", seats: 10,
      features: ["NCERT-line-by-line Biology", "Concept-first Physics with Deepak Sir", "Bi-weekly NEET pattern tests", "Parent progress reports"]
    },
    {
      cat: "neet", title: "NEET Repeater Batch", for: "Dropper students", duration: "1 Year", mode: "Classroom",
      start: "June batch", batch: "Max 35 students", seats: 15,
      features: ["Error-log based revision", "Daily practice + weekly mock", "Time-management workshops", "Personal mentor"]
    },
    {
      cat: "cet", title: "MHT-CET Integrated", for: "Class 11 & 12 (State Board)", duration: "2 Years", mode: "Classroom",
      start: "April batch", batch: "Max 40 students", badge: "Board + CET", seats: 18,
      features: ["Board + CET in one timetable", "Chapter-wise CET question banks", "Speed & accuracy drills", "Online test series"]
    },
    {
      cat: "cet", title: "CET Crash Course", for: "Class 12 after boards", duration: "45 Days", mode: "Classroom + Online",
      start: "March", batch: "Max 60 students", seats: 25,
      features: ["Full syllabus revision", "15 full-length CET mocks", "Shortcut & formula sheets", "Last-week strategy sessions"]
    },
    {
      cat: "boards", title: "Class 11–12 Board Excellence", for: "CBSE / ICSE / HSC", duration: "1 Year", mode: "Classroom",
      start: "April batch", batch: "Max 25 students", seats: 10,
      features: ["Physics, Chemistry, Maths / Biology", "Answer-writing practice", "Practical & journal guidance", "Pre-board mock exams"]
    },
    {
      cat: "foundation", title: "Foundation (Class 8–10)", for: "Class 8, 9 & 10", duration: "1–3 Years", mode: "Classroom",
      start: "April batch", batch: "Max 25 students", badge: "Early start", seats: 14,
      features: ["School + Olympiad + NTSE", "Mental-ability & reasoning", "Concept labs & experiments", "Monthly parent meets"]
    }
  ],

  // Toppers (admin: Results & Toppers) — SAMPLE DATA
  toppers: [
    { name: "Aarav Sharma", exam: "JEE Advanced", year: 2026, rank: "AIR 1,284", score: "JEE Main 99.62 %ile", college: "IIT Bombay", cat: "jee" },
    { name: "Ishita Patil", exam: "NEET-UG", year: 2026, rank: "AIR 2,105", score: "680 / 720", college: "GMC Mumbai", cat: "neet" },
    { name: "Rohan Deshmukh", exam: "MHT-CET", year: 2026, rank: "99.84 %ile", score: "PCM 99.84", college: "COEP Pune", cat: "cet" },
    { name: "Sneha Kulkarni", exam: "Class 12 Boards", year: 2026, rank: "96.4 %", score: "Physics 100/100", college: "Board topper", cat: "boards" },
    { name: "Kabir Jain", exam: "JEE Main", year: 2026, rank: "99.31 %ile", score: "Physics 100 %ile", college: "NIT Trichy", cat: "jee" },
    { name: "Ananya Rao", exam: "NEET-UG", year: 2025, rank: "AIR 3,940", score: "662 / 720", college: "BJMC Pune", cat: "neet" },
    { name: "Vedant Joshi", exam: "JEE Advanced", year: 2025, rank: "AIR 3,304", score: "JEE Main 99.13 %ile", college: "IIT Kharagpur", cat: "jee" },
    { name: "Mira Nair", exam: "MHT-CET", year: 2025, rank: "99.66 %ile", score: "PCB 99.66", college: "VJTI Mumbai", cat: "cet" },
    { name: "Arjun Singh", exam: "Class 10 Boards", year: 2025, rank: "98.2 %", score: "Science 100/100", college: "School topper", cat: "foundation" },
    { name: "Tanvi More", exam: "Class 12 Boards", year: 2025, rank: "95.8 %", score: "Maths 99/100", college: "Board topper", cat: "boards" },
    { name: "Yash Gupta", exam: "JEE Main", year: 2024, rank: "99.05 %ile", score: "Maths 99.8 %ile", college: "IIIT Hyderabad", cat: "jee" },
    { name: "Riya Thakur", exam: "NEET-UG", year: 2024, rank: "AIR 5,612", score: "655 / 720", college: "GMC Nagpur", cat: "neet" }
  ],

  resultStats: [
    { value: 120, suffix: "+", label: "IIT & NIT selections" },
    { value: 85, suffix: "+", label: "Govt. medical seats" },
    { value: 340, suffix: "+", label: "Students above 95 %ile" },
    { value: 100, suffix: "%", label: "Board pass rate" }
  ],

  // Video testimonials (admin: Testimonials · type=video) — SAMPLE DATA
  videoStories: [
    { name: "Aarav Sharma", batch: "2026 Batch", headline: "IIT Bombay", lines: ["JEE Adv AIR 1,284", "JEE Main 99.62 %ile"], video: "https://www.youtube.com/embed/PLACEHOLDER" },
    { name: "Ishita Patil", batch: "2026 Batch", headline: "NEET 680", lines: ["AIR 2,105", "Physics 175 / 180"], video: "https://www.youtube.com/embed/PLACEHOLDER" },
    { name: "Sneha Kulkarni", batch: "2026 Batch", headline: "100 / 100", lines: ["Physics · Class 12", "96.4 % overall"], video: "https://www.youtube.com/embed/PLACEHOLDER" }
  ],

  // Handwritten notes (admin: Testimonials · type=letter) — SAMPLE DATA
  letters: [
    { name: "Vedant J.", tag: "AIR 3,304 · JEE Adv", text: "I was scoring around 90 in my first Main mock. Deepak Sir made me redo every wrong question until I could explain it back. Six months later Physics became my strongest subject." },
    { name: "Ananya R.", tag: "NEET 662", text: "Small batch meant Sir knew exactly where I was stuck. The error-log habit he made us build is the only reason I didn't panic in the actual exam." },
    { name: "Kabir J.", tag: "JEE Main 99.31", text: "I almost quit coaching after class 11. Here they never made me feel slow — they just made the concepts simple. Thank you for not giving up on me." }
  ],

  // Text reviews (admin: Testimonials · type=review) — SAMPLE DATA
  reviews: [
    { name: "Priya Deshpande", role: "Parent · JEE 2026", when: "2 months ago", text: "The weekly progress report and the parent meets keep us fully in the loop. Teachers are approachable and genuinely care about every student." },
    { name: "Omkar Patil", role: "Student · NEET 2026", when: "3 months ago", text: "Doubts get solved the same day. The tests are tougher than the real exam, which made NEET feel easy. Best decision I made after Class 10." },
    { name: "Sana Shaikh", role: "Student · CET 2025", when: "5 months ago", text: "Concept explanation in Physics is next level — every formula is derived, nothing is mugged up. Faculty from IIT background really shows." },
    { name: "Rahul Mehta", role: "Parent · Foundation", when: "6 months ago", text: "My son started in Class 8. His school marks and confidence both went up. Very disciplined but friendly environment." }
  ],
  reviewSummary: { rating: 4.9, count: 380 },

  // Faculty (admin: Faculty) — only Deepak Sir has a real photo
  faculty: [
    { name: "Deepak Rana", role: "Physics Mentor · Founder", edu: "IIT Bombay alumnus", exp: "10+ yrs", subject: "Physics", img: "/img/faculty/deepak-rana.webp", tags: ["JEE Adv", "NEET", "Mechanics"], bio: "Known for 'Physics Made Simple' — every formula derived from first principles, every concept tied to a picture." },
    { name: "Chemistry Faculty", role: "Chemistry Mentor", edu: "IIT alumnus", exp: "8+ yrs", subject: "Chemistry", tags: ["Organic", "JEE", "NEET"], bio: "Reaction mechanisms taught as stories, not lists — with weekly reaction-map revisions." },
    { name: "Maths Faculty", role: "Mathematics Mentor", edu: "NIT alumnus", exp: "9+ yrs", subject: "Maths", tags: ["Calculus", "JEE Adv", "CET"], bio: "Builds problem-solving speed through pattern drills and timed sprint sessions." },
    { name: "Biology Faculty", role: "Biology Mentor", edu: "MBBS · AIIMS", exp: "7+ yrs", subject: "Biology", tags: ["NEET", "NCERT", "Botany"], bio: "NCERT line-by-line approach with diagrams and mnemonics that stick till exam day." }
  ],

  // Hero feature strip
  pillars: [
    { icon: "target", title: "Personal Attention", text: "Max 30 per batch" },
    { icon: "cap", title: "IIT Alumni Mentors", text: "Taught by toppers" },
    { icon: "clipboard", title: "Weekly Tests", text: "With rank analysis" },
    { icon: "heart", title: "Student-First", text: "Same-day doubt solving" }
  ],

  // Posters / announcements (admin: Posters)
  posters: [
    { theme: "p-gold", date: "Every Sunday", title: "ACE-SAT Scholarship Test", text: "Win up to 90% fee waiver on 2026–28 batches.", cta: "Register free", href: "/admissions#scholarship", deco: "%" },
    { theme: "p-navy", date: "Saturdays · 11 AM", title: "Free Physics Demo", text: "Sit in a live class with Deepak Sir before you join.", cta: "Book a seat", href: "#enquire", deco: "P" },
    { theme: "p-cream", date: "Starting soon", title: "CET Crash Course", text: "45 days · 15 full mocks · formula booklet included.", cta: "View course", href: "/courses?cat=cet", deco: "45" }
  ],

  // FAQs (admin: FAQs)
  faqs: [
    { q: "What is the batch size at Ace Minds?", a: "We cap every classroom batch at 25–35 students depending on the course, so each student gets individual attention and faculty know every student by name." },
    { q: "Who teaches at Ace Minds?", a: "Ace Minds is an IIT alumni initiative. Core subjects are taught by IIT / NIT / AIIMS alumni with 7–10+ years of teaching experience, led by Deepak Rana Sir (IIT Bombay) for Physics." },
    { q: "Can I attend a demo class before taking admission?", a: "Yes. Free demo classes run every Saturday. Fill the enquiry form or call us and we will reserve a seat for you." },
    { q: "Do you offer scholarships?", a: "Yes — through the ACE-SAT scholarship test held every Sunday during admission season. Scholarships go up to 90% of tuition based on your score. Board and Olympiad performance are also considered." },
    { q: "How are parents kept updated?", a: "Parents receive test results after every weekly test, a monthly progress report and are invited to parent-teacher meets every month." },
    { q: "Is there an online / hybrid option?", a: "Select courses (One-Year Target and CET Crash Course) have a hybrid mode with live online classes, recorded backups and the same test series." }
  ],

  // Blog / news (admin: Blog)
  posts: [
    { slug: "jee-main-2027-dates", cat: "Exam updates", date: "28 Sep 2026", read: "4 min", title: "JEE Main 2027: expected dates, pattern & what changes this year", excerpt: "Session dates, the revised syllabus and a month-by-month plan to peak at the right time.", color: "#2e7bea" },
    { slug: "neet-physics-strategy", cat: "Strategy", date: "19 Sep 2026", read: "6 min", title: "How to score 170+ in NEET Physics without hating it", excerpt: "Deepak Sir's five-step method: derive, draw, drill, debug, dominate.", color: "#e63946", img: "/img/lectures/power-work-done.webp" },
    { slug: "projectile-motion-tricks", cat: "Concepts", date: "10 Sep 2026", read: "5 min", title: "Equation of trajectory: the one derivation you must own", excerpt: "Eliminate time, get y in terms of x — and solve 80% of projectile questions in seconds.", color: "#f28c28", img: "/img/lectures/equation-of-trajectory.webp" },
    { slug: "mht-cet-2027-notification", cat: "Exam updates", date: "02 Sep 2026", read: "3 min", title: "MHT-CET 2027 notification: eligibility and key dates", excerpt: "Everything Maharashtra aspirants need to know about the next CET cycle.", color: "#16315f" },
    { slug: "class-11-transition", cat: "Strategy", date: "24 Aug 2026", read: "5 min", title: "Class 10 to 11: surviving the biggest jump in your academic life", excerpt: "Why the first 90 days of Class 11 decide your JEE / NEET rank.", color: "#e0a516" },
    { slug: "toppers-daily-routine", cat: "Toppers", date: "12 Aug 2026", read: "4 min", title: "Inside a topper's day: the routine behind AIR 1,284", excerpt: "Sleep, revision cycles and the 30-minute habit our topper never skipped.", color: "#0f2347" }
  ]
};

export const catOf = (id: string) => ACE.categories.find((c) => c.id === id);
export const initials = (n: string) => n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const palette = ["#2e7bea", "#e63946", "#f28c28", "#16315f", "#e0a516", "#1f427a"];
export const colorFor = (s: string) => palette[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length];
