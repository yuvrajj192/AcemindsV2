import type { Metadata } from "next";
import Image from "next/image";
import { ACE } from "@/lib/data";
import { FacultyCard } from "@/components/Cards";
import { Icon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { CtaBand, PageHero, SectionHead } from "@/components/Sections";

export const metadata: Metadata = {
  title: "About · An IIT Alumni Initiative",
  description: "The story, mission and teaching method behind Ace Minds Private Tutorials, an IIT alumni initiative.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero crumb="About" title={<>An <span className="gold">IIT alumni</span> initiative</>} text="We started Ace Minds to give students the kind of teaching we wished we had — clear, patient and relentlessly concept-first." big="AM" hand={`since ${ACE.site.founded}`} />
      <section className="section">
        <div className="container about-grid">
          <Reveal>
            <span className="eyebrow">Our story</span>
            <h2 className="display section-title">Small classroom. <span className="tag">Big results.</span></h2>
            <p className="lead-p">Ace Minds Private Tutorials began as a single Physics batch run by Deepak Rana Sir after IIT Bombay. Word spread through results, not advertising. Today we run JEE, NEET, MHT-CET, Boards and Foundation programs — but every batch is still small enough for the teacher to know every student.</p>
            <p className="lead-p">Our promise is simple: <b>physics made simple</b>, and the same clarity for every subject we teach.</p>
          </Reveal>
          <Reveal>
            <Image src="/img/lectures/power-work-done.webp" alt="Deepak Rana Sir lecture thumbnail" width={1672} height={941} style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", height: "auto" }} sizes="(max-width: 1024px) 100vw, 50vw" />
          </Reveal>
        </div>
      </section>
      <section className="section section-cream">
        <div className="container">
          <SectionHead center eyebrow="What we stand for" title={<>Our <span className="tag">values</span></>} />
          <Reveal stagger className="values-grid">
            <div className="value"><div className="ico"><Icon.bulb /></div><h3>Clarity over coverage</h3><p>Understanding one concept deeply beats skimming ten.</p></div>
            <div className="value"><div className="ico"><Icon.heart /></div><h3>Every student matters</h3><p>Small batches so no one hides at the back of the class.</p></div>
            <div className="value"><div className="ico"><Icon.chart /></div><h3>Measured progress</h3><p>Weekly tests and honest reports — for students and parents.</p></div>
          </Reveal>
        </div>
      </section>
      <section className="section section-navy on-dark" id="method">
        <div className="container about-grid">
          <SectionHead eyebrow="Our journey" title={<>From one batch <span className="gold">to hundreds of ranks</span></>} />
          <Reveal as="ul" className="timeline">
            {[
              ["2016", "First Physics batch of 12 students."],
              ["2018", "Chemistry & Maths faculty from IIT and NIT join."],
              ["2020", "NEET and MHT-CET programs launched; free YouTube lectures begin."],
              ["2023", "Foundation program for Class 8–10."],
              ["2026", "New campus and ACE-SAT scholarship test."],
            ].map(([y, t]) => <li key={y}><b>{y}</b><p>{t}</p></li>)}
          </Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Faculty" title={<>The <span className="tag">team</span></>} />
          <Reveal stagger className="faculty-grid">{ACE.faculty.map((f) => <FacultyCard key={f.name} f={f} />)}</Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
