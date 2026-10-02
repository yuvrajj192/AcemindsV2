import Link from "next/link";
import Image from "next/image";
import { ACE, catOf, colorFor, initials, type Course, type Faculty, type Letter, type Post, type Poster, type Review, type Topper } from "@/lib/data";
import { Icon, Stars } from "./Icons";
import { EnquireButton } from "./ui";

export function CourseCard({ c, i }: { c: Course; i: number }) {
  const cat = catOf(c.cat);
  return (
    <article className="course-card" style={{ ["--accent" as string]: cat?.color }}>
      <span className="num">{String(i + 1).padStart(2, "0")}</span>
      <div className="course-top">
        <span className="badge blue">{cat?.label}</span>
        {c.badge && <span className={`badge ${c.hot ? "hot" : "gold"}`}>{c.badge}</span>}
      </div>
      <h3>{c.title}</h3>
      <p className="for">{c.for}</p>
      <div className="course-meta">
        <div><small>Duration</small><b>{c.duration}</b></div>
        <div><small>Mode</small><b>{c.mode}</b></div>
        <div><small>Starts</small><b>{c.start}</b></div>
        <div><small>Batch</small><b>{c.batch}</b></div>
      </div>
      <ul className="course-feats">{c.features.map((f) => <li key={f}>{f}</li>)}</ul>
      <div className="course-foot">
        <span className="seats"><span className="pulse-dot" />Only {c.seats} seats left</span>
        <EnquireButton className="btn btn-sm" course={c.title}>Enquire <Icon.arrow /></EnquireButton>
      </div>
    </article>
  );
}

export function TopperCard({ t }: { t: Topper }) {
  return (
    <article className="topper">
      <div className="topper-photo">
        <span className="ring" />
        <span className="face">{t.img ? <Image src={t.img} alt={t.name} width={116} height={116} /> : initials(t.name)}</span>
        <span className="rank-badge">{t.year}</span>
      </div>
      <h4>{t.name}</h4>
      <div className="exam">{t.exam}</div>
      <div className="topper-rank">{t.rank}</div>
      <div className="score"><span>{t.score}</span></div>
      <div className="college">{t.college}</div>
    </article>
  );
}

export function FacultyCard({ f }: { f: Faculty }) {
  return (
    <article className="fac-card">
      <div className="fac-photo">
        {f.img ? <Image src={f.img} alt={f.name} fill sizes="(max-width: 760px) 50vw, 25vw" /> : <span className="initials">{f.subject.slice(0, 2).toUpperCase()}</span>}
        <span className="badge gold subj">{f.subject}</span>
      </div>
      <div className="fac-body">
        <h4>{f.name}{f.img ? " Sir" : ""}</h4>
        <div className="role">{f.role}</div>
        <p><b>{f.edu}</b> · {f.exp} teaching. {f.bio}</p>
        <div className="fac-tags">{f.tags.map((t) => <span key={t}>{t}</span>)}</div>
      </div>
    </article>
  );
}

export function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="review-card">
      <header>
        <span className="av" style={{ background: colorFor(r.name) }}>{r.name[0]}</span>
        <div><strong>{r.name}</strong><small>{r.role}</small></div>
        <span className="g"><Icon.google /></span>
      </header>
      <div className="review-stars"><Stars /><small>{r.when}</small></div>
      <p>{r.text}</p>
    </article>
  );
}

export function ReviewSummary() {
  const s = ACE.reviewSummary;
  return (
    <div className="review-summary">
      <span className="g"><Icon.google /></span>
      <div><b>{s.rating}</b><Stars /></div>
      <small>{s.count}+ Google reviews</small>
    </div>
  );
}

export function LetterCard({ l, i }: { l: Letter; i: number }) {
  return (
    <article className="letter" style={{ ["--tilt" as string]: `${[-1.6, 1.2, -0.8][i % 3]}deg` }}>
      <span className="pin-tape" />
      <p>{l.text}</p>
      <footer><strong>— {l.name}</strong><span>{l.tag}</span></footer>
    </article>
  );
}

export function PosterCard({ p }: { p: Poster }) {
  const inner = (
    <>
      <div><span className="date">{p.date}</span><div className="big" style={{ marginTop: 10 }}>{p.title}</div></div>
      <div><p style={{ marginBottom: 14, opacity: 0.85 }}>{p.text}</p><span className="link-arrow" style={{ color: "inherit" }}>{p.cta} <Icon.arrow /></span></div>
      <span className="deco" aria-hidden="true">{p.deco}</span>
    </>
  );
  if (p.href === "#enquire") return <EnquireButton className={`poster ${p.theme}`} style={{ textAlign: "left" }}>{inner}</EnquireButton>;
  return <Link className={`poster ${p.theme}`} href={p.href}>{inner}</Link>;
}

export function PostCard({ p }: { p: Post }) {
  return (
    <article className="post-card">
      <Link className="post-cover" href={`/blog/${p.slug}`} style={{ background: p.color }} tabIndex={-1} aria-hidden="true">
        {p.img ? <Image src={p.img} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" /> : <span className="gen">{p.title.split(":")[0].split(" ").slice(0, 4).join(" ")}</span>}
        <span className="badge gold">{p.cat}</span>
      </Link>
      <div className="post-body">
        <div className="post-meta"><span>{p.date}</span><span>· {p.read} read</span></div>
        <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
        <p>{p.excerpt}</p>
        <Link className="link-arrow" href={`/blog/${p.slug}`}>Read more <Icon.arrow /></Link>
      </div>
    </article>
  );
}
