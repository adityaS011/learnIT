"use client";

import { useMemo, useState } from "react";
import type { Question } from "@/lib/quizzes";

export default function Quiz({
  questions,
  title,
}: {
  questions: Question[];
  title?: string;
}) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [nonce, setNonce] = useState(0);

  const answeredCount = Object.keys(picked).length;
  const score = useMemo(
    () =>
      questions.reduce(
        (acc, q, i) => acc + (picked[i] === q.answer ? 1 : 0),
        0
      ),
    [picked, questions]
  );

  if (!questions.length) return null;

  const pick = (qi: number, oi: number) => {
    if (submitted) return;
    setPicked((p) => ({ ...p, [qi]: oi }));
  };

  const reset = () => {
    setPicked({});
    setSubmitted(false);
    setNonce((n) => n + 1);
  };

  const pct = Math.round((score / questions.length) * 100);

  return (
    <section
      key={nonce}
      className="rounded-2xl border p-4 sm:p-6"
      style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold sm:text-xl">
          🧠 {title ?? "Test Yourself"}
        </h2>
        <span className="text-sm" style={{ color: "var(--muted)" }}>
          {questions.length} question{questions.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {questions.map((q, qi) => {
          const chosen = picked[qi];
          return (
            <div key={qi}>
              <p className="mb-2.5 font-medium leading-snug">
                <span
                  className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full text-xs font-bold"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                >
                  {qi + 1}
                </span>
                {q.q}
              </p>

              <div className="flex flex-col gap-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrect = oi === q.answer;
                  const reveal = submitted || (chosen !== undefined);

                  let cls =
                    "flex items-start gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors";
                  const style: React.CSSProperties = { borderColor: "var(--border)" };

                  if (reveal && isCorrect) {
                    style.borderColor = "#22c55e";
                    style.background = "rgba(34,197,94,0.10)";
                  } else if (reveal && isChosen && !isCorrect) {
                    style.borderColor = "#ef4444";
                    style.background = "rgba(239,68,68,0.10)";
                  } else if (isChosen) {
                    style.borderColor = "var(--accent)";
                  }

                  return (
                    <button
                      key={oi}
                      onClick={() => pick(qi, oi)}
                      disabled={chosen !== undefined || submitted}
                      className={cls + (chosen === undefined ? " hover:border-[var(--accent)]" : " cursor-default")}
                      style={style}
                    >
                      <span
                        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] font-bold"
                        style={{ borderColor: "var(--border)" }}
                      >
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {reveal && isCorrect && <span className="text-green-500">✓</span>}
                      {reveal && isChosen && !isCorrect && (
                        <span className="text-red-500">✕</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {chosen !== undefined && (
                <div
                  className="mt-2 rounded-xl border-l-2 px-3.5 py-2 text-sm"
                  style={{
                    borderColor: chosen === q.answer ? "#22c55e" : "#ef4444",
                    background: "var(--bg)",
                    color: "var(--muted)",
                  }}
                >
                  <strong style={{ color: "var(--text)" }}>
                    {chosen === q.answer ? "Correct. " : "Not quite. "}
                  </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
        {answeredCount === questions.length ? (
          <>
            <span
              className="rounded-full px-4 py-1.5 text-sm font-bold text-white"
              style={{
                background:
                  pct >= 70 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#ef4444",
              }}
            >
              Score: {score}/{questions.length} ({pct}%)
            </span>
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              {pct >= 70 ? "Interview-ready on this topic! 🎉" : "Review the topic and try again."}
            </span>
          </>
        ) : (
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            Answered {answeredCount}/{questions.length}
          </span>
        )}
        <button
          onClick={reset}
          className="ml-auto rounded-lg border px-3.5 py-1.5 text-sm font-medium"
          style={{ borderColor: "var(--border)" }}
        >
          ↻ Reset
        </button>
      </div>
    </section>
  );
}
