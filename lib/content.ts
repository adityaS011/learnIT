import fs from "node:fs";
import path from "node:path";

export type Section = {
  id: string; // e.g. "1-1"
  number: string; // e.g. "1.1"
  title: string; // e.g. "Controlled vs Uncontrolled Components"
  markdown: string; // body markdown (without the ### heading)
};

export type Part = {
  slug: string; // e.g. "part-1"
  number: number; // 1
  title: string; // "React Fundamentals"
  emoji: string;
  intro: string; // markdown intro text between part heading and first section
  sections: Section[];
};

const EMOJIS: Record<number, string> = {
  1: "⚛️",
  2: "🟦",
  3: "🚀",
  4: "🗂️",
  5: "▲",
  6: "📈",
  7: "🌐",
  8: "🔒",
  9: "🔁",
  10: "🎨",
  11: "🧩",
  12: "♻️",
  13: "🗣️",
  14: "➕",
  15: "📋",
  16: "🎯",
};

function cleanHeading(raw: string): string {
  // strip trailing decorations like " ⭐" and markdown emphasis
  return raw.replace(/[⭐*]/g, "").trim();
}

let cached: Part[] | null = null;

export function getParts(): Part[] {
  if (cached) return cached;

  const filePath = path.join(process.cwd(), "content", "frontend-reference.md");
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split("\n");

  const parts: Part[] = [];
  let currentPart: Part | null = null;
  let currentSection: Section | null = null;
  let buffer: string[] = [];

  const flushSection = () => {
    if (currentPart && currentSection) {
      currentSection.markdown = buffer.join("\n").trim();
      currentPart.sections.push(currentSection);
    } else if (currentPart) {
      currentPart.intro = buffer.join("\n").trim();
    }
    buffer = [];
  };

  for (const line of lines) {
    const partMatch = line.match(/^##\s+Part\s+(\d+)\s+[—-]\s+(.+)$/);
    const sectionMatch = line.match(/^###\s+(\d+\.\d+)\s+(.+)$/);

    if (partMatch) {
      flushSection();
      currentSection = null;
      const number = parseInt(partMatch[1], 10);
      currentPart = {
        slug: `part-${number}`,
        number,
        title: cleanHeading(partMatch[2]),
        emoji: EMOJIS[number] ?? "📘",
        intro: "",
        sections: [],
      };
      parts.push(currentPart);
      buffer = [];
      continue;
    }

    if (sectionMatch && currentPart) {
      flushSection();
      currentSection = {
        id: `${currentPart.number}-${sectionMatch[1].split(".")[1]}`,
        number: sectionMatch[1],
        title: cleanHeading(sectionMatch[2]),
        markdown: "",
      };
      continue;
    }

    // Skip the standalone horizontal rules that separate sections
    if (line.trim() === "---") continue;

    if (currentPart) buffer.push(line);
  }
  flushSection();

  cached = parts;
  return parts;
}

export function getPart(slug: string): Part | undefined {
  return getParts().find((p) => p.slug === slug);
}
