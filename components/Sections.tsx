import Link from "next/link";
import type { ReactNode } from "react";
import { ACE } from "@/lib/data";
import { Icon } from "./Icons";
import { Reveal } from "./Reveal";
import { EnquireButton } from "./ui";

export function PageHero({ crumb, title, text, big, hand, crumbs }: { crumb: string; title: ReactNode; text?: ReactNode; big?: string; hand?: string; crumbs?: { href: string; label: string }[] }) {
  return (
    <section className="page-hero on-dark">
      <div className="container">
        <div>
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {crumbs?.map((c) => <span key={c.href}><Link href={c.href}>{c.label}</Link></span>)}
            <span>{crumb}</span>
          </nav>
          <h1 className="display">{title}</h1>
          {text && <p>{text}</p>}
        </div>
        {big && (
          <div className="page-hero-art" aria-hidden="true"><div className="big">{big}</div>{hand && <span className="hand">{hand}</span>}</div>
        )}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, text, center, style }: { eyebrow: string; title: ReactNode; text?: ReactNode; center?: boolean; style?: React.CSSProperties }) {
  return (
    <Reveal className={`section-head${center ? " center" : ""}`} style={style}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="display section-title">{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  );
}

export function CtaBand({ hand = "Your seat is waiting", title, text }: { hand?: string; title?: ReactNode; text?: string }) {
  return (
    <section className="section" style={{ paddingTop: "clamp(50px,7vw,80px)" }}>
      <div className="container">
        <Reveal className="cta-band">
          <div>
            <span className="hand">{hand}</span>
            <h2 className="display">{title ?? <>Start with a <span style={{ color: "var(--gold-400)" }}>free demo class</span></>}</h2>
            <p>{text ?? "Meet the faculty, take a diagnostic test and get a personalised plan from an IIT alumnus."}</p>
          </div>
          <div className="cta-actions">
            <EnquireButton className="btn">Book a free demo <Icon.arrow /></EnquireButton>
            <a className="btn btn-ghost" href={`tel:${ACE.site.phoneRaw}`}>Call a counsellor</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ArrowLink({ href, children, className = "link-arrow" }: { href: string; children: ReactNode; className?: string }) {
  return <Link className={className} href={href}>{children} <Icon.arrow /></Link>;
}
