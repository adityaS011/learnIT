import Link from "next/link";
import { getParts } from "@/lib/content";
import { QUIZZES } from "@/lib/quizzes";
import HomeProgress from "@/components/HomeProgress";

export default function Home() {
  const parts = getParts();
  const totalSections = parts.reduce((a, p) => a + p.sections.length, 0);
  const totalQuestions = Object.values(QUIZZES).reduce((a, q) => a + q.length, 0);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Hero */}
      <section className="mb-10">
        <span
          className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          Frontend Engineering · Interview Ready
        </span>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
          Master <span style={{ color: "var(--accent)" }}>frontend</span> &amp;
          ace your interviews.
        </h1>
        <p className="mt-4 max-w-2xl text-base sm:text-lg" style={{ color: "var(--muted)" }}>
          A hands-on course covering React, TypeScript, performance, Next.js,
          security, design systems and more — each topic paired with real
          interview-style MCQs that tell you instantly what you got right.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/topic/${parts[0]?.slug}`}
            className="rounded-xl px-5 py-3 text-center text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#6d28d9,#a855f7)" }}
          >
            Start learning →
          </Link>
          <Link
            href="/quiz"
            className="rounded-xl border px-5 py-3 text-center text-sm font-semibold"
            style={{ borderColor: "var(--border)" }}
          >
            Jump to quizzes
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <Stat value={`${parts.length}`} label="Topics" />
          <Stat value={`${totalSections}`} label="Lessons" />
          <Stat value={`${totalQuestions}`} label="Quiz Qs" />
        </div>

        <div className="mt-6">
          <HomeProgress total={parts.length} />
        </div>
      </section>

      {/* Topic grid */}
      <h2 className="mb-4 text-xl font-bold">Course topics</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {parts.map((p) => {
          const qCount = QUIZZES[p.slug]?.length ?? 0;
          return (
            <Link
              key={p.slug}
              href={`/topic/${p.slug}`}
              className="group flex flex-col rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{p.emoji}</span>
                <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                  Part {p.number}
                </span>
              </div>
              <h3 className="mt-3 font-bold leading-snug group-hover:text-[var(--accent)]">
                {p.title}
              </h3>
              <div className="mt-auto flex items-center gap-3 pt-4 text-xs" style={{ color: "var(--muted)" }}>
                <span>📄 {p.sections.length} lessons</span>
                {qCount > 0 && <span>🧠 {qCount} quiz Qs</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="rounded-2xl border p-4 text-center"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="text-2xl font-extrabold" style={{ color: "var(--accent)" }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: "var(--muted)" }}>
        {label}
      </div>
    </div>
  );
}
