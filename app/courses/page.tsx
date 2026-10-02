import type { Metadata } from "next";
import { CourseExplorer, CourseFinder, Accordion } from "@/components/Interactive";
import { Reveal } from "@/components/Reveal";
import { CtaBand, PageHero, SectionHead } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Courses · IIT-JEE, NEET, MHT-CET, Boards & Foundation",
  description: "Compare Ace Minds programs for IIT-JEE, NEET, MHT-CET, Class 11–12 Boards and Foundation (Class 8–10). Small batches, weekly tests, IIT alumni faculty.",
};

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  return (
    <>
      <PageHero
        crumb="Courses"
        title={<>Programs that <span className="gold">produce ranks</span></>}
        text="Two-year, one-year, crash and foundation programs — all with small batches, weekly tests and one-on-one mentoring."
        big="08" hand="programs, one engine"
      />
      <section className="section section-cream">
        <div className="container">
          <CourseExplorer key={cat ?? "all"} initialCat={cat} head={<SectionHead eyebrow="Choose your track" title={<>All <span className="tag">programs</span></>} />} />
        </div>
      </section>
      <section className="section" id="finder">
        <div className="container">
          <Reveal>
            <CourseFinder kicker="Still confused?" title={<>Let us <span style={{ color: "var(--gold-400)" }}>pick for you</span></>} text="Answer two questions and get the program our toppers took at your stage." />
          </Reveal>
        </div>
      </section>
      <section className="section section-navy on-dark">
        <div className="container">
          <SectionHead center eyebrow="Included in every program" title={<>What you <span className="gold">get</span></>} />
          <Reveal stagger className="journey">
            {[
              ["✎", "Printed modules", "Theory, solved examples and graded exercises for every chapter."],
              ["✓", "Weekly tests", "Exam-pattern tests with rank, percentile and chapter analysis."],
              ["?", "Doubt desk", "Same-day doubt solving in person and on WhatsApp."],
              ["♥", "Parent connect", "Monthly PTMs and a progress report after every test."],
            ].map(([i, t, d]) => <div className="journey-step" key={t}><div className="dot">{i}</div><h4>{t}</h4><p>{d}</p></div>)}
          </Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container faq-grid">
          <div className="faq-aside"><span className="eyebrow">FAQs</span><h2 className="display section-title">Course <span className="tag">questions</span></h2></div>
          <Accordion />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
