import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Icon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { CtaBand, PageHero, SectionHead } from "@/components/Sections";
import { EnquireButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Admissions 2026–28 · ACE-SAT Scholarship & Counselling",
  description: "Admission process, ACE-SAT scholarship test and free academic counselling at Ace Minds.",
};

export default function AdmissionsPage() {
  return (
    <>
      <PageHero crumb="Admissions" title={<>Admissions <span className="gold">2026–28</span> are open</>} text="Four simple steps from enquiry to your first class — with scholarships of up to 90% through ACE-SAT." big="26" hand="limited seats per batch" />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="How to join" title={<>Admission in <span className="tag">4 steps</span></>} />
          <Reveal stagger className="steps-grid">
            {[
              ["Enquire", "Fill the form or call us. A counsellor calls you back within 24 hours."],
              ["Demo + diagnostic", "Attend a free live class and a short diagnostic test."],
              ["Counselling", "One-on-one session with a mentor to pick the right batch."],
              ["Enrol", "Complete the paperwork, collect your study kit and start."],
            ].map(([t, d], i) => <div className="step-card" key={t}><div className="n">0{i + 1}</div><h4>{t}</h4><p>{d}</p></div>)}
          </Reveal>
        </div>
      </section>

      <section className="section section-navy on-dark" id="scholarship">
        <div className="container about-grid">
          <Reveal>
            <span className="eyebrow">ACE-SAT</span>
            <h2 className="display section-title">Scholarship test — <span className="gold">up to 90% off</span></h2>
            <p className="lead-p">ACE-SAT is a 90-minute aptitude and subject test held every Sunday during admission season. Your score decides your scholarship — no strings attached.</p>
            <ul className="tick-list"><li>Free to register</li><li>Offline at the centre or online</li><li>Results within 48 hours</li></ul>
            <EnquireButton className="btn btn-gold" style={{ marginTop: 24 }}>Register for ACE-SAT <Icon.arrow /></EnquireButton>
          </Reveal>
          <Reveal>
            <table className="scholar-table">
              <thead><tr><th>ACE-SAT score</th><th>Scholarship</th></tr></thead>
              <tbody>
                {[["90% and above", "90%"], ["80 – 89%", "60%"], ["70 – 79%", "40%"], ["60 – 69%", "25%"], ["Board 95%+ / Olympiad", "Extra 10%"]].map(([a, b]) => (
                  <tr key={a}><td>{a}</td><td><b>{b}</b></td></tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: "rgba(255,255,255,.5)", fontSize: ".82rem", marginTop: 10 }}>Sample slabs — final slabs are announced each season.</p>
          </Reveal>
        </div>
      </section>

      <section className="section section-cream" id="counselling">
        <div className="container contact-grid">
          <Reveal>
            <span className="eyebrow">Free counselling</span>
            <h2 className="display section-title">Confused between <span className="tag">JEE, NEET or CET?</span></h2>
            <p className="lead-p">Our mentors have helped thousands of families choose the right stream, exam and batch. Book a free 30-minute session — in person or on a call.</p>
            <div className="feature-list">
              {[
                ["Stream & exam selection", "Based on aptitude, interest and career goals."],
                ["Study plan", "A month-by-month plan for the student's current class."],
                ["Scholarship check", "See what fee waiver the student qualifies for."],
              ].map(([t, d], i) => <div className="feature" key={t}><span className="ico">{i + 1}</span><div><h4>{t}</h4><p>{d}</p></div></div>)}
            </div>
          </Reveal>
          <Reveal className="form-card">
            <h3 style={{ fontSize: "1.6rem" }}>Book a counselling session</h3>
            <EnquiryForm id="adm" source="counselling" cta="Book my session" />
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
