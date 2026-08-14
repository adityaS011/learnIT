# HTML Fundamentals

HTML is the structure layer of the web. Interviewers use it to check whether you understand semantics, accessibility, forms, and how the browser actually loads a document — not whether you can memorize every tag.

## Semantic HTML & Why It Matters

**Semantic HTML** means using elements that describe the *meaning* of content, not just its appearance. `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`, `<figure>` — versus wrapping everything in `<div>` ("div soup").

Why it matters:
- **Accessibility** — screen readers build a navigable landmark map from semantic tags. A `<nav>` is announced as navigation; a `<div class="nav">` is not.
- **SEO** — search engines weight content in `<main>`/`<article>` and use headings to understand structure.
- **Maintainability** — the markup is self-documenting.

```html
<!-- Div soup -->
<div class="header"><div class="nav">…</div></div>
<div class="main"><div class="article">…</div></div>

<!-- Semantic -->
<header><nav>…</nav></header>
<main><article>…</article></main>
```

**Heading order matters:** exactly one `<h1>` per page (the page's topic), and don't skip levels (`<h1>` → `<h3>`) — assistive tech uses the outline.

**Interviewers probe:** "What's the difference between `<section>` and `<div>`?" — `<section>` is a thematic grouping that should have a heading; `<div>` carries no meaning and is a pure styling/scripting hook.

## The Document, DOCTYPE & `<head>`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Page Title</title>
    <meta name="description" content="Summary for search results" />
  </head>
  <body>…</body>
</html>
```

- **`<!DOCTYPE html>`** — triggers *standards mode*. Without it, browsers fall back to *quirks mode* (legacy, buggy box model). It is not an HTML tag; it's an instruction to the parser.
- **`lang="en"`** — helps screen readers pick the right pronunciation and helps translation tools.
- **`<meta charset="UTF-8">`** — must appear early so bytes are decoded correctly.
- **The viewport meta** — essential for responsive design; without it, mobile browsers render at a fake 980px width and zoom out.

## Block vs Inline (and `inline-block`)

- **Block** elements (`<div>`, `<p>`, `<h1>`, `<section>`) start on a new line and take full available width. Width/height/margins all apply.
- **Inline** elements (`<span>`, `<a>`, `<strong>`, `<em>`) flow within text, take only as much width as their content, and **ignore `width`/`height` and vertical margins**.
- **`inline-block`** flows inline but respects `width`/`height`/margins — useful for things like nav items.

This is really a CSS `display` concept, but it originates from an element's default HTML behavior.

## Forms & Input Types

Forms are the highest-value HTML topic for interviews because they touch UX, validation, and accessibility.

```html
<form action="/submit" method="post">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required autocomplete="email" />

  <label for="pw">Password</label>
  <input id="pw" name="pw" type="password" minlength="8" required />

  <button type="submit">Sign in</button>
</form>
```

Key points:
- **`<label>` + `for`/`id`** — clicking the label focuses the input and screen readers announce it. Always pair them (or wrap the input in the label).
- **`name`** — the key sent to the server; without it, the field isn't submitted.
- **Input types** carry semantics + mobile keyboards + free validation: `email`, `number`, `tel`, `url`, `date`, `search`, `password`, `file`, `checkbox`, `radio`, `range`, `color`.
- **Native validation attributes:** `required`, `minlength`/`maxlength`, `min`/`max`, `pattern`, `type="email"`. Style with `:valid` / `:invalid`.
- **`method`:** `GET` puts data in the URL query string (searches, bookmarkable, not for secrets); `POST` puts it in the body (mutations, sensitive data).

**`<button type>` gotcha:** inside a form, a `<button>` defaults to `type="submit"`. Use `type="button"` for buttons that shouldn't submit (e.g. a "show password" toggle).

## Loading Scripts: `async` vs `defer`

Where and how you load JS dramatically affects performance.

```html
<script src="app.js"></script>            <!-- blocks parsing while it downloads + runs -->
<script src="app.js" async></script>       <!-- downloads in parallel, runs ASAP (order not guaranteed) -->
<script src="app.js" defer></script>       <!-- downloads in parallel, runs after HTML parse, in order -->
```

| Attribute | Download | Execution | Order preserved? | Use for |
|-----------|----------|-----------|------------------|---------|
| (none) | Blocks parser | Immediately | Yes | Rarely; blocks render |
| `async` | Parallel | As soon as ready | **No** | Independent scripts (analytics) |
| `defer` | Parallel | After DOM parsed, before `DOMContentLoaded` | **Yes** | App code that needs the DOM |

**Rule of thumb:** put `<script defer>` in the `<head>`, or a plain `<script>` at the end of `<body>`. `defer` is the safe default for app bundles.

## Accessibility (a11y) Essentials

- **Semantic tags first** — a real `<button>` is focusable, keyboard-activatable, and announced correctly. A `<div onclick>` is none of these.
- **`alt` on images** — describe the content; use `alt=""` for purely decorative images so they're skipped.
- **ARIA** — `aria-label`, `aria-labelledby`, `aria-describedby`, `role`, `aria-expanded`, `aria-hidden`. **First rule of ARIA: don't use ARIA if a native element does the job.**
- **Keyboard navigation** — everything interactive must be reachable and operable with `Tab`/`Enter`/`Space`. Manage focus in modals.
- **Labels & names** — every form control needs an accessible name (label, `aria-label`, etc.).
- **Color contrast** — WCAG AA needs 4.5:1 for normal text.

## `data-*` Attributes

Custom attributes to attach data to elements without abusing `class` or `id`:

```html
<button data-product-id="42" data-price="9.99">Buy</button>
```
```javascript
const el = document.querySelector("button");
el.dataset.productId; // "42"  (camelCased)
el.dataset.price;     // "9.99"
```

Great for hooking JS behavior or passing small bits of state to the DOM. Don't store large or sensitive data here — it's visible in the markup.

## Storage: Cookies vs localStorage vs sessionStorage

| | Cookies | localStorage | sessionStorage |
|--|---------|--------------|----------------|
| Capacity | ~4 KB | ~5–10 MB | ~5–10 MB |
| Sent to server | Yes, every request | No | No |
| Expiry | Configurable | Never (until cleared) | On tab close |
| Access | JS (unless `HttpOnly`) | JS only | JS only |
| Use for | Auth/session tokens | Persistent client prefs | Per-tab temporary state |

- **`HttpOnly` cookies** can't be read by JS — the standard defense for auth tokens against XSS.
- **`Secure`** sends the cookie only over HTTPS; **`SameSite`** mitigates CSRF.
- localStorage is synchronous and string-only (`JSON.stringify` your objects).

## Images, Media & Responsive Assets

- **`srcset` + `sizes`** — serve the right resolution per device, saving bandwidth:
  ```html
  <img src="small.jpg"
       srcset="small.jpg 480w, large.jpg 1080w"
       sizes="(max-width: 600px) 480px, 1080px"
       alt="…" />
  ```
- **`<picture>`** — art direction / modern formats with fallback:
  ```html
  <picture>
    <source srcset="hero.avif" type="image/avif" />
    <source srcset="hero.webp" type="image/webp" />
    <img src="hero.jpg" alt="…" />
  </picture>
  ```
- **`loading="lazy"`** — defer offscreen images until near the viewport.
- Always set `width`/`height` (or `aspect-ratio`) to reserve space and avoid layout shift (CLS).

## Meta, SEO & Open Graph

- **`<title>`** and **`<meta name="description">`** — what shows in search results.
- **Open Graph** (`og:title`, `og:image`, `og:description`) — controls link previews on social platforms.
- **Canonical** (`<link rel="canonical">`) — tells search engines the primary URL to avoid duplicate-content penalties.
- **`robots`** meta — `noindex`/`nofollow` to control crawling.

**Interviewers probe:** "How do you make a single-page app SEO-friendly?" — server-render (SSR/SSG) so crawlers get real HTML, set proper titles/meta per route, and use semantic markup.
