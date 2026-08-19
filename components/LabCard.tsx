import type { Lab } from "@/lib/labs";

export default function LabCard({ lab }: { lab: Lab }) {
  return (
    <a
      href={lab.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{ borderColor: "var(--accent)", background: "var(--accent-soft)" }}
    >
      <span
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
        style={{ color: "var(--accent)" }}
      >
        <span className="text-base">{lab.emoji}</span>
        Practice lab · live demo
      </span>
      <h3 className="font-bold leading-snug">
        {lab.title}
        <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">
          ↗
        </span>
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
        {lab.description}
      </p>
      <span className="mt-1 truncate font-mono text-[11px]" style={{ color: "var(--accent)" }}>
        {lab.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
      </span>
    </a>
  );
}
