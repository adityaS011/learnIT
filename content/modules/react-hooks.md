# React Hooks — Complete Guide

Hooks let function components use state, lifecycle, context, and more. This walks every built-in hook, when to reach for it, and the gotchas interviewers love.

## The Rules of Hooks

Two non-negotiable rules — the linter enforces them for a reason:

1. **Only call hooks at the top level** — never inside conditions, loops, or nested functions. React tracks hooks *by call order*; conditional calls shift the order and corrupt state.
2. **Only call hooks from React functions** — components or custom hooks, not plain JS functions.

```javascript
// ❌ breaks the order
if (loggedIn) { const [x, setX] = useState(0); }
// ✅ call unconditionally, branch inside
const [x, setX] = useState(0);
if (loggedIn) { /* use x */ }
```

## useState

Adds local state to a component. Returns `[value, setter]`.

```javascript
const [count, setCount] = useState(0);
setCount(count + 1);            // direct
setCount(prev => prev + 1);     // functional updater — use when new state depends on old
```

- **Use the functional updater** (`prev => …`) when the next value derives from the current one, especially in async callbacks or batched updates — avoids stale values.
- **State updates are asynchronous & batched.** Reading `count` right after `setCount` gives the old value; the re-render reflects the new one.
- **Lazy initialization**: `useState(() => expensiveInit())` runs the initializer only on the first render.
- Replacing objects/arrays must be **immutable**: `setUser({ ...user, name })`, never `user.name = …`.

## useEffect

Runs side effects *after* render (data fetching, subscriptions, timers, manual DOM, logging).

```javascript
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // cleanup: runs on unmount & before re-running
}, [/* deps */]);
```

The dependency array controls when it runs:
- **`[]`** — once after mount (and cleanup on unmount).
- **`[a, b]`** — after mount and whenever `a` or `b` change.
- **omitted** — after *every* render (rarely what you want).

**Gotchas:**
- **Cleanup** prevents leaks (listeners, timers, subscriptions) and cancels stale work.
- **Exhaustive deps** — every value from component scope used inside must be in the array, or you get stale closures. Don't lie to the linter; fix the cause (functional updates, `useCallback`, moving code).
- **Not for derived data** — compute during render instead of syncing with an effect.
- Effects run only on the **client**, after paint.

## useLayoutEffect

Same API as `useEffect`, but fires **synchronously after DOM mutations, before the browser paints**. Use it only when you must *measure* the DOM and *mutate* it before the user sees a flicker (tooltips, popovers, scroll position). Overuse blocks paint and hurts performance. Warns during SSR (no DOM on the server).

## useContext

Reads a Context value without prop-drilling.

```javascript
const ThemeContext = createContext("light");
// provider high in the tree
<ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
// any descendant
const theme = useContext(ThemeContext);
```

- Every consumer **re-renders when the context value changes** — so don't put rapidly-changing state in a single wide context (split contexts, or use a store with selectors like Zustand).
- Memoize the provider `value` (`useMemo`) so a new object identity each render doesn't force all consumers to re-render.
- Great for low-frequency global data: theme, current user, locale.

## useReducer

State management for **complex or interrelated state**, or when the next state depends on the previous via well-defined actions.

```javascript
function reducer(state, action) {
  switch (action.type) {
    case "inc": return { count: state.count + 1 };
    case "reset": return { count: 0 };
    default: return state;
  }
}
const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: "inc" });
```

Prefer over `useState` when: multiple sub-values change together, transitions are complex, or you want to centralize update logic (easier to test — the reducer is a pure function). Pairs well with Context for a lightweight Redux-like pattern.

## useRef

A mutable container whose `.current` **persists across renders without causing a re-render**.

```javascript
const inputRef = useRef(null);      // DOM ref
<input ref={inputRef} />;
inputRef.current.focus();

const renders = useRef(0);          // instance variable
renders.current++;                  // mutating does NOT re-render
```

Two uses: (1) **accessing DOM nodes** (focus, measure, integrate non-React libs), and (2) **holding a mutable value** across renders (previous value, timer id, latest-props) *without* triggering renders. Changing a ref never re-renders — that's the whole point.

## useMemo

Memoizes an **expensive computed value**, recomputing only when dependencies change.

```javascript
const sorted = useMemo(() => bigList.slice().sort(cmp), [bigList]);
```

Use for genuinely costly calculations, or to keep a **stable object/array reference** so `React.memo` children and effect deps don't fire needlessly. Don't wrap everything — memoization has its own cost, and premature use adds noise.

## useCallback

Memoizes a **function reference** so it stays stable between renders.

```javascript
const handleClick = useCallback(() => doThing(id), [id]);
```

`useCallback(fn, deps)` ≡ `useMemo(() => fn, deps)`. It matters when the function is passed to a `React.memo`-wrapped child (so the child doesn't re-render) or used as an effect dependency. Without a memoized child or a dep array consuming it, `useCallback` does nothing useful.

## useImperativeHandle

Customizes the ref value a parent receives when using `forwardRef` — expose a small imperative API instead of the raw DOM node.

```javascript
const Input = forwardRef((props, ref) => {
  const inner = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => inner.current.focus(),
    clear: () => (inner.current.value = ""),
  }));
  return <input ref={inner} {...props} />;
});
```

Use sparingly — imperative escapes hatch the declarative model. Good for reusable inputs, media players, modals.

## useTransition & useDeferredValue (concurrency)

React 18 tools to keep the UI responsive during heavy updates by marking work **non-urgent**.

```javascript
const [isPending, startTransition] = useTransition();
startTransition(() => setQuery(input)); // low-priority; input stays snappy

const deferredQuery = useDeferredValue(query); // render heavy list off the deferred value
```

- **`useTransition`** — wrap state updates that trigger expensive renders; `isPending` lets you show a subtle loading state while urgent updates (typing) stay instant.
- **`useDeferredValue`** — derive a "lagging" copy of a value so an expensive child renders behind the responsive one. Use when you don't own the setter.

## useId

Generates a **stable, unique, SSR-safe id** — for linking labels to inputs / ARIA attributes without collisions or hydration mismatches.

```javascript
const id = useId();
<label htmlFor={id}>Email</label>
<input id={id} />
```

Don't use it for list keys — it's for accessibility ids, not data identity.

## useSyncExternalStore

The official way to subscribe a component to an **external store** (outside React state) so it stays consistent with concurrent rendering. It's what libraries like Zustand/Redux use internally.

```javascript
const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
```

You rarely call it directly in app code — but knowing *why* it exists (tearing-free reads under concurrency) is a strong interview answer.

## use (React 19)

The new `use` API reads the value of a **promise or context** during render, integrating with Suspense. Unlike other hooks, it *can* be called conditionally and inside loops.

```javascript
const data = use(fetchDataPromise); // suspends until resolved
```

Signals React's direction: data fetching that suspends, driven by Server Components and Suspense.

## Custom Hooks

Extract reusable stateful logic into a `useXxx` function that calls other hooks. This is composition — the primary way to share logic between components (replacing old HOCs / render props).

```javascript
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
```

Rules: name it `use…`, call hooks unconditionally inside, return whatever shape is convenient. Each component using the hook gets its **own isolated state** — hooks share logic, not state.

## Quick Reference — Which Hook?

| Need | Hook |
|------|------|
| Local state | `useState` (or `useReducer` if complex) |
| Side effect after render | `useEffect` |
| Measure/mutate DOM before paint | `useLayoutEffect` |
| Read global-ish value | `useContext` |
| DOM node or mutable non-render value | `useRef` |
| Cache expensive value | `useMemo` |
| Stable function identity | `useCallback` |
| Expose imperative API via ref | `useImperativeHandle` + `forwardRef` |
| Keep UI responsive on heavy updates | `useTransition` / `useDeferredValue` |
| SSR-safe unique id | `useId` |
| Subscribe to external store | `useSyncExternalStore` |
| Reusable stateful logic | Custom hook |
