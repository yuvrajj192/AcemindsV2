import type { Metadata } from "next";
import Image from "next/image";
import { ACE } from "@/lib/data";
import { FacultyCard } from "@/components/Cards";
import { Reveal } from "@/components/Reveal";
import { CtaBand, PageHero, SectionHead } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Faculty · IIT, NIT & AIIMS Alumni Mentors",
  description: "Meet the Ace Minds faculty — IIT, NIT and AIIMS alumni led by Deepak Rana Sir (Physics, IIT Bombay).",
};

export default function FacultyPage() {
  return (
    <>
      <PageHero crumb="Faculty" title={<>Mentors who <span className="gold">cracked it first</span></>} text="Every core subject at Ace Minds is taught by alumni of India's top institutes — people who know the exam from the inside." big="IIT" hand="an alumni initiative" />
      <section className="section">
        <div className="container why-grid">
          <Reveal className="why-photo">
            <div className="frame"><Image src="/img/faculty/deepak-rana-2.webp" alt="Deepak Rana Sir" fill sizes="(max-width: 1024px) 90vw, 470px" /></div>
            <div className="name-plate"><strong>DEEPAK RANA SIR</strong><span>Founder · Physics · IIT Bombay</span></div>
            <span className="hand-note">&ldquo;Physics made simple.&rdquo;</span>
          </Reveal>
          <Reveal>
            <span className="eyebrow">Founder&apos;s desk</span>
            <h2 className="display section-title">Physics is not hard. <span className="tag">It&apos;s badly taught.</span></h2>
            <p className="lead-p">After IIT Bombay, Deepak Sir saw how many bright students dropped Physics because it was taught as a list of formulas. Ace Minds was started to fix that — every concept is derived, drawn and connected to the real world before a single formula is memorised.</p>
            <p className="lead-p">His YouTube lectures on topics like the equation of trajectory and power are used by students well beyond our classrooms.</p>
            <div className="feature-list">
              <div className="feature"><span className="ico">∫</span><div><h4>10+ years teaching JEE &amp; NEET</h4><p>Mechanics, electrodynamics and modern physics specialist.</p></div></div>
              <div className="feature"><span className="ico">▶</span><div><h4>Free concept videos weekly</h4><p>Short lectures on YouTube for every important chapter.</p></div></div>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section section-cream">
        <div className="container">
          <SectionHead eyebrow="The team" title={<>Our <span className="tag">faculty</span></>} />
          <Reveal stagger className="faculty-grid">{ACE.faculty.map((f) => <FacultyCard key={f.name} f={f} />)}</Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
