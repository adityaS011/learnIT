import fs from "node:fs";
import path from "node:path";

export type Section = {
  id: string; // e.g. "3-2"
  number: string; // e.g. "3.2"
  title: string;
  markdown: string;
};

export type Part = {
  slug: string;
  order: number; // 1-based position across the whole course
  title: string;
  emoji: string;
  category: string;
  intro: string;
  sections: Section[];
};

// Source of a part's content: either a "Part N" block inside the big
// reference file, or a standalone markdown module in content/modules.
type Source =
  | { type: "ref"; part: number }
  | { type: "file"; file: string };

type ManifestEntry = {
  slug: string;
  title: string;
  emoji: string;
  category: string;
  source: Source;
};

// Order here == order in the sidebar / home / prev-next navigation.
const MANIFEST: ManifestEntry[] = [
  // ── Fundamentals ────────────────────────────────────────────────
  { slug: "html", title: "HTML Fundamentals", emoji: "📄", category: "Fundamentals", source: { type: "file", file: "html.md" } },
  { slug: "css", title: "CSS Fundamentals", emoji: "🎨", category: "Fundamentals", source: { type: "file", file: "css.md" } },
  { slug: "javascript", title: "JavaScript Core", emoji: "🟨", category: "Fundamentals", source: { type: "file", file: "javascript.md" } },
  { slug: "javascript-async", title: "JavaScript: Async & Advanced", emoji: "⚙️", category: "Fundamentals", source: { type: "file", file: "javascript-async.md" } },
  { slug: "dom-events", title: "DOM, Events & Browser APIs", emoji: "🌳", category: "Fundamentals", source: { type: "file", file: "dom-events.md" } },
  { slug: "http-networking", title: "HTTP, Networking & Web Security", emoji: "📡", category: "Fundamentals", source: { type: "file", file: "http-networking.md" } },

  // ── React ───────────────────────────────────────────────────────
  { slug: "react-fundamentals", title: "React Fundamentals", emoji: "⚛️", category: "React", source: { type: "ref", part: 1 } },
  { slug: "react-hooks", title: "React Hooks — Complete Guide", emoji: "🪝", category: "React", source: { type: "file", file: "react-hooks.md" } },

  // ── Engineering ─────────────────────────────────────────────────
  { slug: "typescript", title: "TypeScript in Frontend", emoji: "🟦", category: "Engineering", source: { type: "ref", part: 2 } },
  { slug: "performance", title: "Performance Optimization", emoji: "🚀", category: "Engineering", source: { type: "ref", part: 3 } },
  { slug: "state-management", title: "State Management", emoji: "🗂️", category: "Engineering", source: { type: "ref", part: 4 } },
  { slug: "nextjs", title: "Next.js, SSR/CSR & Caching", emoji: "▲", category: "Engineering", source: { type: "ref", part: 5 } },
  { slug: "scaling", title: "Scaling for High Concurrency", emoji: "📈", category: "Engineering", source: { type: "ref", part: 6 } },
  { slug: "browser", title: "Browser Internals & the Web Platform", emoji: "🌐", category: "Engineering", source: { type: "ref", part: 7 } },
  { slug: "security", title: "Security (XSS, CSRF & more)", emoji: "🔒", category: "Engineering", source: { type: "ref", part: 8 } },
  { slug: "api-errors", title: "API Error Handling & Retries", emoji: "🔁", category: "Engineering", source: { type: "ref", part: 9 } },

  // ── Architecture ────────────────────────────────────────────────
  { slug: "design-systems", title: "Design Systems", emoji: "🎨", category: "Architecture", source: { type: "ref", part: 10 } },
  { slug: "micro-frontends", title: "Micro-Frontends & Architecture at Scale", emoji: "🧩", category: "Architecture", source: { type: "ref", part: 11 } },
  { slug: "refactoring", title: "Refactoring Strategy", emoji: "♻️", category: "Architecture", source: { type: "ref", part: 12 } },

  // ── Interview ───────────────────────────────────────────────────
  { slug: "behavioral", title: "Behavioral Questions & Delivery", emoji: "🗣️", category: "Interview", source: { type: "ref", part: 13 } },
  { slug: "additions", title: "Important Additions You Should Know", emoji: "➕", category: "Interview", source: { type: "ref", part: 14 } },
  { slug: "cheat-sheets", title: "Quick-Reference Cheat Sheets", emoji: "📋", category: "Interview", source: { type: "ref", part: 15 } },
  { slug: "answering-depth", title: "Answering With Depth", emoji: "🎯", category: "Interview", source: { type: "ref", part: 16 } },
];

export const CATEGORY_ORDER = [
  "Fundamentals",
  "React",
  "Engineering",
  "Architecture",
  "Interview",
];

function cleanHeading(raw: string): string {
  return raw.replace(/[⭐*]/g, "").trim();
}

const contentDir = path.join(process.cwd(), "content");

// ── Reference-file parsing (## Part N — Title  /  ### x.y Section) ──
type RefPart = { number: number; intro: string; sections: { number: string; title: string; markdown: string }[] };
let refCache: Map<number, RefPart> | null = null;

function loadReference(): Map<number, RefPart> {
  if (refCache) return refCache;
  const raw = fs.readFileSync(path.join(contentDir, "frontend-reference.md"), "utf8");
  const lines = raw.split("\n");
  const map = new Map<number, RefPart>();
  let cur: RefPart | null = null;
  let curSection: { number: string; title: string; markdown: string } | null = null;
  let buffer: string[] = [];
  let inFence = false;

  const flush = () => {
    if (cur && curSection) {
      curSection.markdown = buffer.join("\n").trim();
      cur.sections.push(curSection);
    } else if (cur) {
      cur.intro = buffer.join("\n").trim();
    }
    buffer = [];
  };

  for (const line of lines) {
    if (/^```/.test(line.trim())) inFence = !inFence;
    const partMatch = !inFence && line.match(/^##\s+Part\s+(\d+)\s+[—-]\s+(.+)$/);
    const sectionMatch = !inFence && line.match(/^###\s+(\d+\.\d+)\s+(.+)$/);

    if (partMatch) {
      flush();
      curSection = null;
      cur = { number: parseInt(partMatch[1], 10), intro: "", sections: [] };
      map.set(cur.number, cur);
      buffer = [];
      continue;
    }
    if (sectionMatch && cur) {
      flush();
      curSection = { number: sectionMatch[1], title: cleanHeading(sectionMatch[2]), markdown: "" };
      continue;
    }
    if (line.trim() === "---" && !inFence) continue;
    if (cur) buffer.push(line);
  }
  flush();
  refCache = map;
  return map;
}

// ── Module-file parsing (## Section Title) ──
function loadModule(file: string): { intro: string; sections: { title: string; markdown: string }[] } {
  const raw = fs.readFileSync(path.join(contentDir, "modules", file), "utf8");
  const lines = raw.split("\n");
  const sections: { title: string; markdown: string }[] = [];
  let intro = "";
  let curTitle: string | null = null;
  let buffer: string[] = [];
  let inFence = false;
  let seenH1 = false;

  const flush = () => {
    if (curTitle !== null) sections.push({ title: curTitle, markdown: buffer.join("\n").trim() });
    else intro = buffer.join("\n").trim();
    buffer = [];
  };

  for (const line of lines) {
    if (/^```/.test(line.trim())) inFence = !inFence;
    // Skip a leading H1 title line (file title)
    if (!inFence && !seenH1 && /^#\s+/.test(line)) {
      seenH1 = true;
      continue;
    }
    const h2 = !inFence && line.match(/^##\s+(.+)$/);
    if (h2) {
      flush();
      curTitle = cleanHeading(h2[1]);
      continue;
    }
    buffer.push(line);
  }
  flush();
  return { intro, sections };
}

let cache: Part[] | null = null;

export function getParts(): Part[] {
  if (cache) return cache;

  cache = MANIFEST.map((entry, i) => {
    const order = i + 1;
    let intro = "";
    let sections: Section[] = [];

    if (entry.source.type === "ref") {
      const rp = loadReference().get(entry.source.part);
      intro = rp?.intro ?? "";
      sections =
        rp?.sections.map((s, si) => ({
          id: `${order}-${si + 1}`,
          number: `${order}.${si + 1}`,
          title: s.title,
          markdown: s.markdown,
        })) ?? [];
    } else {
      const mod = loadModule(entry.source.file);
      intro = mod.intro;
      sections = mod.sections.map((s, si) => ({
        id: `${order}-${si + 1}`,
        number: `${order}.${si + 1}`,
        title: s.title,
        markdown: s.markdown,
      }));
    }

    return {
      slug: entry.slug,
      order,
      title: entry.title,
      emoji: entry.emoji,
      category: entry.category,
      intro,
      sections,
    };
  });

  return cache;
}

export function getPart(slug: string): Part | undefined {
  return getParts().find((p) => p.slug === slug);
}

export function getPartsByCategory(): { category: string; parts: Part[] }[] {
  const parts = getParts();
  return CATEGORY_ORDER.map((category) => ({
    category,
    parts: parts.filter((p) => p.category === category),
  })).filter((g) => g.parts.length > 0);
}
