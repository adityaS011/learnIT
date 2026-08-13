// Tiny localStorage-based progress tracker for completed topics.
const KEY = "learnit-progress";

export function getProgress(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function setDone(slug: string, done: boolean) {
  if (typeof window === "undefined") return;
  const p = getProgress();
  if (done) p[slug] = true;
  else delete p[slug];
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("progress-updated"));
}

export function isDone(slug: string): boolean {
  return !!getProgress()[slug];
}
