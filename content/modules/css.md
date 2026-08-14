# CSS Fundamentals

CSS controls presentation. In interviews the money topics are the box model, the cascade & specificity, positioning, and the two layout engines — Flexbox and Grid. Know these cold.

## The Box Model

Every element is a box with four layers, from inside out: **content → padding → border → margin**.

```css
.card {
  width: 300px;
  padding: 20px;
  border: 2px solid;
  margin: 16px;
}
```

- **`box-sizing: content-box`** (default): `width` = content only. The box above is actually `300 + 40 + 4 = 344px` wide. Surprising and error-prone.
- **`box-sizing: border-box`**: `width` includes padding + border, so the box stays `300px`. **Almost everyone sets this globally:**

```css
*, *::before, *::after { box-sizing: border-box; }
```

- **Margin collapsing**: adjacent vertical margins collapse to the *larger* of the two (not the sum). Horizontal margins never collapse. This trips people up constantly.

## The Cascade, Specificity & Inheritance

When multiple rules target an element, the winner is decided by:

1. **Importance** — `!important` beats everything (avoid it).
2. **Specificity** — a score `(inline, id, class, element)`:
   - Inline style = `1,0,0,0`
   - `#id` = `0,1,0,0`
   - `.class`, `[attr]`, `:hover` = `0,0,1,0`
   - element, `::before` = `0,0,0,1`
3. **Source order** — if specificity ties, the last rule wins.

```css
#nav .link { color: blue; }  /* 0,1,1,0 */
.link      { color: red; }   /* 0,0,1,0 — loses */
```

**Inheritance**: some properties inherit from parent to child by default (`color`, `font-*`, `line-height`, `visibility`); most don't (`margin`, `padding`, `border`, `width`). Force it with `inherit`, reset with `initial`, or use `unset`.

**Interviewers probe:** "How do you override a stubborn style without `!important`?" — increase specificity deliberately, or fix the offending selector. Reaching for `!important` is a smell.

## Selectors & Combinators

```css
.a .b      /* descendant: any .b inside .a */
.a > .b    /* child: direct children only */
.a + .b    /* adjacent sibling: .b immediately after .a */
.a ~ .b    /* general sibling: any .b after .a */
```

Useful pseudo-classes: `:hover`, `:focus`, `:focus-visible`, `:nth-child(2n)`, `:not(.x)`, `:first-child`/`:last-child`, `:checked`, `:disabled`, `:required`. Modern: `:is()`, `:where()` (zero specificity), `:has()` (the "parent selector").

**Pseudo-elements** (`::before`, `::after`, `::placeholder`, `::selection`) style a generated or sub-part; `::before`/`::after` need `content` to render.

## Positioning

`position` changes how an element is placed and what `top/right/bottom/left` mean:

- **`static`** (default) — normal flow; offsets ignored.
- **`relative`** — offset *from its normal position*; still occupies its original space. Also creates a positioning context for absolute children.
- **`absolute`** — removed from flow; positioned relative to the nearest *positioned* ancestor (or the initial containing block).
- **`fixed`** — removed from flow; positioned relative to the **viewport** (stays on scroll). A sticky/floating header.
- **`sticky`** — hybrid: behaves relative until it hits a scroll threshold, then sticks. Great for table headers.

```css
.parent { position: relative; }
.badge  { position: absolute; top: 0; right: 0; }
```

## Stacking Context & z-index

`z-index` only works on positioned elements (and flex/grid children). It's scoped to a **stacking context** — a `z-index: 9999` inside a low-context parent still can't escape above a sibling context.

New stacking contexts are created by: `position` + `z-index`, `opacity < 1`, `transform`, `filter`, `will-change`, `isolation: isolate`, and more. This is why "my z-index isn't working" — the element is trapped in a parent context.

## Flexbox (1-D layout)

Flexbox lays items along a single axis (row or column).

```css
.container {
  display: flex;
  flex-direction: row;         /* main axis */
  justify-content: space-between; /* align along MAIN axis */
  align-items: center;         /* align along CROSS axis */
  gap: 16px;
  flex-wrap: wrap;
}
.item { flex: 1; }             /* grow to fill; shorthand for grow/shrink/basis */
```

- **`justify-content`** = main axis; **`align-items`** = cross axis. Swap when `flex-direction: column`.
- **`flex: 1`** = `flex-grow:1; flex-shrink:1; flex-basis:0`. `flex: 0 0 200px` = fixed 200px, no grow/shrink.
- Centering anything: `display:flex; justify-content:center; align-items:center;`.

Use Flexbox for components: navbars, toolbars, card rows, centering.

## Grid (2-D layout)

Grid lays out rows **and** columns simultaneously.

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
/* Responsive auto-fit without media queries: */
.responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
```

- **`fr`** = fraction of free space. **`minmax(min, max)`** bounds a track.
- **`auto-fit`/`auto-fill`** + `minmax` = fluid card grids that reflow with no media queries.
- Place items with `grid-column: 1 / 3` (span) or named areas via `grid-template-areas`.

**Flexbox vs Grid:** Flexbox = content-driven, one dimension. Grid = layout-driven, two dimensions. They compose (a grid cell can be a flex container).

## Units: px, em, rem, %, vw/vh

- **`px`** — absolute, predictable.
- **`rem`** — relative to the **root** `font-size` (usually 16px). Best for scalable, consistent spacing/typography. `1.5rem = 24px`.
- **`em`** — relative to the **element's own** `font-size`; compounds when nested (can surprise you).
- **`%`** — relative to the parent's corresponding dimension.
- **`vw`/`vh`** — 1% of viewport width/height. **`vmin`/`vmax`**, and modern **`dvh`** (dynamic viewport height) fix the mobile-URL-bar issue.
- **`clamp(min, preferred, max)`** — fluid responsive sizing in one line: `font-size: clamp(1rem, 2.5vw, 2rem);`.

## Responsive Design & Media Queries

**Mobile-first**: write base styles for small screens, then layer enhancements with `min-width` queries.

```css
.grid { grid-template-columns: 1fr; }         /* mobile default */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

Also useful: `@media (prefers-color-scheme: dark)`, `@media (prefers-reduced-motion: reduce)`, `@media (hover: hover)`. Modern **container queries** (`@container`) let a component respond to its *container's* width rather than the viewport.

## Custom Properties (CSS Variables)

```css
:root { --brand: #6d28d9; --space: 8px; }
.button { background: var(--brand); padding: calc(var(--space) * 2); }
.dark   { --brand: #a78bfa; }  /* re-theme by overriding the variable */
```

Unlike Sass variables, CSS custom properties are **live at runtime**, cascade, inherit, and can be read/changed with JS (`getComputedStyle` / `element.style.setProperty`). The backbone of theming and design tokens.

## Transitions & Animations

```css
.button { transition: background 0.2s ease, transform 0.2s ease; }
.button:hover { transform: translateY(-2px); }

@keyframes spin { to { transform: rotate(360deg); } }
.loader { animation: spin 1s linear infinite; }
```

**Performance:** animate only **`transform`** and **`opacity`** — they're GPU-composited and skip layout/paint. Animating `width`, `top`, `margin`, or `box-shadow` forces layout/paint on every frame and janks. Hint the browser with `will-change: transform` sparingly.

## Common Layout Tools

- **Centering** — modern: `display:grid; place-items:center;`. Or flex centering.
- **Truncation** — `white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`.
- **`overflow`** — `hidden`/`auto`/`scroll`; creates a block formatting context (contains floats/margins).
- **`float`** — legacy layout; today only for wrapping text around an image.
- **Naming methodology** — **BEM** (`block__element--modifier`) keeps specificity flat and predictable; utility-first (Tailwind) trades verbosity for zero naming and no dead CSS.
