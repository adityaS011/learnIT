import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getParts } from "@/lib/content";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  title: "LearnIT — Frontend Interview Prep",
  description:
    "Interactive frontend engineering course & interview prep: React, TypeScript, performance, Next.js, security, design systems, and quizzes.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6d28d9",
};

// Runs before paint to avoid a theme flash.
const themeInit = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const parts = getParts().map((p) => ({
    slug: p.slug,
    order: p.order,
    title: p.title,
    emoji: p.emoji,
    category: p.category,
    sectionCount: p.sections.length,
  }));

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <Shell nav={parts}>{children}</Shell>
      </body>
    </html>
  );
}
