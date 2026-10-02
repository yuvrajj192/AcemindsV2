import type { Metadata } from "next";
import { BlogExplorer } from "@/components/Interactive";
import { CtaBand, PageHero } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Blog & Exam News · JEE, NEET, CET Updates",
  description: "Exam dates, strategy, concept explainers and topper routines from the Ace Minds faculty.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero crumb="Blog" title={<>Exam news &amp; <span className="gold">smart strategy</span></>} text="Dates, patterns, concept explainers and topper routines — written by our faculty." big="NEWS" hand="updated every week" />
      <section className="section section-cream">
        <div className="container"><BlogExplorer /></div>
      </section>
      <CtaBand />
    </>
  );
}
