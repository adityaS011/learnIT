export type Question = {
  q: string;
  options: string[];
  answer: number; // index of correct option
  explanation: string;
};

// Quizzes keyed by topic slug. Interview-style MCQs.
export const QUIZZES: Record<string, Question[]> = {
  html: [
    {
      q: "What does the <!DOCTYPE html> declaration do?",
      options: [
        "Imports the HTML5 library",
        "Triggers standards mode (vs quirks mode) in the browser",
        "Defines the character encoding",
        "It is a required HTML tag with a closing tag",
      ],
      answer: 1,
      explanation:
        "It's a parser instruction (not a tag) that puts the browser in standards mode; without it browsers fall back to legacy quirks mode.",
    },
    {
      q: "Which script-loading attribute downloads in parallel AND preserves execution order after HTML is parsed?",
      options: ["async", "defer", "type=\"module\" only", "No attribute (plain script)"],
      answer: 1,
      explanation:
        "defer downloads in parallel and runs scripts in order after the DOM is parsed. async also downloads in parallel but runs ASAP with no order guarantee.",
    },
    {
      q: "Why prefer a native <button> over a <div onclick>?",
      options: [
        "It looks better by default",
        "It is focusable, keyboard-operable, and announced correctly to screen readers",
        "It loads faster",
        "There is no real difference",
      ],
      answer: 1,
      explanation:
        "A real button is in the tab order, activates on Enter/Space, and is announced as a button — accessibility you'd have to rebuild manually on a div.",
    },
    {
      q: "Which storage is automatically sent to the server on every request?",
      options: ["localStorage", "sessionStorage", "Cookies", "IndexedDB"],
      answer: 2,
      explanation:
        "Cookies are attached to matching requests automatically (~4KB limit). localStorage/sessionStorage stay on the client and are never auto-sent.",
    },
    {
      q: "What links a <label> to its input for accessibility?",
      options: [
        "The label's class matching the input's class",
        "The label's for attribute matching the input's id",
        "Placing them in the same <div>",
        "The name attribute",
      ],
      answer: 1,
      explanation:
        "label[for] must equal input[id] (or wrap the input). This lets clicking the label focus the field and lets screen readers announce the name.",
    },
  ],
  css: [
    {
      q: "With box-sizing: border-box, an element's width includes:",
      options: [
        "Only the content",
        "Content + padding + border",
        "Content + padding + border + margin",
        "Nothing — width is ignored",
      ],
      answer: 1,
      explanation:
        "border-box makes width include padding and border (not margin), so the box stays the size you set. content-box (default) counts content only.",
    },
    {
      q: "Which selector has the highest specificity?",
      options: [".btn.primary", "#submit", "button:hover", "div button"],
      answer: 1,
      explanation:
        "An id (#submit → 0,1,0,0) outranks any number of classes/pseudo-classes/elements. Specificity is compared id-count first.",
    },
    {
      q: "In Flexbox with the default flex-direction: row, justify-content aligns items along the:",
      options: ["Cross axis (vertical)", "Main axis (horizontal)", "Both axes", "Z axis"],
      answer: 1,
      explanation:
        "justify-content works on the main axis (horizontal in a row); align-items works on the cross axis. They swap when direction is column.",
    },
    {
      q: "Which position value positions an element relative to the viewport and keeps it fixed on scroll?",
      options: ["relative", "absolute", "fixed", "static"],
      answer: 2,
      explanation:
        "fixed removes the element from flow and anchors it to the viewport, so it stays put while the page scrolls (e.g. a sticky header bar).",
    },
    {
      q: "For smooth, jank-free animations you should primarily animate:",
      options: [
        "width and height",
        "top and left",
        "transform and opacity",
        "margin and padding",
      ],
      answer: 2,
      explanation:
        "transform and opacity are GPU-composited and skip layout/paint. Animating width/top/margin forces layout on every frame and causes jank.",
    },
    {
      q: "Which builds a responsive card grid with NO media queries?",
      options: [
        "grid-template-columns: repeat(3, 1fr)",
        "grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))",
        "display: flex; flex-direction: column",
        "float: left; width: 33%",
      ],
      answer: 1,
      explanation:
        "auto-fit + minmax lets tracks wrap and grow fluidly based on available space, reflowing automatically without breakpoints.",
    },
  ],
  javascript: [
    {
      q: "What does `typeof null` return?",
      options: ['"null"', '"object"', '"undefined"', "throws an error"],
      answer: 1,
      explanation:
        'It returns "object" — a long-standing bug in JavaScript kept for backward compatibility. Memorize it; interviewers ask.',
    },
    {
      q: "What is a closure?",
      options: [
        "A function that has finished executing",
        "A function bundled with references to its surrounding lexical scope",
        "A way to close a browser tab",
        "An object with private methods only",
      ],
      answer: 1,
      explanation:
        "A closure is a function plus the variables it captured from where it was defined — it 'remembers' that scope even after the outer function returns.",
    },
    {
      q: "What does this log?\nfor (var i = 0; i < 3; i++) setTimeout(() => console.log(i));",
      options: ["0 1 2", "3 3 3", "0 0 0", "undefined ×3"],
      answer: 1,
      explanation:
        "var has one shared, function-scoped binding. By the time the timeouts run, the loop finished and i is 3. Use let for a fresh per-iteration binding (0 1 2).",
    },
    {
      q: "How is `this` determined for a normal (non-arrow) function?",
      options: [
        "By where the function is defined",
        "By how the function is called (the call site)",
        "It's always the global object",
        "It's always undefined",
      ],
      answer: 1,
      explanation:
        "For regular functions `this` is set by the call site (new > call/apply/bind > method call > default). Arrow functions instead inherit `this` lexically.",
    },
    {
      q: "Which pair of values is equal with == but NOT with ===?",
      options: ["1 and 1", '0 and "0"', "null and null", "NaN and NaN"],
      answer: 1,
      explanation:
        '0 == "0" is true (loose equality coerces the string to a number) but 0 === "0" is false (different types). NaN is never equal to anything.',
    },
    {
      q: "A shallow copy like { ...obj } means:",
      options: [
        "Every nested level is fully duplicated",
        "Only the top level is copied; nested objects are still shared by reference",
        "Nothing is copied",
        "Functions are removed",
      ],
      answer: 1,
      explanation:
        "Spread copies only the first level. Nested objects/arrays remain shared references — mutating them affects the original. Use structuredClone for a deep copy.",
    },
    {
      q: "Which array method MUTATES the original array?",
      options: ["map", "filter", "sort", "reduce"],
      answer: 2,
      explanation:
        "sort (also splice, reverse, push) mutates in place. map/filter/reduce return new values. In React, copy first: [...arr].sort().",
    },
  ],
  "javascript-async": [
    {
      q: "What does this print?\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);",
      options: ["1 2 3 4", "1 4 2 3", "1 4 3 2", "1 3 4 2"],
      answer: 2,
      explanation:
        "Sync first (1, 4). Then ALL microtasks (promise → 3) drain before any macrotask (setTimeout → 2). Result: 1 4 3 2.",
    },
    {
      q: "Which Promise combinator rejects as soon as ANY input rejects?",
      options: ["Promise.allSettled", "Promise.all", "Promise.any", "Promise.race (only on fulfill)"],
      answer: 1,
      explanation:
        "Promise.all fails fast on the first rejection. allSettled never rejects; any rejects only if all reject; race settles on the first to settle either way.",
    },
    {
      q: "An async function always returns:",
      options: ["undefined", "The awaited value directly", "A Promise", "A generator"],
      answer: 2,
      explanation:
        "async functions always return a Promise. `return x` resolves it with x; a thrown error rejects it.",
    },
    {
      q: "You have two independent async calls. The fastest correct approach is:",
      options: [
        "await one, then await the other",
        "await Promise.all([callA(), callB()])",
        "Wrap both in setTimeout",
        "Use a for-await loop",
      ],
      answer: 1,
      explanation:
        "Sequential awaits run one after another. Promise.all starts both immediately and waits for both — parallel, so total time ≈ the slower one.",
    },
    {
      q: "Debounce vs throttle: to fire a search only after the user STOPS typing for 300ms, you use:",
      options: ["Throttle", "Debounce", "setInterval", "requestAnimationFrame"],
      answer: 1,
      explanation:
        "Debounce waits for a pause in activity, then fires once — ideal for search-as-you-type. Throttle fires at most once per interval during continuous activity (scroll).",
    },
    {
      q: "Event delegation means:",
      options: [
        "Adding a listener to every child element",
        "Attaching one listener to a common ancestor and using event.target",
        "Preventing events from bubbling",
        "Delegating events to a web worker",
      ],
      answer: 1,
      explanation:
        "One listener on a parent handles events from many (even dynamically-added) children via event.target/closest — fewer listeners, better for large lists.",
    },
  ],
  "react-fundamentals": [
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
  typescript: [
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
  performance: [
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
  "state-management": [
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
  nextjs: [
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
  scaling: [
    {
      q: "When scaling for high concurrency, which layer is usually the first bottleneck?",
      options: ["The CSS", "The database", "The favicon", "The bundler"],
      answer: 1,
      explanation:
        "The database is typically the first wall — addressed with indexing, read replicas, connection pooling, and caching.",
    },
  ],
  browser: [
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
  security: [
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
  "api-errors": [
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
  "design-systems": [
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
  "micro-frontends": [
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
  refactoring: [
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
  additions: [
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
  "react-hooks": [
    {
      q: "Why must hooks be called at the top level, never inside conditions or loops?",
      options: [
        "It's just a style convention",
        "React tracks hooks by call order; conditional calls shift the order and corrupt state",
        "It makes the bundle smaller",
        "Hooks are slower inside loops",
      ],
      answer: 1,
      explanation:
        "React associates each hook with its call index on every render. Skipping or reordering a call misaligns state with the wrong hook.",
    },
    {
      q: "When should you use the functional updater setCount(prev => prev + 1)?",
      options: [
        "Never — it's deprecated",
        "When the next state depends on the previous value (async/batched updates)",
        "Only inside useEffect",
        "Only for objects",
      ],
      answer: 1,
      explanation:
        "Because state updates are async/batched, reading the current value can be stale. The updater form always receives the latest state.",
    },
    {
      q: "A useEffect with an empty dependency array [] runs:",
      options: [
        "After every render",
        "Once after mount (cleanup on unmount)",
        "Never",
        "Only when props change",
      ],
      answer: 1,
      explanation:
        "[] means no dependencies change, so the effect runs once after mount and its cleanup runs on unmount. Omitting the array runs it every render.",
    },
    {
      q: "Which hook holds a mutable value across renders WITHOUT causing a re-render when it changes?",
      options: ["useState", "useRef", "useMemo", "useReducer"],
      answer: 1,
      explanation:
        "useRef's .current persists across renders and mutating it never triggers a render — used for DOM nodes and instance-like variables (timers, previous values).",
    },
    {
      q: "The main reason to wrap a callback in useCallback is:",
      options: [
        "It makes the function run faster",
        "To keep a stable function identity for a React.memo child or an effect dependency",
        "It's required for all event handlers",
        "To avoid closures",
      ],
      answer: 1,
      explanation:
        "useCallback preserves the function's reference between renders. Without a memoized child or a dep array consuming it, it does nothing useful.",
    },
    {
      q: "Every component consuming a Context re-renders when the context value changes. A good fix for rapidly-changing global state is:",
      options: [
        "Put everything in one big context",
        "Split contexts or use a store with selectors (e.g. Zustand)",
        "Use useRef instead of state",
        "Wrap consumers in useMemo",
      ],
      answer: 1,
      explanation:
        "Context has no selector granularity, so any change re-renders all consumers. Split by update frequency or use a selector-based store.",
    },
    {
      q: "useMemo vs useCallback:",
      options: [
        "They are identical",
        "useMemo caches a computed VALUE; useCallback caches a FUNCTION reference",
        "useCallback caches a value; useMemo caches a function",
        "Both only work in class components",
      ],
      answer: 1,
      explanation:
        "useMemo(fn, deps) returns the memoized return value; useCallback(fn, deps) returns the memoized function itself — equivalent to useMemo(() => fn, deps).",
    },
    {
      q: "useReducer is preferable to useState when:",
      options: [
        "You have a single boolean",
        "State is complex/interrelated or transitions follow well-defined actions",
        "You never update state",
        "You want to avoid re-renders",
      ],
      answer: 1,
      explanation:
        "A reducer centralizes complex update logic as a pure, testable function and handles multiple interdependent sub-values cleanly.",
    },
  ],
};

export function getQuiz(slug: string): Question[] {
  return QUIZZES[slug] ?? [];
}
