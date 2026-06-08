import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// layout.js — updated description and keywords only
export const metadata = {
  title: "SignalForge",
  description: "SignalForge is an AI-powered B2B outreach engine that takes a single seed domain, discovers lookalike companies, surfaces decision-makers, resolves verified work emails, and fires personalized outreach — zero manual steps.",
  keywords: [
    "AI Outreach",
    "B2B lead generation",
    "sales automation",
    "cold email automation",
    "lookalike company discovery",
    "decision maker finder",
    "email enrichment",
    "outreach pipeline",
    "SignalForge",
    "Next.js",
  ],
  authors: [{ name: "Mohd Abdul Sabeeh" }],
  creator: "Mohd Abdul Sabeeh",
  publisher: "SignalForge",
  applicationName: "SignalForge",
  category: "Business Automation",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
