"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getProgress } from "@/lib/progress";

export type NavPart = {
  slug: string;
  number: number;
  title: string;
  emoji: string;
  sectionCount: number;
};

export default function Sidebar({
  nav,
  open,
  onClose,
}: {
  nav: NavPart[];
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setDone(getProgress());
    const onStorage = () => setDone(getProgress());
    window.addEventListener("progress-updated", onStorage);
    return () => window.removeEventListener("progress-updated", onStorage);
  }, [pathname]);

  const doneCount = nav.filter((p) => done[p.slug]).length;

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-72 shrink-0 overflow-y-auto border-r px-3 py-4 transition-transform duration-200",
          "lg:sticky lg:top-14 lg:z-0 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ borderColor: "var(--border)", background: "var(--bg)" }}
      >
        <div className="mb-3 flex items-center justify-between px-2 lg:hidden">
          <span className="font-bold">Menu</span>
          <button onClick={onClose} aria-label="Close" className="text-xl leading-none">
            ✕
          </button>
        </div>

        <Link
          href="/"
          className={navItemClass(pathname === "/")}
          style={navItemStyle(pathname === "/")}
        >
          <span className="text-base">🏠</span>
          <span className="font-medium">Home</span>
        </Link>
        <Link
          href="/quiz"
          className={navItemClass(pathname === "/quiz")}
          style={navItemStyle(pathname === "/quiz")}
        >
          <span className="text-base">🧠</span>
          <span className="font-medium">All Quizzes</span>
        </Link>

        <div className="mt-4 flex items-center justify-between px-3 pb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Topics
          </span>
          <span className="text-[11px]" style={{ color: "var(--muted)" }}>
            {doneCount}/{nav.length}
          </span>
        </div>

        <nav className="flex flex-col gap-0.5">
          {nav.map((p) => {
            const href = `/topic/${p.slug}`;
            const active = pathname === href;
            return (
              <Link key={p.slug} href={href} className={navItemClass(active)} style={navItemStyle(active)}>
                <span className="text-base">{p.emoji}</span>
                <span className="min-w-0 flex-1 truncate">
                  <span className="mr-1 text-xs opacity-60">{p.number}.</span>
                  {p.title}
                </span>
                {done[p.slug] && <span className="text-xs text-green-500">✓</span>}
              </Link>
            );
          })}
        </nav>

        <p className="mt-6 px-3 text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
          Frontend engineering & interview prep. Read a topic, then test yourself
          with its quiz.
        </p>
      </aside>
    </>
  );
}

function navItemClass(active: boolean) {
  return [
    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
    active ? "font-semibold" : "hover:bg-black/5 dark:hover:bg-white/5",
  ].join(" ");
}
function navItemStyle(active: boolean): React.CSSProperties {
  return active
    ? { background: "var(--accent-soft)", color: "var(--accent)" }
    : { color: "var(--text)" };
}
