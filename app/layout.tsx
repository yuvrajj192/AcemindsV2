import type { Metadata, Viewport } from "next";
import { Anton, Barlow_Condensed, Caveat, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Ticker } from "@/components/Ticker";
import { UIProvider } from "@/components/ui";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--ff-anton", display: "swap" });
const barlow = Barlow_Condensed({ weight: ["600", "700"], subsets: ["latin"], variable: "--ff-barlow", display: "swap" });
const caveat = Caveat({ weight: ["600", "700"], subsets: ["latin"], variable: "--ff-caveat", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--ff-jakarta", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://aceminds.in"),
  title: {
    default: "Ace Minds · IIT-JEE, NEET, MHT-CET & Boards Coaching | An IIT Alumni Initiative",
    template: "%s · Ace Minds",
  },
  description:
    "Ace Minds Private Tutorials — an IIT alumni initiative. Small batches, concept-first teaching and weekly tests for IIT-JEE, NEET, MHT-CET, Boards and Foundation (Class 8–10).",
  icons: { icon: "/img/favicon.svg" },
  openGraph: {
    title: "Ace Minds — Learn from IITians. Rank higher.",
    description: "Small batches, IIT alumni mentors and weekly tests for JEE, NEET, CET & Boards.",
    images: ["/img/lectures/equation-of-trajectory.webp"],
    siteName: "Ace Minds",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0a1730" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${barlow.variable} ${caveat.variable} ${jakarta.variable}`}>
      <body>
        <UIProvider>
          <Header />
          <Ticker />
          <main id="main">{children}</main>
          <Footer />
        </UIProvider>
      </body>
    </html>
  );
}
