import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/Cards";
import { Icon } from "@/components/Icons";
import { PageHero, SectionHead } from "@/components/Sections";
import { EnquireButton } from "@/components/ui";
import { getPostBySlug, getPublishedPosts } from "@/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPostBySlug(slug);
  if (!p) return {};
  const url = `/blog/${slug}`;
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: "Ace Minds",
      locale: "en_IN",
      title: p.title,
      description: p.excerpt,
      images: [{ url: p.img ?? "/img/lectures/equation-of-trajectory.webp" }],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const p = await getPostBySlug(slug);
  if (!p) notFound();
  const all = await getPublishedPosts();
  return (
    <>
      <PageHero crumb={p.cat} crumbs={[{ href: "/blog", label: "Blog" }]} title={<span style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)" }}>{p.title}</span>} text={`${p.cat} · ${p.date} · ${p.read} read`} />
      <section className="section">
        <div className="container">
          <article className="article">
            {p.img && <Image src={p.img} alt="" width={1672} height={941} style={{ borderRadius: "var(--radius-lg)", marginBottom: 28, boxShadow: "var(--shadow)", height: "auto" }} sizes="760px" priority />}
            <p style={{ fontSize: "1.25rem", color: "var(--ink)" }}>{p.excerpt}</p>
            {p.html ? (
              /* sanitized in savePost() before it ever reaches the DB */
              <div className="article__body" dangerouslySetInnerHTML={{ __html: p.html }} />
            ) : p.paragraphs?.length ? (
              p.paragraphs.map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <>
                <div className="callout"><strong>Editor&apos;s note:</strong> this article body is placeholder copy. Once the admin panel is live, posts are written and published from the Blog module.</div>
                <h2>Why this matters</h2>
                <p>Every season the exam calendar shifts a little, and students who plan around the real dates — not last year&apos;s — gain weeks of revision time. Here is what our faculty recommend.</p>
                <ul>
                  <li>Finish the high-weightage chapters first and revisit them every 21 days.</li>
                  <li>Take one full-length mock every week and spend twice as long analysing it.</li>
                  <li>Maintain an error log — every mistake, why it happened, and the fix.</li>
                </ul>
                <h2>How Ace Minds students prepare</h2>
                <p>Our weekly test cycle mirrors the real exam pattern, with All-India style ranking and a one-on-one review with your mentor after every paper.</p>
              </>
            )}
            <p><EnquireButton className="btn btn-gold">Talk to a mentor <Icon.arrow /></EnquireButton></p>
          </article>
        </div>
      </section>
      <section className="section section-cream">
        <div className="container">
          <SectionHead eyebrow="Keep reading" title={<>Related <span className="tag">articles</span></>} />
          <div className="blog-grid">{all.filter((x) => x.slug !== p.slug).slice(0, 3).map((x) => <PostCard key={x.slug} p={x} />)}</div>
        </div>
      </section>
    </>
  );
}
