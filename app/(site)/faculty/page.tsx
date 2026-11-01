import type { Metadata } from "next";
import { FacultyCard } from "@/components/Cards";
import { Reveal } from "@/components/Reveal";
import { CtaBand, PageHero, SectionHead } from "@/components/Sections";
import { getFaculty } from "@/lib/queries";

export const metadata: Metadata = {
  alternates: { canonical: "/faculty" },
  title: "Faculty · IIT, NIT & AIIMS Alumni Mentors",
  description: "Meet the Ace Minds faculty — IIT, NIT and AIIMS alumni led by Deepak Rana Sir (Physics, IIT Bombay).",
};

export default async function FacultyPage() {
  const faculty = await getFaculty();
  return (
    <>
      <PageHero crumb="Faculty" title={<>Mentors who <span className="gold">cracked it first</span></>} text="Every core subject at Ace Minds is taught by alumni of India's top institutes — people who know the exam from the inside." big="IIT" hand="an alumni initiative" />
      <section className="section">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Founder&apos;s desk</span>
            <h2 className="display section-title">Physics is not hard. <span className="tag">It&apos;s badly taught.</span></h2>
            <p className="lead-p">Ace Minds began at this desk — IIT alumni who saw bright students drop Physics because it was taught as a list of formulas. Every concept is derived, drawn and connected to the real world before a single formula is memorised.</p>
            <p className="lead-p">Concept lectures from the desk — on topics like the equation of trajectory and power — live on YouTube for free and are used by students well beyond our classrooms.</p>
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
          <Reveal stagger className="faculty-grid">{faculty.map((f) => <FacultyCard key={f.name} f={f} />)}</Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
