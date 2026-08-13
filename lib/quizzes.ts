export type Question = {
  q: string;
  options: string[];
  answer: number; // index of correct option
  explanation: string;
};

// Quizzes keyed by part slug. Interview-style MCQs derived from the reference.
export const QUIZZES: Record<string, Question[]> = {
  "part-1": [
    {
      q: "Which input type is ALWAYS uncontrolled in React?",
      options: ['<input type="text">', '<input type="file">', '<input type="checkbox">', '<textarea>'],
      answer: 1,
      explanation:
        "File inputs are read-only for security reasons — JS cannot set their value — so they are always uncontrolled and read via a ref.",
    },
    {
      q: "You need to measure a DOM node and reposition it before the user sees a flicker. Which hook fits?",
      options: ["useEffect", "useMemo", "useLayoutEffect", "useCallback"],
      answer: 2,
      explanation:
        "useLayoutEffect runs synchronously after DOM mutations but before paint, so measurement + repositioning happens before the user sees anything.",
    },
    {
      q: "Why is using the array index as a key dangerous for a reorderable list?",
      options: [
        "It makes rendering slower in all cases",
        "React associates the wrong DOM node / component state with the wrong data",
        "It throws a runtime error",
        "Keys are ignored when they are numbers",
      ],
      answer: 1,
      explanation:
        "With index keys, inserting/reordering makes React match by position, so state (input values, checkboxes) sticks to the wrong item.",
    },
    {
      q: "What is the real reason the Virtual DOM helps performance?",
      options: [
        "JS objects are inherently faster than DOM nodes",
        "It avoids JavaScript entirely",
        "It minimizes and batches real DOM writes to the smallest change set",
        "It caches the entire page in memory",
      ],
      answer: 2,
      explanation:
        "The win isn't that the VDOM is 'virtual' — it's that React batches and minimizes expensive real DOM writes (layout/paint) into one coordinated pass.",
    },
    {
      q: "A common cause of memory leaks in React is:",
      options: [
        "Using useState too often",
        "Not cleaning up subscriptions/timers in a useEffect return function",
        "Rendering too many components",
        "Using TypeScript generics",
      ],
      answer: 1,
      explanation:
        "Effects that add listeners, timers, or subscriptions must return a cleanup function; otherwise they accumulate and leak after unmount.",
    },
  ],
  "part-2": [
    {
      q: "What is the primary real benefit of TypeScript in a frontend codebase?",
      options: [
        "It makes the bundle smaller",
        "It catches a class of errors at compile time and improves refactoring/DX",
        "It replaces the need for tests",
        "It speeds up runtime execution",
      ],
      answer: 1,
      explanation:
        "TS shifts a category of bugs left (compile time), and powers safe refactors and autocomplete. It does not change runtime performance or replace tests.",
    },
    {
      q: "Which utility type makes all properties of T optional?",
      options: ["Required<T>", "Partial<T>", "Readonly<T>", "Pick<T, K>"],
      answer: 1,
      explanation: "Partial<T> maps every property to optional; Required<T> does the opposite.",
    },
  ],
  "part-3": [
    {
      q: "What is the golden rule of performance optimization?",
      options: [
        "Always wrap everything in React.memo",
        "Measure before optimizing",
        "Avoid useState entirely",
        "Ship as few components as possible",
      ],
      answer: 1,
      explanation:
        "Profile first. Premature memoization adds complexity and can even hurt. Measure, find the real bottleneck, then optimize.",
    },
    {
      q: "For rendering a list of 10,000+ rows efficiently, the key technique is:",
      options: [
        "React.memo on each row",
        "useCallback for the map function",
        "Virtual scrolling / windowing (render only visible rows)",
        "Moving state to Redux",
      ],
      answer: 2,
      explanation:
        "Windowing renders only the rows in (and near) the viewport, keeping the DOM node count constant regardless of dataset size.",
    },
    {
      q: "Which React 18 hook keeps the UI responsive by marking a state update as non-urgent?",
      options: ["useTransition", "useEffect", "useRef", "useContext"],
      answer: 0,
      explanation:
        "useTransition (and useDeferredValue) let React interrupt/deprioritize heavy updates so urgent input stays responsive.",
    },
    {
      q: "A common reason 'React.memo isn't working' is:",
      options: [
        "The component has too many props",
        "A new object/array/function reference is passed as a prop on every render",
        "memo only works on class components",
        "The component uses hooks",
      ],
      answer: 1,
      explanation:
        "memo does a shallow prop compare. Inline objects/arrays/functions create fresh references each render, defeating it — memoize them with useMemo/useCallback.",
    },
  ],
  "part-4": [
    {
      q: "Why does Zustand shine for very frequent state updates?",
      options: [
        "It uses Context under the hood",
        "Components subscribe to selected slices, so only those re-render",
        "It disables React's reconciliation",
        "It stores state on the server",
      ],
      answer: 1,
      explanation:
        "Zustand's selector subscriptions mean a component re-renders only when its selected slice changes — avoiding the broad re-renders Context causes.",
    },
    {
      q: "Putting a rapidly-changing value in React Context typically causes:",
      options: [
        "Nothing — Context is optimized for this",
        "Every consumer of that context to re-render",
        "A memory leak",
        "A hydration error",
      ],
      answer: 1,
      explanation:
        "Any change to a Context value re-renders all consumers, which is why high-frequency updates belong in a store with selectors, not raw Context.",
    },
  ],
  "part-5": [
    {
      q: "In Next.js, which environment variables are exposed to the browser?",
      options: [
        "All of them",
        "Only those prefixed with NEXT_PUBLIC_",
        "Only those in .env.local",
        "None — env vars are server-only",
      ],
      answer: 1,
      explanation:
        "Only NEXT_PUBLIC_-prefixed vars are inlined into the client bundle. Secrets must NOT use that prefix, or they leak to the browser.",
    },
    {
      q: "SSR (server-side rendering) primarily improves:",
      options: [
        "Runtime memory usage",
        "Time-to-first-meaningful-content and SEO for the initial load",
        "The size of node_modules",
        "TypeScript type safety",
      ],
      answer: 1,
      explanation:
        "SSR sends rendered HTML on first request — faster perceived load and crawlable content — then hydrates on the client.",
    },
  ],
  "part-6": [
    {
      q: "When scaling for high concurrency, which layer is usually the first bottleneck?",
      options: ["The CSS", "The database", "The favicon", "The bundler"],
      answer: 1,
      explanation:
        "The database is typically the first wall — addressed with indexing, read replicas, connection pooling, and caching.",
    },
  ],
  "part-7": [
    {
      q: "The critical rendering path roughly is:",
      options: [
        "JS → CSS → HTML → paint",
        "HTML → DOM, CSS → CSSOM → Render Tree → Layout → Paint",
        "Paint → Layout → DOM",
        "Fetch → Hydrate → Reconcile",
      ],
      answer: 1,
      explanation:
        "Browser parses HTML into the DOM and CSS into the CSSOM, combines them into the render tree, then does layout (geometry) and paint (pixels).",
    },
  ],
  "part-8": [
    {
      q: "The core defense against XSS is:",
      options: [
        "Using HTTPS",
        "Escaping/encoding output and avoiding dangerouslySetInnerHTML with untrusted data",
        "A strong CORS policy",
        "Hashing passwords",
      ],
      answer: 1,
      explanation:
        "XSS is an output-encoding problem. React auto-escapes by default; the danger is injecting untrusted HTML (e.g. dangerouslySetInnerHTML). CSP adds defense in depth.",
    },
    {
      q: "CSRF is best mitigated with:",
      options: [
        "Anti-CSRF tokens and SameSite cookies",
        "Minifying JavaScript",
        "Using localStorage for everything",
        "Disabling cookies",
      ],
      answer: 0,
      explanation:
        "CSRF exploits ambient cookie auth. SameSite cookies plus per-request anti-CSRF tokens ensure requests originate from your app.",
    },
  ],
  "part-9": [
    {
      q: "'Exponential backoff' for retries means:",
      options: [
        "Retry instantly forever",
        "Wait progressively longer between retries (e.g. 1s, 2s, 4s), ideally with jitter",
        "Only retry once",
        "Retry faster each time",
      ],
      answer: 1,
      explanation:
        "Backoff increases the delay between attempts to avoid hammering a struggling server; jitter spreads retries to prevent thundering herds.",
    },
    {
      q: "React Error Boundaries catch:",
      options: [
        "Failed fetch requests",
        "Errors thrown during rendering of child components",
        "TypeScript type errors",
        "CSS layout bugs",
      ],
      answer: 1,
      explanation:
        "Error boundaries catch render-time (and lifecycle) errors in their subtree — not async/fetch errors, event handlers, or SSR-only code.",
    },
  ],
  "part-10": [
    {
      q: "Design tokens are:",
      options: [
        "API authentication keys",
        "Named design decisions (color, spacing, type) as the single source of truth",
        "React components",
        "Feature flags",
      ],
      answer: 1,
      explanation:
        "Tokens encode design decisions (e.g. color.primary, space.4) so themes and platforms share one source of truth.",
    },
    {
      q: "The 'compound component' pattern is used to:",
      options: [
        "Compress the bundle",
        "Share implicit state between related sub-components (e.g. <Tabs><Tab/></Tabs>)",
        "Avoid using props",
        "Replace CSS",
      ],
      answer: 1,
      explanation:
        "Compound components coordinate related pieces through shared (usually Context-backed) state while giving consumers a flexible, expressive API.",
    },
  ],
  "part-11": [
    {
      q: "Micro-frontends make the most sense when:",
      options: [
        "You have a small team and one simple app",
        "Multiple independent teams need to deploy parts of a large app autonomously",
        "You want a smaller bundle",
        "You dislike TypeScript",
      ],
      answer: 1,
      explanation:
        "MFEs trade added complexity for independent deployability and team autonomy — worth it at scale, overkill for a small single-team app.",
    },
  ],
  "part-12": [
    {
      q: "The core principle when refactoring a large system is:",
      options: [
        "Rewrite everything at once",
        "Make small, safe, behavior-preserving steps backed by tests",
        "Delete tests to move faster",
        "Change behavior and structure together",
      ],
      answer: 1,
      explanation:
        "Refactoring preserves behavior while improving structure — in small, verifiable increments, ideally under test coverage.",
    },
  ],
  "part-14": [
    {
      q: "React Server Components (RSC) primarily let you:",
      options: [
        "Run useState on the server",
        "Render components on the server with zero client JS for those components",
        "Replace the database",
        "Disable hydration everywhere",
      ],
      answer: 1,
      explanation:
        "RSCs render on the server and ship no JS for themselves, reducing bundle size; interactivity still lives in client components.",
    },
    {
      q: "A key distinction interviewers expect is between:",
      options: [
        "CSS and SCSS",
        "Server state (remote, cached, async) and client state (local UI state)",
        "let and const",
        "npm and yarn",
      ],
      answer: 1,
      explanation:
        "Server state (data from APIs, needs caching/sync — e.g. React Query) differs from client/UI state (toggles, form inputs — useState/Zustand).",
    },
  ],
};

export function getQuiz(slug: string): Question[] {
  return QUIZZES[slug] ?? [];
}
