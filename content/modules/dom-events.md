# DOM, Events & Browser APIs

The DOM is the bridge between your HTML and your JavaScript. Interviewers probe it because it separates people who *use* a framework from people who *understand the platform underneath it*. This covers how the DOM is built, how you read and change it, how events actually travel through the tree, client-side routing with the History API, and the observer APIs modern apps lean on.

## The DOM tree

When the browser parses your HTML, it builds the **DOM (Document Object Model)** — an in-memory tree of node objects. Each element, attribute, and piece of text becomes a node.

```
document
 └─ <html>
     ├─ <head>
     │   └─ <title> → "Page"  (text node)
     └─ <body>
         ├─ <h1> → "Hello"
         └─ <p class="lead"> → "Welcome"
```

Key points interviewers listen for:

- **HTML is the source text; the DOM is the live object model.** They can diverge — the browser fixes invalid markup, and JS mutations change the DOM without changing the original HTML.
- **Node vs Element.** A `Node` is any tree member (elements, text, comments). An `Element` is specifically a tag. `node.childNodes` includes text/whitespace nodes; `element.children` includes only element nodes.
- **The DOM is language-agnostic** — it's a browser API exposed to JS, not part of JavaScript itself.

```js
const p = document.querySelector("p.lead");
p.nodeType;        // 1  (ELEMENT_NODE) — text nodes are 3
p.parentElement;   // <body>
p.nextElementSibling; // null here
p.textContent;     // "Welcome"
```

## Querying the DOM

```js
document.getElementById("main");          // fastest, single element
document.querySelector(".card");          // first match, any CSS selector
document.querySelectorAll(".card");        // ALL matches (static NodeList)
document.getElementsByClassName("card");   // LIVE HTMLCollection
document.getElementsByTagName("li");       // LIVE HTMLCollection
```

The distinction interviewers love:

| Method | Returns | Live? |
|---|---|---|
| `querySelectorAll` | static `NodeList` | ❌ No — a snapshot |
| `getElementsByClassName` / `getElementsByTagName` | `HTMLCollection` | ✅ Yes — auto-updates |

A **live** collection reflects later DOM changes automatically; a **static** one is frozen at query time. Iterating a live collection while mutating it is a classic bug (the collection shifts under you).

```js
// NodeList supports forEach; HTMLCollection does NOT
document.querySelectorAll("li").forEach(el => el.classList.add("done"));
// For an HTMLCollection, convert first:
[...document.getElementsByClassName("li")].forEach(/* ... */);
```

Scope queries to a subtree by calling them on an element (`card.querySelector(".title")`) rather than always on `document` — it's faster and avoids matching unrelated nodes.

## Manipulating the DOM

```js
const li = document.createElement("li");
li.textContent = "New item";       // safe: sets text, escapes HTML
li.classList.add("item");
list.append(li);                    // add to end
list.prepend(li);                   // add to start
li.remove();                        // delete
li.replaceWith(otherNode);
```

**`textContent` vs `innerHTML` vs `innerText`:**

- `textContent` — raw text of all descendants; fast; **does not parse HTML** (XSS-safe for untrusted data).
- `innerHTML` — parses a string as HTML and rebuilds the subtree. Powerful but **dangerous with untrusted input** (injection).
- `innerText` — like textContent but *layout-aware* (respects CSS visibility, triggers reflow) — slower.

**Batch DOM writes.** Every layout-affecting change can trigger reflow. Building many nodes? Assemble them off-screen in a `DocumentFragment`, then insert once:

```js
const frag = document.createDocumentFragment();
for (const item of items) {
  const li = document.createElement("li");
  li.textContent = item;
  frag.append(li);
}
list.append(frag); // single reflow instead of N
```

## Attributes vs properties

This trips people up constantly. An **attribute** is what's written in the HTML string; a **property** is a field on the DOM object. They're linked but not identical.

```html
<input id="name" value="Alice">
```
```js
const input = document.getElementById("name");
input.getAttribute("value"); // "Alice" — the INITIAL html attribute
input.value = "Bob";          // user/JS changes the live PROPERTY
input.getAttribute("value"); // still "Alice"  (attribute = default)
input.value;                  // "Bob"          (property = current state)
```

- The **attribute** reflects the *initial/default* value from HTML.
- The **property** reflects the *current live* value.
- Some pairs have different names/types: `class` attribute ↔ `className` property; `for` ↔ `htmlFor`; `checked` attribute is the default, `.checked` property is live boolean.
- Custom data goes in `data-*` attributes, read via the `dataset` property: `el.dataset.userId`.

## The event model: capture, target, bubble

When an event fires (say a click on a button), it travels through the DOM tree in **three phases**:

1. **Capture phase** — from `document` *down* to the target's parent.
2. **Target phase** — the event reaches the actual element clicked.
3. **Bubble phase** — from the target *up* through its ancestors back to `document`.

```
   capture ↓            ↑ bubble
document → body → ul → [li]  (target)
```

`addEventListener` listens in the **bubble** phase by default. Pass `{ capture: true }` (or `true` as the 3rd arg) to listen during capture.

```js
ul.addEventListener("click", handler);                 // bubble (default)
ul.addEventListener("click", handler, { capture: true }); // capture
ul.addEventListener("click", handler, { once: true });    // auto-removes after 1 call
ul.addEventListener("click", handler, { passive: true }); // promises no preventDefault (better scroll perf)
```

Inside a handler:
- `event.target` — the element that actually triggered the event (deepest node).
- `event.currentTarget` — the element the listener is attached to (equals `this`).
- `event.eventPhase` — 1 capture, 2 target, 3 bubble.

## preventDefault vs stopPropagation

These do **completely different** things — a favorite gotcha:

- **`event.preventDefault()`** — cancels the browser's *default action* (following a link, submitting a form, checking a box). It does **not** stop propagation.
- **`event.stopPropagation()`** — stops the event from traveling further through capture/bubble. It does **not** cancel the default action.
- **`event.stopImmediatePropagation()`** — stops propagation *and* prevents other listeners on the *same* element from running.

```js
form.addEventListener("submit", (e) => {
  e.preventDefault();      // stop the page reload
  // ...validate and submit via fetch instead
});

link.addEventListener("click", (e) => {
  e.stopPropagation();     // parent's click handler won't fire
  // ...but the link still navigates unless you also preventDefault()
});
```

Returning `false` from an inline handler does both, but in `addEventListener` handlers the return value is ignored — call the methods explicitly.

## Event delegation

Because events **bubble**, you can attach **one** listener to a common ancestor instead of one per child. Inside, use `event.target.closest(...)` to find the relevant element.

```js
// Instead of a listener on every <li>:
list.addEventListener("click", (e) => {
  const item = e.target.closest("li");
  if (!item || !list.contains(item)) return;
  toggleDone(item.dataset.id);
});
```

Why it's the right default:

- **Fewer listeners** → less memory, faster setup for large lists.
- **Works for elements added later** — dynamically inserted children are handled automatically, no re-binding.
- **Centralized logic** — one place to reason about.

Caveats: some events don't bubble (`focus`, `blur`, `scroll`) — use their bubbling counterparts (`focusin`/`focusout`) or capture. Always narrow with `closest`/`matches` so you only act on intended targets.

## The History API & client-side routing

Single-page apps change the URL **without a full page reload**. That's the History API — the engine under React Router / Next.js navigation.

```js
// Add a new entry (back button will return to the previous one)
history.pushState({ page: 2 }, "", "/products?page=2");

// Replace the current entry (no new back-button step)
history.replaceState({ page: 1 }, "", "/products");

history.back();     // like the back button
history.forward();
history.go(-2);     // jump 2 entries back

// Fires when the user navigates history (back/forward)
window.addEventListener("popstate", (e) => {
  render(e.state);  // the state object you stored
});
```

Interview points:

- `pushState`/`replaceState` change the URL and history stack **without** hitting the server — the router then renders the matching view in JS.
- **`popstate` only fires for history navigation** (back/forward or `history.go`), **not** when you call `pushState` yourself — so routers manually render after pushing.
- Compare to the old `location.hash` / `hashchange` approach (URLs with `#`), which didn't need server config but is uglier and non-semantic.
- The server must be configured to return the app for deep links (e.g. `/products/42` should serve `index.html`), or a hard refresh 404s.

## Essential Web APIs & Observers

Modern apps offload work to purpose-built browser APIs instead of polling in JS.

**IntersectionObserver** — asynchronously tells you when an element enters/leaves the viewport (or a scroll container). Powers lazy-loading, infinite scroll, and visibility analytics without expensive scroll listeners.

```js
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      loadImage(entry.target);
      io.unobserve(entry.target); // load once
    }
  }
}, { rootMargin: "200px" }); // start 200px early
document.querySelectorAll("img[data-src]").forEach(img => io.observe(img));
```

**ResizeObserver** — fires when an *element's* size changes (not just the window). The correct tool for responsive components that react to their own container, replacing hacky window-resize listeners.

**MutationObserver** — notifies you when the DOM subtree changes (nodes added/removed, attributes changed). Useful for integrating with third-party widgets.

**Timers & scheduling:**

- `setTimeout` / `setInterval` — macrotasks; minimum ~4ms clamp for nested timers; `0` is not really 0.
- `requestAnimationFrame(cb)` — runs right before the next paint (~60fps), auto-pauses in background tabs. The right way to animate.
- `requestIdleCallback(cb)` — runs low-priority work when the main thread is idle.
- `queueMicrotask(cb)` — schedules a microtask (runs before the next paint/macrotask), same queue as Promise callbacks.

**`fetch` & the network** — the modern promise-based replacement for `XMLHttpRequest`:

```js
const res = await fetch("/api/users", { signal: controller.signal });
if (!res.ok) throw new Error(res.status); // fetch only rejects on network failure, NOT on 4xx/5xx!
const data = await res.json();
```

A crucial gotcha: **`fetch` does not reject on HTTP error statuses** (404, 500) — the promise resolves; you must check `res.ok` yourself. (Cancellation with `AbortController` and race conditions are covered in the HTTP & Networking module.)
