import { notFound } from "next/navigation";
import { getPart, getParts } from "@/lib/content";
import { getQuiz } from "@/lib/quizzes";
import Markdown from "@/components/Markdown";
import Quiz from "@/components/Quiz";
import TopicActions from "@/components/TopicActions";

export function generateStaticParams() {
  return getParts().map((p) => ({ slug: p.slug }));
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const part = getPart(slug);
  if (!part) notFound();

  const all = getParts();
  const idx = all.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? adj(all[idx - 1]) : null;
  const next = idx < all.length - 1 ? adj(all[idx + 1]) : null;
  const quiz = getQuiz(slug);

  return (
    <article className="mx-auto max-w-3xl">
      <div className="mb-6">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--accent)" }}
        >
          {part.category} · Topic {part.order}
        </span>
        <h1 className="mt-1 flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
          <span>{part.emoji}</span>
          {part.title}
        </h1>
      </div>

      {part.intro && (
        <div className="mb-6">
          <Markdown>{part.intro}</Markdown>
        </div>
      )}

      <div className="flex flex-col gap-8">
        {part.sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-20">
            <h2 className="mb-2 flex items-baseline gap-2 text-xl font-bold">
              <span className="text-sm font-mono" style={{ color: "var(--accent)" }}>
                {s.number}
              </span>
              {s.title}
            </h2>
            <Markdown>{s.markdown}</Markdown>
          </section>
        ))}
      </div>

      {quiz.length > 0 && (
        <div id="quiz" className="mt-10 scroll-mt-20">
          <Quiz questions={quiz} title={`Quiz: ${part.title}`} />
        </div>
      )}

      <TopicActions slug={slug} prev={prev} next={next} />
    </article>
  );
}

function adj(p: { slug: string; title: string }) {
  return { slug: p.slug, title: p.title };
}
