import type { Metadata } from "next";
import { ACE } from "@/lib/data";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Icon, type IconName } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { CtaBand, PageHero } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Contact · Visit, Call or WhatsApp",
  description: "Get in touch with Ace Minds Private Tutorials — address, phone, WhatsApp and enquiry form.",
};

export default function ContactPage() {
  const S = ACE.site;
  const cards: [IconName, string, string, string?][] = [
    ["pin", "Visit us", S.address],
    ["phone", "Call", S.phone, `tel:${S.phoneRaw}`],
    ["whatsapp", "WhatsApp", "Chat with a counsellor", `https://wa.me/${S.whatsapp}`],
    ["mail", "Email", S.email, `mailto:${S.email}`],
    ["clock", "Office hours", S.hours],
  ];
  return (
    <>
      <PageHero crumb="Contact" title={<>Let&apos;s talk about <span className="gold">your goals</span></>} text="Visit the centre, call, WhatsApp or drop an enquiry — a counsellor will reach you within 24 hours." big="HI!" hand="we reply fast" />
      <section className="section section-cream">
        <div className="container contact-grid">
          <div>
            <Reveal stagger className="contact-cards">
              {cards.map(([ico, label, value, href]) => {
                const Ico = Icon[ico];
                const body = <><span className="ico"><Ico /></span><div><small>{label}</small><p>{value}</p></div></>;
                return href
                  ? <a key={label} className="contact-card" href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>{body}</a>
                  : <div key={label} className="contact-card">{body}</div>;
              })}
            </Reveal>
            <Reveal className="map-embed"><iframe title="Ace Minds location" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={S.mapEmbed} /></Reveal>
          </div>
          <Reveal className="form-card">
            <span className="eyebrow">Enquiry</span>
            <h2 style={{ fontSize: "1.8rem" }}>Send us a message</h2>
            <EnquiryForm id="c" full source="contact" cta="Send enquiry" />
          </Reveal>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
