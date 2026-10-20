import type { Metadata, Viewport } from "next";
import { Anton, Barlow_Condensed, Caveat, Plus_Jakarta_Sans } from "next/font/google";
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
  keywords: [
    "IIT-JEE coaching",
    "NEET coaching",
    "MHT-CET coaching",
    "CBSE boards tuition",
    "foundation classes class 8 9 10",
    "small batch coaching",
    "IIT alumni faculty",
    "Ace Minds",
  ],
  icons: { icon: "/img/favicon.svg" },
  openGraph: {
    locale: "en_IN",
    alternateLocale: "en_US",
    title: "Ace Minds — Learn from IITians. Rank higher.",
    description: "Small batches, IIT alumni mentors and weekly tests for JEE, NEET, CET & Boards.",
    images: ["/img/lectures/equation-of-trajectory.webp"],
    siteName: "Ace Minds",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ace Minds — Learn from IITians. Rank higher.",
    description: "Small batches, IIT alumni mentors and weekly tests for JEE, NEET, CET & Boards.",
    images: ["/img/lectures/equation-of-trajectory.webp"],
  },
};

export const viewport: Viewport = { themeColor: "#0a1730" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${barlow.variable} ${caveat.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
