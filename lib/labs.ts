// Live practice projects that pair with a topic. Keyed by part slug.
export type Lab = {
  title: string;
  description: string;
  url: string;
  emoji: string;
};

export const LABS: Record<string, Lab> = {
  performance: {
    title: "Performance Playground",
    description:
      "A live Next.js app where the optimizations from this topic are applied and measurable — code splitting, memoization, image and render tuning. Open it, profile it, break it.",
    url: "https://optimize-performance-learnit.vercel.app/",
    emoji: "🚀",
  },
};

export function getLab(slug: string): Lab | undefined {
  return LABS[slug];
}

export function hasLab(slug: string): boolean {
  return slug in LABS;
}
