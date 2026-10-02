"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ACE } from "@/lib/data";
import { Icon, Logo } from "./Icons";
import { useUI } from "./ui";

const why = [
  { href: "/about", ico: "AM", bg: "#16315f", t: "About us", d: "Our story, mission & approach" },
  { href: "/faculty", ico: "IIT", bg: "#2e7bea", t: "Faculty", d: "Meet our IIT alumni mentors" },
  { href: "/testimonials", ico: "★", bg: "#e63946", t: "Testimonials", d: "Students & parents speak" },
  { href: "/about#method", ico: "∑", bg: "#e0a516", t: "The ACE method", d: "How we teach & test", dark: true },
];

const mobile = [
  ["/", "Home"], ["/courses", "Courses"], ["/results", "Results"], ["/faculty", "Faculty"], ["/admissions", "Admissions"],
  ["/testimonials", "Testimonials"], ["/about", "About"], ["/blog", "Blog"], ["/contact", "Contact"],
];

export function Header() {
  const S = ACE.site;
  const path = usePathname();
  const { enquire } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    document.body.classList.toggle("lock", open);
  }, [open]);

  const active = (href: string) => (path === href || path.startsWith(href + "/") ? { className: "active", "aria-current": "page" as const } : {});

  return (
    <>
      <div className="topbar">
        <div className="container">
          <div className="topbar-note">
            <span className="pulse-dot" />
            <span>Admissions open · 2026–28 batches</span>
            <span className="hide-sm">&nbsp;·&nbsp;<Link href="/admissions#scholarship"><u>ACE-SAT scholarship test</u></Link></span>
          </div>
          <div className="topbar-links">
            <a href={`tel:${S.phoneRaw}`}><Icon.phone />{S.phone}</a>
            <a href={`mailto:${S.email}`}><Icon.mail />{S.email}</a>
            <a href={S.youtube} target="_blank" rel="noopener"><Icon.youtube />YouTube</a>
          </div>
        </div>
      </div>

      <header className={`site-header${scrolled ? " scrolled" : ""}`}>
        <div className="container">
          <Link href="/" className="brand" aria-label="Ace Minds home">
            <Logo />
            <span className="brand-text"><span className="brand-name">ACE MINDS</span><span className="brand-sub">{S.initiative}</span></span>
          </Link>

          <nav className="main-nav" aria-label="Primary">
            <div className="nav-drop">
              <button type="button" aria-haspopup="true">Why Ace Minds <Icon.down /></button>
              <div className="drop-panel">
                {why.map((w) => (
                  <Link key={w.href} href={w.href}>
                    <span className="drop-ico" style={{ background: w.bg, color: w.dark ? "#0a1730" : undefined }}>{w.ico}</span>
                    <span><strong>{w.t}</strong><small>{w.d}</small></span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="nav-drop">
              <button type="button" aria-haspopup="true">Courses <Icon.down /></button>
              <div className="drop-panel">
                {ACE.categories.map((c) => (
                  <Link key={c.id} href={`/courses?cat=${c.id}`}>
                    <span className="drop-ico" style={{ background: c.color }}>{c.short}</span>
                    <span><strong>{c.label}</strong><small>{c.desc}</small></span>
                  </Link>
                ))}
                <Link href="/courses"><span className="drop-ico" style={{ background: "#0a1730" }}>ALL</span><span><strong>All programs</strong><small>Compare every course</small></span></Link>
              </div>
            </div>
            <Link href="/results" {...active("/results")}>Results</Link>
            <Link href="/admissions" {...active("/admissions")}>Admissions</Link>
            <Link href="/admissions#counselling">Counselling</Link>
            <Link href="/blog" {...active("/blog")}>Blog</Link>
            <Link href="/contact" {...active("/contact")}>Contact</Link>
          </nav>

          <div className="header-cta">
            <a className="call-chip" href={`tel:${S.phoneRaw}`}>
              <span className="ico"><Icon.phone /></span>
              <span><small>Talk to a counsellor</small><strong>{S.phone}</strong></span>
            </a>
            <button className="btn btn-gold btn-sm" type="button" onClick={() => enquire({ brochure: true })}><Icon.download /> Brochure</button>
            <button className="menu-toggle" type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><span /></button>
          </div>
        </div>
      </header>

      <nav className="mobile-nav" aria-label="Mobile" aria-hidden={!open}>
        <button className="mobile-close" type="button" aria-label="Close menu" onClick={() => setOpen(false)}><Icon.close /></button>
        {mobile.map(([href, label], i) => (
          <Link key={href} href={href} onClick={() => setOpen(false)}>{label} <small>{String(i + 1).padStart(2, "0")}</small></Link>
        ))}
        <button className="btn btn-gold" type="button" onClick={() => { setOpen(false); enquire(); }}>Book a free demo <Icon.arrow /></button>
        <a className="btn btn-ghost light" href={`tel:${S.phoneRaw}`}><Icon.phone /> {S.phone}</a>
      </nav>
    </>
  );
}
