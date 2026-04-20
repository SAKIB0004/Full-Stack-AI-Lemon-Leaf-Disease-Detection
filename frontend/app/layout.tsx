import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "LeafScan — Lemon Leaf Disease Classification",
  description:
    "AI-powered lemon leaf disease detection using a deep learning weighted ensemble model.",
  keywords: ["lemon", "leaf disease", "AI", "deep learning", "plant pathology"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="font-body antialiased bg-stone-50 text-stone-800 min-h-screen">
        {children}
      </body>
    </html>
  );
}
