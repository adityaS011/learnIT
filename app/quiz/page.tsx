import Link from "next/link";
import { getParts } from "@/lib/content";
import { QUIZZES } from "@/lib/quizzes";

export const metadata = { title: "Quizzes — LearnIT" };

export default function QuizIndex() {
  const parts = getParts().filter((p) => (QUIZZES[p.slug]?.length ?? 0) > 0);
  const total = Object.values(QUIZZES).reduce((a, q) => a + q.length, 0);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-extrabold sm:text-3xl">🧠 Quizzes</h1>
      <p className="mt-2" style={{ color: "var(--muted)" }}>
        {total} interview-style questions across {parts.length} topics. Pick a
        topic to test yourself — you get instant right/wrong feedback with an
        explanation for every answer.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {parts.map((p) => {
          const count = QUIZZES[p.slug].length;
          return (
            <Link
              key={p.slug}
              href={`/topic/${p.slug}#quiz`}
              className="group flex items-center gap-4 rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
            >
              <span className="text-3xl">{p.emoji}</span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold group-hover:text-[var(--accent)]">
                  {p.title}
                </h3>
                <span className="text-sm" style={{ color: "var(--muted)" }}>
                  {count} question{count > 1 ? "s" : ""}
                </span>
              </div>
              <span
                className="rounded-lg px-3 py-1.5 text-sm font-semibold"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                Start →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
