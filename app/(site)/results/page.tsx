import type { Metadata } from "next";
import { ResultsWall, StoryCard } from "@/components/Interactive";
import { Counter, Reveal } from "@/components/Reveal";
import { CtaBand, PageHero, SectionHead } from "@/components/Sections";
import { getCategories, getResultStats, getToppers, getVideoStories } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Results & Toppers — JEE, NEET, MHT-CET & Boards",
  description: "Ace Minds toppers in JEE Advanced, JEE Main, NEET, MHT-CET and Board exams, year by year.",
};

export default async function ResultsPage() {
  const [toppers, resultStats, categories, videoStories] = await Promise.all([
    getToppers(), getResultStats(), getCategories(), getVideoStories(),
  ]);
  return (
    <>
      <PageHero crumb="Results" title={<>Ranks that <span className="gold">speak for us</span></>} text="Year after year, Ace Minds students make the merit lists of India's toughest exams. Filter by exam and year." big="AIR" hand="hall of fame" />
      <section className="section section-navy on-dark" style={{ paddingTop: 60 }}>
        <div className="container">
          <Reveal stagger className="results-strip" style={{ margin: "0 0 60px" }}>
            {resultStats.map((s) => <div key={s.label}><Counter value={s.value} suffix={s.suffix} /><span>{s.label}</span></div>)}
          </Reveal>
          <ResultsWall toppers={toppers} categories={categories} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="In their words" title={<>Topper <span className="tag">stories</span></>} />
          <Reveal stagger className="story-grid">{videoStories.map((v) => <StoryCard key={v.name} v={v} />)}</Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
