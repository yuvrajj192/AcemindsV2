import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Ticker } from "@/components/Ticker";
import { UIProvider } from "@/components/ui";
import { getLayoutData } from "@/lib/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { site, categories, notices, courses } = await getLayoutData();
  return (
    <UIProvider site={site} courses={courses}>
      <Header site={site} categories={categories} />
      <Ticker notices={notices} />
      <main id="main">{children}</main>
      <Footer site={site} categories={categories} />
    </UIProvider>
  );
}
