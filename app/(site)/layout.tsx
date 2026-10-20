import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Ticker } from "@/components/Ticker";
import { UIProvider } from "@/components/ui";
import { getLayoutData } from "@/lib/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { site, categories, notices, courses } = await getLayoutData();

  const sameAs = [site.youtube, site.instagram, site.facebook].filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Ace Minds",
    alternateName: "Ace Minds Private Tutorials",
    url: "https://aceminds.in",
    logo: "https://aceminds.in/img/favicon.svg",
    description:
      "An IIT alumni initiative offering small-batch coaching for IIT-JEE, NEET, MHT-CET, Board exams and Foundation students.",
    email: site.email,
    telephone: site.phone,
    foundingDate: String(site.founded || ""),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phoneRaw,
        contactType: "admissions",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };

  return (
    <UIProvider site={site} courses={courses}>
      <Header site={site} categories={categories} />
      <Ticker notices={notices} />
      <main id="main">{children}</main>
      <Footer site={site} categories={categories} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </UIProvider>
  );
}
