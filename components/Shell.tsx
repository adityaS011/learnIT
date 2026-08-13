"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar, { type NavPart } from "./Sidebar";

export default function Shell({
  nav,
  children,
}: {
  nav: NavPart[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Close the mobile drawer on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header
        className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b px-4 backdrop-blur-md"
        style={{
          borderColor: "var(--border)",
          background: "color-mix(in srgb, var(--bg) 85%, transparent)",
        }}
      >
        <button
          onClick={() => setOpen(true)}
          className="grid h-9 w-9 place-items-center rounded-lg border lg:hidden"
          style={{ borderColor: "var(--border)" }}
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>

        <Link href="/" className="flex items-center gap-2 font-bold">
          <span
            className="grid h-8 w-8 place-items-center rounded-lg text-white"
            style={{ background: "linear-gradient(135deg,#6d28d9,#a855f7)" }}
          >
            ⚡
          </span>
          <span className="text-[15px] sm:text-base">
            Learn<span style={{ color: "var(--accent)" }}>IT</span>
          </span>
          <span
            className="ml-1 hidden rounded-full px-2 py-0.5 text-[11px] font-medium sm:inline"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            Frontend Interview Prep
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/quiz"
            className="hidden rounded-lg px-3 py-1.5 text-sm font-medium sm:inline-block"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            Quizzes
          </Link>
          <button
            onClick={toggleTheme}
            className="grid h-9 w-9 place-items-center rounded-lg border"
            style={{ borderColor: "var(--border)" }}
            aria-label="Toggle theme"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px]">
        {/* Sidebar — persistent on desktop, drawer on mobile */}
        <Sidebar nav={nav} open={open} onClose={() => setOpen(false)} />

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
