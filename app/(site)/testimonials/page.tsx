import type { Metadata } from "next";
import { LetterCard, ReviewCard, ReviewSummary } from "@/components/Cards";
import { StoryCard } from "@/components/Interactive";
import { Reveal } from "@/components/Reveal";
import { CtaBand, PageHero, SectionHead } from "@/components/Sections";
import { getLetters, getReviewSummary, getReviews, getVideoStories } from "@/lib/queries";

export const metadata: Metadata = {
  alternates: { canonical: "/testimonials" },
  title: "Testimonials · Students & Parents",
  description: "What Ace Minds students and parents say — video stories, handwritten notes and Google reviews.",
};

export default async function TestimonialsPage() {
  const [videoStories, letters, reviews, reviewSummary] = await Promise.all([
    getVideoStories(), getLetters(), getReviews(), getReviewSummary(),
  ]);
  return (
    <>
      <PageHero crumb="Testimonials" title={<>Stories from <span className="gold">our achievers</span></>} text="Video stories, handwritten notes and honest reviews from students and parents." big={String(reviewSummary.rating)} hand="on Google" />
      <section className="section">
        <div className="container">
          <div className="section-head-row">
            <SectionHead eyebrow="Watch" title={<>Video <span className="tag">stories</span></>} />
            <ReviewSummary s={reviewSummary} />
          </div>
          <Reveal stagger className="story-grid">{videoStories.map((v) => <StoryCard key={v.name} v={v} />)}</Reveal>
        </div>
      </section>
      <section className="section section-cream">
        <div className="container">
          <div className="section-head center"><span className="hand letters-title">Notes they left for Sir…</span></div>
          <Reveal stagger className="letter-grid">{letters.map((l, i) => <LetterCard key={l.name} l={l} i={i} />)}</Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Google reviews" title={<>What parents <span className="tag">&amp; students say</span></>} />
          <Reveal stagger className="review-grid">{reviews.map((r) => <ReviewCard key={r.name} r={r} />)}</Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
