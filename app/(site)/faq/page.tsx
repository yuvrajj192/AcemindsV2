import type { Metadata } from "next";
import { Accordion } from "@/components/Interactive";
import { EnquireButton } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { CtaBand, PageHero } from "@/components/Sections";
import { getFaqs } from "@/lib/queries";

export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: "FAQ · Frequently Asked Questions",
  description:
    "Answers to the questions parents ask Ace Minds most — batches, fees, demo classes, timings, faculty and results.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() },
    })),
  };
  return (
    <>
      <PageHero
        crumb="FAQ"
        title={<>Questions parents <span className="gold">ask us</span></>}
        text="Everything about batches, fees, demo classes and timings — answered by our academic team."
        big="?"
        hand="answered"
      />

      <section className="section">
        <div className="container faq-grid">
          <Reveal className="faq-aside">
            <span className="eyebrow">FAQs</span>
            <h2 className="display section-title">Still figuring things <span className="tag">out?</span></h2>
            <p style={{ color: "var(--ink-soft)" }}>
              These are the most common questions from parents evaluating coaching for Class 9–12 and dropper
              students. If yours isn’t here, a counsellor can walk you through it in five minutes.
            </p>
            <div className="help-card on-dark">
              <h4>Still have a question?</h4>
              <p>Talk to an academic counsellor — free, no obligation.</p>
              <EnquireButton className="btn btn-gold btn-sm">Request a call back</EnquireButton>
            </div>
          </Reveal>
          <Reveal><Accordion faqs={faqs} /></Reveal>
        </div>
      </section>

      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
