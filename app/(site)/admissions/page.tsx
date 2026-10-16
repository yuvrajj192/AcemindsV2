import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Reveal } from "@/components/Reveal";
import { CtaBand, PageHero, SectionHead } from "@/components/Sections";
import { getCourses } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Admissions 2026–28 · Process & Free Counselling",
  description: "Admission process and free academic counselling at Ace Minds.",
};

export default async function AdmissionsPage() {
  const courses = await getCourses();
  return (
    <>
      <PageHero crumb="Admissions" title={<>Admissions <span className="gold">2026–28</span> are open</>} text="Four simple steps from enquiry to your first class — book a free demo and talk to a counsellor today." big="26" hand="limited seats per batch" />
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
                ["Fee & batch planning", "Understand the fee structure and pick the right batch."],
              ].map(([t, d], i) => <div className="feature" key={t}><span className="ico">{i + 1}</span><div><h4>{t}</h4><p>{d}</p></div></div>)}
            </div>
          </Reveal>
          <Reveal className="form-card">
            <h3 style={{ fontSize: "1.6rem" }}>Book a counselling session</h3>
            <EnquiryForm id="adm" source="counselling" cta="Book my session" courses={courses} />
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
