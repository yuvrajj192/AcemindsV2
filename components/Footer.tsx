import Link from "next/link";
import { ACE } from "@/lib/data";
import { Icon, Logo } from "./Icons";
import { Newsletter } from "./Newsletter";

export function Footer() {
  const S = ACE.site;
  return (
    <footer className="site-footer on-dark">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Link href="/" className="brand"><Logo /><span className="brand-text"><span className="brand-name">ACE MINDS</span><span className="brand-sub">{S.tagline} · {S.initiative}</span></span></Link>
            <p>
              Small batches, IIT alumni mentors and concept-first teaching for JEE, NEET, MHT-CET, Boards and Foundation.{" "}
              <span className="hand" style={{ color: "var(--gold-400)", fontSize: "1.3rem" }}>Physics made simple.</span>
            </p>
            <div className="socials">
              <a href={S.youtube} target="_blank" rel="noopener" aria-label="YouTube"><Icon.youtube /></a>
              <a href={S.instagram} target="_blank" rel="noopener" aria-label="Instagram"><Icon.instagram /></a>
              <a href={S.facebook} target="_blank" rel="noopener" aria-label="Facebook"><Icon.facebook /></a>
              <a href={`https://wa.me/${S.whatsapp}`} target="_blank" rel="noopener" aria-label="WhatsApp"><Icon.whatsapp /></a>
            </div>
          </div>
          <div>
            <h5>Programs</h5>
            <div className="footer-links">{ACE.categories.map((c) => <Link key={c.id} href={`/courses?cat=${c.id}`}>{c.label}</Link>)}</div>
          </div>
          <div>
            <h5>Explore</h5>
            <div className="footer-links">
              <Link href="/about">About us</Link><Link href="/faculty">Faculty</Link><Link href="/results">Results</Link>
              <Link href="/testimonials">Testimonials</Link><Link href="/admissions">Admissions</Link><Link href="/blog">Blog &amp; news</Link>
            </div>
          </div>
          <div>
            <h5>Visit us</h5>
            <ul className="footer-contact">
              <li><Icon.pin /><span>{S.address}</span></li>
              <li><Icon.phone /><a href={`tel:${S.phoneRaw}`}>{S.phone}</a></li>
              <li><Icon.mail /><a href={`mailto:${S.email}`}>{S.email}</a></li>
              <li><Icon.clock /><span>{S.hours}</span></li>
            </ul>
            <Newsletter />
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ace Minds Private Tutorials · {S.domain}</span>
          <span><Link href="/contact">Careers</Link> &nbsp;·&nbsp; <Link href="/admissions#scholarship">Scholarships</Link> &nbsp;·&nbsp; <Link href="/blog">Exam news</Link></span>
        </div>
      </div>
      <div className="footer-ghost" aria-hidden="true">ACE MINDS</div>
    </footer>
  );
}
