import Image from "next/image";
import Link from "next/link";
import { ACE } from "@/lib/data";
import { Icon } from "@/components/Icons";
import { Counter, Reveal } from "@/components/Reveal";
import { EnquireButton, VideoButton } from "@/components/ui";
import { FacultyCard, LetterCard, PostCard, PosterCard, ReviewCard, ReviewSummary } from "@/components/Cards";
import { Accordion, CourseExplorer, CourseFinder, HeroSlider, StoryCard, ToppersSlider, Trajectory } from "@/components/Interactive";
import { ArrowLink, SectionHead } from "@/components/Sections";

const lectureUrl = "https://www.youtube.com/embed/videoseries?list=PLACEHOLDER";

export default function Home() {
  const S = ACE.site;
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-ghost" aria-hidden="true">AM</div>
        <div className="container">
          <div className="hero-copy">
            <span className="hero-hand">Physics made simple.</span>
            <h1 className="display">
              <span className="line"><span>Learn from</span></span>
              <span className="line"><span><span className="boxed">IITians.</span></span></span>
              <span className="line"><span>Rank <span className="gold">higher.</span></span></span>
            </h1>
            <p className="hero-lead">
              Ace Minds is an IIT alumni initiative — small batches, concept-first teaching and weekly tests that turn hard chapters into your scoring chapters.
            </p>
            <div className="hero-actions">
              <EnquireButton className="btn btn-gold">Book a free demo class <Icon.arrow /></EnquireButton>
              <Link className="btn btn-ghost" href="/courses">Explore courses</Link>
            </div>
            <div className="pillars">
              {ACE.pillars.map((p) => {
                const Ico = Icon[p.icon];
                return (
                  <div className="pillar" key={p.title}>
                    <span className="ico"><Ico /></span>
                    <div><strong>{p.title}</strong><small>{p.text}</small></div>
                  </div>
                );
              })}
            </div>
            <div className="hero-proof">
              <div className="avatars" aria-hidden="true">
                <span style={{ background: "#2e7bea" }}>AS</span><span style={{ background: "#e63946" }}>IP</span>
                <span style={{ background: "#f28c28" }}>RD</span><span style={{ background: "#16315f" }}>+</span>
              </div>
              <p>
                <strong>2,500+ students</strong> mentored since {S.founded}
                <br />
                <span className="exam-pill hero-exams">JEE <i>|</i> NEET <i>|</i> CET <i>|</i> BOARDS</span>
              </p>
            </div>
          </div>

          <div className="hero-visual">
            <Trajectory />
            <HeroSlider />
            <div className="float-chip c1">
              <span className="ico" style={{ background: "#fff4d1", color: "#e0a516" }}><Icon.trophy /></span>
              <span><strong>120+</strong><small>IIT &amp; NIT selections</small></span>
            </div>
            <div className="float-chip c2">
              <span className="ico" style={{ background: "#e8f1fe", color: "#2e7bea" }}><Icon.star /></span>
              <span><strong>{ACE.reviewSummary.rating} / 5</strong><small>{ACE.reviewSummary.count}+ Google reviews</small></span>
            </div>
            <span className="formula-chip f1" aria-hidden="true">P = W / t</span>
            <span className="formula-chip f2" aria-hidden="true">y = x tanθ − gx²/2u²cos²θ</span>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <div className="stats-band">
        <div className="container">
          <Reveal className="stats-grid">
            {[
              { ico: <Icon.cap />, v: 10, s: "+", l: "Years of IIT-grade teaching" },
              { ico: <Icon.users />, v: 2500, s: "+", l: "Students mentored" },
              { ico: <Icon.trophy />, v: 340, s: "+", l: "Students above 95 percentile" },
              { ico: <Icon.target />, v: 30, s: "", l: "Max students per batch" },
            ].map((x) => (
              <div className="stat" key={x.l}>
                <span className="stat-ico">{x.ico}</span>
                <div><Counter value={x.v} suffix={x.s} /><span>{x.l}</span></div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      {/* ================= COURSE FINDER ================= */}
      <section className="section" id="finder">
        <div className="container">
          <Reveal>
            <CourseFinder
              kicker="Not sure where to start?"
              title={<>Find your <span style={{ color: "var(--gold-400)" }}>perfect batch</span> in 2 clicks</>}
              text="Tell us your class and your goal. We'll match you with the program our toppers took."
            />
          </Reveal>
        </div>
      </section>

      {/* ================= COURSES ================= */}
      <section className="section section-cream" id="courses">
        <div className="container">
          <CourseExplorer
            limit={6}
            head={
              <SectionHead
                eyebrow="Programs"
                title={<>Courses built for <span className="tag">results</span></>}
                text="Every program runs on the same engine: concept classes, daily practice, weekly tests and one-on-one mentoring."
              />
            }
          />
          <div style={{ textAlign: "center", marginTop: 40 }}><ArrowLink className="btn" href="/courses">View all programs</ArrowLink></div>
        </div>
      </section>

      {/* ================= RESULTS ================= */}
      <section className="section section-navy on-dark" id="results">
        <div className="container">
          <ToppersSlider
            head={
              <SectionHead
                eyebrow="Hall of fame"
                title={<>Our toppers <span className="gold">speak in ranks</span></>}
                text="Every season, Ace Minds students turn up on the merit lists of JEE, NEET, CET and the Boards."
              />
            }
          />
          <Reveal stagger className="results-strip">
            {ACE.resultStats.map((s) => <div key={s.label}><Counter value={s.value} suffix={s.suffix} /><span>{s.label}</span></div>)}
          </Reveal>
          <div style={{ textAlign: "center", marginTop: 36 }}><ArrowLink className="btn btn-gold" href="/results">See all results</ArrowLink></div>
        </div>
      </section>

      {/* ================= WHY ACE MINDS ================= */}
      <section className="section" id="why">
        <div className="container why-grid">
          <Reveal className="why-photo">
            <div className="frame">
              <Image src="/img/faculty/deepak-rana.webp" alt="Deepak Rana Sir, Physics Mentor, IIT Bombay alumnus" fill sizes="(max-width: 1024px) 90vw, 470px" />
            </div>
            <div className="name-plate"><strong>DEEPAK RANA SIR</strong><span>Physics Mentor · IIT Bombay</span></div>
            <div className="stamp">
              <svg viewBox="0 0 130 130" aria-hidden="true">
                <defs><path id="circ" d="M65,65 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" /></defs>
                <text><textPath href="#circ">AN IIT ALUMNI INITIATIVE · AN IIT ALUMNI INITIATIVE · </textPath></text>
              </svg>
              <div><b>IIT</b><small>ALUMNI</small></div>
            </div>
            <span className="hand-note">&ldquo;Derive it, don&apos;t mug it.&rdquo;</span>
          </Reveal>
          <div>
            <SectionHead
              eyebrow="Why Ace Minds"
              style={{ marginBottom: 0 }}
              title={
                <>Taught by people who{" "}
                  <span className="scribble">cracked it<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M2 14 C 50 4, 120 4, 198 12" /></svg></span>
                </>
              }
              text="We're not a factory. Ace Minds was started by IIT alumni who believe every student can master Physics, Chemistry and Maths when concepts come before formulas."
            />
            <Reveal stagger className="feature-list">
              {[
                { i: <Icon.bulb />, t: "Concept based", d: "Every formula is derived on the board — understand once, apply anywhere." },
                { i: <Icon.clipboard />, t: "Step-by-step solutions", d: "Daily practice problems with fully worked solutions and video explanations." },
                { i: <Icon.target />, t: "Exam focused", d: "Weekly tests in the exact JEE / NEET / CET pattern, with rank and error analysis." },
                { i: <Icon.users />, t: "Small batches, real mentors", d: "Max 30 students. Your mentor knows your name, your weak chapters and your goals." },
              ].map((f) => (
                <div className="feature" key={f.t}><span className="ico">{f.i}</span><div><h4>{f.t}</h4><p>{f.d}</p></div></div>
              ))}
            </Reveal>
            <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link className="btn" href="/about">Our story</Link>
              <Link className="btn btn-ghost" href="/faculty">Meet the faculty</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= POSTERS ================= */}
      <section className="section section-cream" style={{ paddingBlock: "clamp(60px,8vw,90px)" }}>
        <div className="container">
          <SectionHead eyebrow="Happening now" title={<>Don&apos;t miss <span className="tag">these</span></>} />
          <Reveal stagger className="poster-grid">{ACE.posters.map((p) => <PosterCard key={p.title} p={p} />)}</Reveal>
        </div>
      </section>

      {/* ================= FREE LECTURES + METHOD ================= */}
      <section className="section section-navy on-dark" id="lectures">
        <div className="container">
          <div className="section-head-row">
            <SectionHead
              eyebrow="Free on YouTube"
              title={<>Watch a class <span className="gold">before you join</span></>}
              text="Short, sharp concept videos by Deepak Sir — the same style you get in every Ace Minds classroom."
            />
            <a className="btn btn-ghost" href={S.youtube} target="_blank" rel="noopener">Visit channel</a>
          </div>
          <Reveal className="lecture-grid">
            <VideoButton className="lecture" url={lectureUrl} style={{ textAlign: "left", color: "inherit" }}>
              <Image src="/img/lectures/equation-of-trajectory.webp" alt="Equation of Trajectory lecture by Deepak Rana Sir" width={1672} height={941} sizes="(max-width: 1024px) 100vw, 60vw" />
              <span className="overlay"><span className="play-btn"><Icon.play /></span></span>
              <span className="lecture-info"><span><h4>Equation of Trajectory</h4><small>Projectile motion · JEE / NEET</small></span><span className="badge gold">Physics</span></span>
            </VideoButton>
            <div className="lecture-side">
              <VideoButton className="lecture" url={lectureUrl} style={{ textAlign: "left", color: "inherit" }}>
                <Image src="/img/lectures/power-work-done.webp" alt="Power — work done per unit time lecture" width={1672} height={941} sizes="(max-width: 1024px) 100vw, 40vw" />
                <span className="overlay"><span className="play-btn" style={{ width: 58, height: 58 }}><Icon.play /></span></span>
                <span className="lecture-info"><span><h4>Power: Work per unit time</h4><small>Work, energy &amp; power</small></span></span>
              </VideoButton>
              <div className="yt-card">
                <span className="hand">New videos every week</span>
                <h3>Concepts in 10 minutes. Doubts in zero.</h3>
                <a className="btn btn-sm" href={S.youtube} target="_blank" rel="noopener" style={{ alignSelf: "flex-start" }}>Subscribe</a>
              </div>
            </div>
          </Reveal>

          <SectionHead center eyebrow="The ACE method" title={<>Four steps. <span className="gold">Every chapter.</span></>} style={{ marginTop: 100 }} />
          <Reveal stagger className="journey">
            {[
              ["Learn", "Concept class — derive, visualise, connect it to real life."],
              ["Practise", "Daily practice problems, from NCERT level to Advanced."],
              ["Test", "Weekly exam-pattern test with rank and time analysis."],
              ["Fix", "One-on-one review of your error log with your mentor."],
            ].map(([t, d], i) => (
              <div className="journey-step" key={t}><div className="dot">0{i + 1}</div><h4>{t}</h4><p>{d}</p></div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="section" id="testimonials">
        <div className="container">
          <div className="section-head-row">
            <SectionHead eyebrow="Student stories" title={<>Hear it from <span className="tag">our achievers</span></>} />
            <ReviewSummary />
          </div>
          <Reveal stagger className="story-grid">{ACE.videoStories.map((v) => <StoryCard key={v.name} v={v} />)}</Reveal>

          <div className="section-head center" style={{ margin: "90px auto 40px" }}>
            <span className="hand letters-title">Notes they left for Sir…</span>
          </div>
          <Reveal stagger className="letter-grid">{ACE.letters.map((l, i) => <LetterCard key={l.name} l={l} i={i} />)}</Reveal>

          <Reveal stagger className="review-grid" style={{ marginTop: 70 }}>{ACE.reviews.slice(0, 4).map((r) => <ReviewCard key={r.name} r={r} />)}</Reveal>
          <div style={{ textAlign: "center", marginTop: 36 }}><Link className="btn btn-ghost" href="/testimonials">Read all testimonials</Link></div>
        </div>
      </section>

      {/* ================= FACULTY ================= */}
      <section className="section section-cream" id="faculty">
        <div className="container">
          <div className="section-head-row">
            <SectionHead eyebrow="Faculty" title={<>Mentors from <span className="tag">IIT · NIT · AIIMS</span></>} />
            <ArrowLink href="/faculty">All faculty</ArrowLink>
          </div>
          <Reveal stagger className="faculty-grid">{ACE.faculty.map((f) => <FacultyCard key={f.name} f={f} />)}</Reveal>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="section" id="faq">
        <div className="container faq-grid">
          <Reveal className="faq-aside">
            <span className="eyebrow">FAQs</span>
            <h2 className="display section-title">Questions parents <span className="tag">ask us</span></h2>
            <p style={{ color: "var(--ink-soft)" }}>Everything about batches, fees, scholarships and demo classes.</p>
            <div className="help-card on-dark">
              <h4>Still have a question?</h4>
              <p>Talk to an academic counsellor — free, no obligation.</p>
              <EnquireButton className="btn btn-gold btn-sm">Request a call back</EnquireButton>
            </div>
          </Reveal>
          <Reveal><Accordion /></Reveal>
        </div>
      </section>

      {/* ================= BLOG ================= */}
      <section className="section section-cream" id="blog">
        <div className="container">
          <div className="section-head-row">
            <SectionHead eyebrow="Blog & exam news" title={<>Stay ahead of <span className="tag">every update</span></>} />
            <ArrowLink href="/blog">All articles</ArrowLink>
          </div>
          <Reveal stagger className="blog-grid">{ACE.posts.slice(0, 3).map((p) => <PostCard key={p.slug} p={p} />)}</Reveal>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="section" style={{ paddingTop: "clamp(60px,8vw,90px)" }}>
        <div className="container">
          <Reveal className="cta-band">
            <div>
              <span className="hand">Your seat is waiting</span>
              <h2 className="display">Admissions open for <span className="nowrap" style={{ color: "var(--gold-400)" }}>2026–28</span></h2>
              <p>Take the ACE-SAT scholarship test, attend a free demo and get a personalised study plan from an IIT alumnus.</p>
            </div>
            <div className="cta-actions">
              <EnquireButton className="btn">Book a free demo</EnquireButton>
              <Link className="btn btn-ghost" href="/admissions#scholarship">Register for ACE-SAT</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
