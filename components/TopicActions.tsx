"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isDone, setDone } from "@/lib/progress";

type Adj = { slug: string; title: string } | null;

export default function TopicActions({
  slug,
  prev,
  next,
}: {
  slug: string;
  prev: Adj;
  next: Adj;
}) {
  const [done, setDoneState] = useState(false);

  useEffect(() => {
    setDoneState(isDone(slug));
  }, [slug]);

  const toggle = () => {
    const v = !done;
    setDoneState(v);
    setDone(slug, v);
  };

  return (
    <div className="mt-8 flex flex-col gap-4">
      <button
        onClick={toggle}
        className="w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors sm:w-auto"
        style={
          done
            ? { background: "#22c55e", color: "#fff" }
            : { background: "var(--accent)", color: "#fff" }
        }
      >
        {done ? "✓ Completed — click to unmark" : "Mark this topic as complete"}
      </button>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/topic/${prev.slug}`}
            className="rounded-xl border p-3.5 text-sm transition-colors hover:border-[var(--accent)]"
            style={{ borderColor: "var(--border)" }}
          >
            <span style={{ color: "var(--muted)" }}>← Previous</span>
            <div className="mt-0.5 font-semibold">{prev.title}</div>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/topic/${next.slug}`}
            className="rounded-xl border p-3.5 text-right text-sm transition-colors hover:border-[var(--accent)] sm:text-right"
            style={{ borderColor: "var(--border)" }}
          >
            <span style={{ color: "var(--muted)" }}>Next →</span>
            <div className="mt-0.5 font-semibold">{next.title}</div>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
