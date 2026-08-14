# JavaScript: Async & Advanced

Asynchrony is the other half of the JS interview. If you can explain the event loop, promises, and async/await clearly — with the microtask/macrotask ordering — you're ahead of most candidates.

## The Event Loop, Call Stack & Queues

JavaScript is **single-threaded**: one call stack, one thing at a time. Yet it handles timers, network, and events without blocking. How?

The moving parts:
- **Call stack** — where function frames run (LIFO).
- **Web APIs** — the browser (not JS) handles `setTimeout`, `fetch`, DOM events, off-thread.
- **Callback / Task queue (macrotasks)** — completed `setTimeout`, events, I/O callbacks wait here.
- **Microtask queue** — resolved Promise `.then`/`catch`/`finally`, `queueMicrotask`, `await` continuations. **Higher priority.**
- **Event loop** — when the stack is empty, it drains **all microtasks**, then takes **one** macrotask, then drains microtasks again, and so on.

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);   // macrotask
Promise.resolve().then(() => console.log("3")); // microtask
console.log("4");
// Output: 1, 4, 3, 2
```

Synchronous code runs first (`1`, `4`). Then the loop empties **all** microtasks (`3`) before any macrotask (`2`) — even with `setTimeout(…, 0)`. This ordering question is extremely common.

**Key insight:** microtasks always run before the next macrotask. A flood of promise callbacks can starve `setTimeout`/rendering.

## Callbacks & Callback Hell

A **callback** is a function passed to be invoked later. Before promises, async flow nested callbacks:

```javascript
getUser(id, (user) => {
  getOrders(user, (orders) => {
    getDetails(orders[0], (details) => { /* pyramid of doom */ });
  });
});
```

Problems: deep nesting ("callback hell"), scattered error handling (each callback checks its own error), and **inversion of control** (you trust a library to call your callback correctly, once). Promises fix all three.

## Promises

A **Promise** is an object representing the eventual result of an async operation. It has three states: **pending → fulfilled** (resolved with a value) or **rejected** (with a reason). Once settled, it never changes.

```javascript
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done"), 100);
});
p.then(v => console.log(v))       // "done"
 .catch(err => console.error(err)) // handles any rejection in the chain
 .finally(() => console.log("cleanup"));
```

- **Chaining**: each `.then` returns a *new* promise, flattening nesting into a readable pipeline. Returning a value passes it on; returning a promise waits for it.
- **Error propagation**: one `.catch` at the end handles rejections from anywhere earlier in the chain.
- **A `.then` always runs as a microtask**, even if the promise is already resolved.

## Promise Combinators

```javascript
Promise.all([a, b, c])        // waits for ALL; rejects fast if ANY rejects
Promise.allSettled([a, b, c]) // waits for all; never rejects — array of {status, value/reason}
Promise.race([a, b])          // settles as soon as the FIRST settles (fulfill or reject)
Promise.any([a, b])           // first FULFILLED; rejects only if all reject (AggregateError)
```

- **`all`** — parallel requests where you need every result (fails fast).
- **`allSettled`** — parallel where you want every outcome regardless of failures (dashboards).
- **`race`** — timeouts (`race([fetch(), timeout()])`).
- **`any`** — first success wins (fastest mirror).

Running independent requests in **parallel** with `Promise.all` instead of sequential `await`s is a classic perf fix.

## async / await

Syntactic sugar over promises that lets you write async code that *reads* synchronously.

```javascript
async function loadDashboard(id) {
  try {
    // parallel — start both, then await
    const [user, orders] = await Promise.all([getUser(id), getOrders(id)]);
    return { user, orders };
  } catch (err) {
    console.error("failed", err);
    throw err;
  }
}
```

- An `async` function **always returns a promise**. `return x` resolves it with `x`; `throw` rejects it.
- **`await`** pauses the function until the promise settles, unwrapping the value — but the thread is *not* blocked; the event loop keeps running other code.
- Use **`try/catch`** for errors (vs `.catch`).
- **Pitfall:** sequential `await`s that don't depend on each other run slower than needed — parallelize with `Promise.all`.
- **`await` in a loop** is sequential; use `Promise.all(items.map(async …))` for concurrency.

## setTimeout, setInterval & the "0ms" Myth

- `setTimeout(fn, 0)` doesn't run immediately — it queues a **macrotask** that runs after the current stack clears *and* all microtasks drain. The delay is a *minimum*, not a guarantee.
- `setInterval` can drift and stack up if the callback is slow; a recursive `setTimeout` is often safer.
- `requestAnimationFrame` runs before the next repaint (~60fps) — use it for animations, not `setTimeout`.

## Debounce & Throttle

Two closure-based techniques to rate-limit expensive handlers (scroll, resize, keypress, search).

- **Debounce** — wait until activity *stops* for N ms, then fire once. (Search-as-you-type: fire after the user pauses.)
- **Throttle** — fire at most once every N ms during continuous activity. (Scroll/resize handlers.)

```javascript
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function throttle(fn, limit) {
  let waiting = false;
  return (...args) => {
    if (waiting) return;
    fn(...args);
    waiting = true;
    setTimeout(() => (waiting = false), limit);
  };
}
```

Both are quintessential closure use-cases — the `timer`/`waiting` state is private and persists across calls.

## Event Propagation & Delegation

A DOM event travels in phases: **capturing** (window → target) then **bubbling** (target → window). Most handlers listen on the bubbling phase.

- **`event.stopPropagation()`** halts travel; **`event.preventDefault()`** cancels the default action (form submit, link nav) but still bubbles.
- **Event delegation**: attach *one* listener to a common ancestor and read `event.target` instead of binding a listener per child. Efficient for large/dynamic lists.

```javascript
list.addEventListener("click", (e) => {
  const item = e.target.closest("li");
  if (item) handle(item.dataset.id);
});
```

## Currying, Partial Application & Composition

- **Currying** — transform `f(a, b, c)` into `f(a)(b)(c)`; each call takes one arg and returns a function until all are supplied.
- **Partial application** — pre-fill some arguments now, the rest later (`fn.bind(null, a)`).
- **Composition** — combine small functions: `compose(f, g)(x) = f(g(x))`.

```javascript
const add = a => b => a + b;   // curried
const add5 = add(5);
add5(3); // 8
```

Useful for building configurable, reusable functions and is the backbone of functional-programming utilities.

## Memoization

Caching a function's result by its arguments so repeated calls are instant — a closure holding a cache:

```javascript
function memoize(fn) {
  const cache = new Map();
  return (arg) => {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}
```

Same idea powers `React.memo`, `useMemo`, and `reselect` selectors. Trade memory for speed; watch cache growth.

## ES Modules

```javascript
export const x = 1;              // named export
export default function App(){}   // default export
import App, { x } from "./file"; // import default + named
```

- **ESM** (`import`/`export`) is static — the dependency graph is known at build time, enabling **tree-shaking** (dead-code elimination) and bundler optimization.
- **CommonJS** (`require`/`module.exports`) is dynamic and runtime-evaluated (Node's legacy system).
- Modules have their own scope (no global leakage) and run in strict mode; imports are **live read-only bindings**, not copies.

## Generators & Iterators (brief)

A **generator** (`function*`) can pause with `yield` and resume, producing values lazily:

```javascript
function* ids() { let i = 1; while (true) yield i++; }
const gen = ids();
gen.next().value; // 1
gen.next().value; // 2
```

Any object with a `Symbol.iterator` is **iterable** (works with `for…of`, spread). Generators power lazy sequences and underpinned libraries like redux-saga.

## Error Handling

```javascript
try {
  risky();
} catch (err) {
  if (err instanceof TypeError) { /* specific */ }
  report(err);
} finally {
  cleanup(); // always runs
}
```

- Synchronous errors → `try/catch`. Promise rejections → `.catch` or `try/catch` around `await`.
- Throw `Error` objects (they carry a stack), not strings.
- Unhandled promise rejections should be caught globally (`window.onunhandledrejection`) in production.
- Fail loudly in dev, degrade gracefully in prod (fallback UI, retries).
