"use client";

import { useEffect, useState } from "react";
import { getProgress } from "@/lib/progress";

export default function HomeProgress({ total }: { total: number }) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const read = () => setDone(Object.keys(getProgress()).length);
    read();
    window.addEventListener("progress-updated", read);
    return () => window.removeEventListener("progress-updated", read);
  }, []);

  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div
      className="flex items-center gap-4 rounded-2xl border p-4"
      style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
    >
      <div className="relative grid h-16 w-16 shrink-0 place-items-center">
        <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--border)" strokeWidth="3" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * 97.4} 97.4`}
          />
        </svg>
        <span className="absolute text-sm font-bold">{pct}%</span>
      </div>
      <div>
        <div className="font-semibold">Your progress</div>
        <div className="text-sm" style={{ color: "var(--muted)" }}>
          {done} of {total} topics completed
        </div>
      </div>
    </div>
  );
}
