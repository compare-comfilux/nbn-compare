import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/layout/Analytics";
import ChatWidget from "@/components/chat/ChatWidget";
import { buildMetadata, SITE_URL } from "@/lib/seo/metadata";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Compare NBN Plans Without the Sales Pitch",
    description:
      "Tell us how you use the internet and we'll help you find NBN plans that fit your household, budget and usage. Independent, transparent comparisons.",
  }),
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-AU"
      className={`h-full antialiased ${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body className="flex min-h-full flex-col bg-white text-slate-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <ChatWidget />
      </body>
    </html>
  );
}
