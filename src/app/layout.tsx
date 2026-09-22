import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Source_Serif_4 } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Book Maps — The Shadow of the Wind",
  description:
    "A spoiler-free interactive map of Barcelona for readers of Carlos Ruiz Zafón’s The Shadow of the Wind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${cinzel.variable} ${cormorant.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#120e0b] font-sans text-[#f0e6d4]">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
