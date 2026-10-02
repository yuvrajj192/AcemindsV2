"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ACE, colorFor, initials, type CategoryId, type VideoStory } from "@/lib/data";
import { Icon } from "./Icons";
import { CourseCard, PostCard, TopperCard } from "./Cards";
import { useUI } from "./ui";

/* ---------- Filter tabs ---------- */
function Tabs({ options, value, onChange, label }: { options: { id: string; label: string }[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" role="tab" aria-selected={value === o.id} className={value === o.id ? "active" : ""} onClick={() => onChange(o.id)}>{o.label}</button>
      ))}
    </div>
  );
}
const catOptions = [{ id: "all", label: "All" }, ...ACE.categories.map((c) => ({ id: c.id, label: c.label }))];

/* ---------- Courses with category tabs ---------- */
export function CourseExplorer({ limit, initialCat = "all", head }: { limit?: number; initialCat?: string; head?: ReactNode }) {
  const [cat, setCat] = useState(catOptions.some((o) => o.id === initialCat) ? initialCat : "all");
  const list = useMemo(() => {
    const filtered = ACE.courses.filter((c) => cat === "all" || c.cat === cat);
    return limit && cat === "all" ? filtered.slice(0, limit) : filtered;
  }, [cat, limit]);
  return (
    <>
      <div className="section-head-row">
        {head}
        <Tabs options={catOptions} value={cat} onChange={setCat} label="Course category" />
      </div>
      <div className="course-grid">{list.map((c) => <CourseCard key={c.title} c={c} i={ACE.courses.indexOf(c)} />)}</div>
    </>
  );
}

/* ---------- Results wall (exam + year filters) ---------- */
export function ResultsWall() {
  const [cat, setCat] = useState("all");
  const [year, setYear] = useState("all");
  const years = useMemo(() => [...new Set(ACE.toppers.map((t) => t.year))].sort((a, b) => b - a), []);
  const list = ACE.toppers.filter((t) => (cat === "all" || t.cat === cat) && (year === "all" || String(t.year) === year));
  return (
    <>
      <div className="filter-bar">
        <Tabs options={catOptions} value={cat} onChange={setCat} label="Exam" />
        <label className="sr-only" htmlFor="yearFilter">Year</label>
        <select className="select" id="yearFilter" value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="all">All years</option>
          {years.map((y) => <option key={y}>{y}</option>)}
        </select>
      </div>
      <div className="wall-grid">
        {list.map((t) => <TopperCard key={t.name + t.year} t={t} />)}
        {!list.length && <p className="empty-state">No results for this filter yet.</p>}
      </div>
    </>
  );
}

/* ---------- Blog grid with category tabs ---------- */
export function BlogExplorer() {
  const cats = useMemo(() => [{ id: "all", label: "All" }, ...[...new Set(ACE.posts.map((p) => p.cat))].map((c) => ({ id: c, label: c }))], []);
  const [cat, setCat] = useState("all");
  return (
    <>
      <div className="filter-bar"><Tabs options={cats} value={cat} onChange={setCat} label="Blog category" /></div>
      <div className="blog-grid">{ACE.posts.filter((p) => cat === "all" || p.cat === cat).map((p) => <PostCard key={p.slug} p={p} />)}</div>
    </>
  );
}

/* ---------- Generic slider ---------- */
export function Slider({ children, autoplay, head, nav = true }: { children: ReactNode[]; autoplay?: number; head?: ReactNode; nav?: boolean }) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [max, setMax] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const measure = useCallback(() => {
    const first = track.current?.children[0] as HTMLElement | undefined;
    if (!first || !viewport.current) return;
    const per = Math.max(1, Math.round(viewport.current.clientWidth / first.getBoundingClientRect().width));
    setMax(Math.max(0, children.length - per));
  }, [children.length]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const go = useCallback((n: number) => setIdx(n > max ? 0 : n < 0 ? max : n), [max]);

  useEffect(() => {
    const first = track.current?.children[0] as HTMLElement | undefined;
    if (!first || !track.current) return;
    const gap = parseFloat(getComputedStyle(track.current).gap) || 0;
    track.current.style.transform = `translateX(${-Math.min(idx, max) * (first.getBoundingClientRect().width + gap)}px)`;
  }, [idx, max]);

  useEffect(() => {
    if (!autoplay || paused) return;
    const t = setInterval(() => setIdx((i) => (i >= max ? 0 : i + 1)), autoplay);
    return () => clearInterval(t);
  }, [autoplay, paused, max]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {(head || nav) && (
        <div className="section-head-row">
          {head}
          {nav && (
            <div className="slider-nav">
              <button type="button" aria-label="Previous" onClick={() => go(idx - 1)}><Icon.left /></button>
              <button type="button" aria-label="Next" onClick={() => go(idx + 1)}><Icon.right /></button>
            </div>
          )}
        </div>
      )}
      <div className="slider" ref={viewport}>
        <div
          className="slider-track"
          ref={track}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
            touchX.current = null;
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function ToppersSlider({ head }: { head?: ReactNode }) {
  return (
    <Slider autoplay={4500} head={head}>
      {ACE.toppers.slice(0, 8).map((t) => <TopperCard key={t.name + t.year} t={t} />)}
    </Slider>
  );
}

/* ---------- Hero slider ---------- */
export function HeroSlider() {
  const { playVideo } = useUI();
  const [i, setI] = useState(0);
  const n = ACE.slides.length;
  useEffect(() => {
    if (n < 2) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), 6000);
    return () => clearTimeout(t);
  }, [i, n]);
  return (
    <div className="hero-card">
      <div className="hero-slides">
        {ACE.slides.map((s, k) => (
          <div key={s.img} className={`hero-slide${k === i ? " active" : ""}`} aria-hidden={k !== i}>
            <Image src={s.img} alt={s.title} fill priority={k === 0} sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        ))}
      </div>
      <div className="hero-slide-caption">
        <div key={i} className="cap-text"><small>{ACE.slides[i].kicker}</small><h3>{ACE.slides[i].title}</h3></div>
        <button className="play-btn" type="button" aria-label="Play lecture" onClick={() => playVideo(ACE.slides[i].video)}><Icon.play /></button>
      </div>
      <div className="hero-dots">
        {ACE.slides.map((_, k) => <button key={`${k}-${k === i ? i : "x"}`} type="button" aria-label={`Slide ${k + 1}`} className={k === i ? "active" : ""} onClick={() => setI(k)} />)}
      </div>
    </div>
  );
}

/* ---------- Hero projectile doodle ---------- */
export function Trajectory() {
  const path = useRef<SVGPathElement>(null);
  const ball = useRef<SVGCircleElement>(null);
  useEffect(() => {
    const arc = path.current, dot = ball.current;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !arc || !dot) return;
    const len = arc.getTotalLength();
    let raf = 0, t0 = 0, stopped = false;
    const loop = (t: number) => {
      // refs are nulled on unmount (e.g. HMR / route change) before a queued frame can run
      if (stopped || !arc.isConnected) return;
      t0 ||= t;
      const p = ((t - t0) % 3600) / 3000;
      if (p <= 1) {
        const pt = arc.getPointAtLength(len * p);
        dot.setAttribute("cx", String(pt.x));
        dot.setAttribute("cy", String(pt.y));
        dot.style.opacity = "1";
      } else dot.style.opacity = "0";
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { stopped = true; cancelAnimationFrame(raf); };
  }, []);
  return (
    <svg className="trajectory" viewBox="0 0 600 140" preserveAspectRatio="none" aria-hidden="true">
      <path ref={path} className="arc" d="M10 135 Q 300 -120 590 135" />
      <circle ref={ball} className="ball" r="8" cx="10" cy="135" />
    </svg>
  );
}

/* ---------- Course finder ---------- */
const classes = [["8", "Class 8"], ["9", "Class 9"], ["10", "Class 10"], ["11", "Class 11"], ["12", "Class 12"], ["drop", "Dropper"]];
const goals: [CategoryId, string][] = [["jee", "IIT-JEE"], ["neet", "NEET"], ["cet", "MHT-CET"], ["boards", "Board exams"]];

export function CourseFinder({ kicker, title, text }: { kicker: string; title: ReactNode; text: string }) {
  const { enquire } = useUI();
  const [cls, setCls] = useState<string>();
  const [goal, setGoal] = useState<CategoryId>();
  const pick = useMemo(() => {
    if (!cls || !goal) return null;
    if (["8", "9", "10"].includes(cls)) return ACE.courses.find((x) => x.cat === "foundation");
    if (goal === "boards") return ACE.courses.find((x) => x.cat === "boards");
    const list = ACE.courses.filter((x) => x.cat === goal);
    return (cls === "11" ? list[0] : list[1]) || list[0];
  }, [cls, goal]);

  return (
    <div className="finder">
      <div className="finder-side on-dark">
        <span className="hand">{kicker}</span>
        <h2 className="display">{title}</h2>
        <p>{text}</p>
      </div>
      <div className="finder-main">
        <div className="finder-step">
          <span className="q"><b>1</b>Which class are you in?</span>
          <div className="chip-group" role="radiogroup" aria-label="Class">
            {classes.map(([v, l]) => (
              <span key={v}><input type="radio" name="f-class" id={`fc${v}`} checked={cls === v} onChange={() => setCls(v)} /><label htmlFor={`fc${v}`}>{l}</label></span>
            ))}
          </div>
        </div>
        <div className="finder-step">
          <span className="q"><b>2</b>What&apos;s your goal?</span>
          <div className="chip-group" role="radiogroup" aria-label="Goal">
            {goals.map(([v, l]) => (
              <span key={v}><input type="radio" name="f-goal" id={`fg${v}`} checked={goal === v} onChange={() => setGoal(v)} /><label htmlFor={`fg${v}`}>{l}</label></span>
            ))}
          </div>
        </div>
        <div key={pick?.title} className={`finder-result${pick ? " ready" : ""}`} aria-live="polite">
          {pick ? (
            <>
              <div><small>Your best fit</small><h4>{pick.title}</h4><p>{pick.duration} · {pick.mode} · {pick.batch}</p></div>
              <button className="btn btn-gold btn-sm" type="button" onClick={() => enquire({ course: pick.title })}>Reserve a demo <Icon.arrow /></button>
            </>
          ) : (
            <p style={{ color: "var(--muted)" }}>👆 Pick your class and goal to see your recommended program.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- FAQ accordion ---------- */
export function Accordion({ limit }: { limit?: number }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="accordion">
      {ACE.faqs.slice(0, limit).map((f, i) => (
        <div key={f.q} className={`acc-item${open === i ? " open" : ""}`}>
          <button className="acc-q" type="button" aria-expanded={open === i} aria-controls={`faq-${i}`} id={`faq-q-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
            {f.q}<span className="pm" aria-hidden="true" />
          </button>
          <div className="acc-a" id={`faq-${i}`} role="region" aria-labelledby={`faq-q-${i}`}><div><p>{f.a}</p></div></div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Video story card ---------- */
export function StoryCard({ v }: { v: VideoStory }) {
  const { playVideo } = useUI();
  return (
    <button className="story-card" type="button" onClick={() => playVideo(v.video)} aria-label={`Play ${v.name}'s story`}>
      <span className="story-head">Student story</span>
      <span className="story-stat"><b>{v.headline}</b>{v.lines.map((l) => <span key={l}>{l}</span>)}</span>
      <span className="story-face" style={{ ["--c" as string]: colorFor(v.name) }}>{initials(v.name)}</span>
      <span className="play-btn"><Icon.play /></span>
      <span className="story-name">{v.name} <small>{v.batch}</small></span>
    </button>
  );
}
