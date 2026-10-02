import Link from "next/link";
import { PageHero } from "@/components/Sections";

export default function NotFound() {
  return (
    <>
      <PageHero crumb="404" title={<>Lost in <span className="gold">trajectory</span></>} text="This page doesn't exist — but your seat in the next batch does." big="404" hand="eliminate t, find the page" />
      <section className="section" style={{ textAlign: "center" }}>
        <Link className="btn btn-gold" href="/">Back to home</Link>
      </section>
    </>
  );
}
