# JavaScript Core

JavaScript is where most frontend theory rounds are won or lost. This covers the mechanics interviewers return to again and again: types, scope, closures, `this`, and prototypes.

## Data Types & typeof

JS has **7 primitives** — `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint` — plus **objects** (arrays, functions, dates, etc. are all objects).

- **Primitives are immutable and copied by value.** `let a = 1; let b = a; b++` leaves `a === 1`.
- **Objects are copied by reference.** `let o = {}; let p = o; p.x = 1` also mutates `o`.

```javascript
typeof "hi"        // "string"
typeof 42          // "number"
typeof undefined   // "undefined"
typeof null        // "object"   ← historical bug, memorize it
typeof function(){} // "function"
typeof []          // "object"   → use Array.isArray([]) instead
```

- **`null` vs `undefined`**: `undefined` = a variable declared but not assigned (the engine's "nothing"). `null` = an intentional "no value" you assign.
- Check with `Number.isNaN`, `Array.isArray`, and `===`.

## var vs let vs const, Hoisting & the TDZ

```javascript
console.log(x); // undefined  (var is hoisted & initialized to undefined)
var x = 5;

console.log(y); // ReferenceError (TDZ)
let y = 5;
```

- **Hoisting**: declarations are moved to the top of their scope at compile time. `var` is hoisted **and** initialized to `undefined`. `let`/`const` are hoisted but **not initialized** — accessing them before the declaration throws (the **Temporal Dead Zone**).
- **Scope**: `var` is **function-scoped**; `let`/`const` are **block-scoped** (`{}`, loops, `if`).
- **`const`** can't be *reassigned*, but a `const` object can still be *mutated* (`const o = {}; o.x = 1` is fine). `const` is about the binding, not the value.
- **Function declarations** are fully hoisted (callable before their line); **function expressions** assigned to `var`/`let` are not.

**Classic loop bug:**
```javascript
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 3 3 3
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 0 1 2
```
`var` has one shared binding; `let` creates a fresh binding per iteration.

**Rule:** default to `const`, use `let` when you must reassign, never use `var`.

## Scope & Lexical Scope

- **Scope** = where a variable is accessible: global, function, or block.
- **Lexical (static) scope**: a function's scope is determined by *where it's written* in the source, not where it's called. Inner functions can read variables from outer functions (the **scope chain**), searching outward until global, then `ReferenceError`.

```javascript
const outer = () => {
  const secret = 42;
  return () => secret; // inner sees `secret` by lexical scope
};
```

This is the foundation of closures.

## Closures (the #1 JS interview topic)

A **closure** is a function bundled together with references to its surrounding (lexical) state. The inner function "remembers" the variables from the scope where it was created, even after that outer function has returned.

```javascript
function counter() {
  let count = 0;                 // private state
  return {
    inc: () => ++count,
    get: () => count,
  };
}
const c = counter();
c.inc(); c.inc();
c.get(); // 2  — `count` lives on via the closure, unreachable from outside
```

**Why closures matter / where they show up:**
- **Data privacy / encapsulation** — `count` above can't be tampered with directly.
- **Function factories** — `const add = x => y => x + y; add(5)(3) // 8`.
- **Event handlers, callbacks, `setTimeout`** — they close over the variables they need.
- **Hooks** — React's `useState`/`useEffect` rely on closures (which is also the source of "stale closure" bugs).
- **Memoization, debounce, throttle** — all built on a closed-over cache/timer.

**Interviewers probe:** "What's a closure and give a real use?" — private state or a function factory beats a textbook definition. Then mention the memory note: closed-over variables aren't garbage-collected while the closure lives.

## The `this` Keyword

`this` is **determined by how a function is called**, not where it's defined (except arrow functions). Four rules, in priority order:

1. **`new`** — `this` is the brand-new object. `new Foo()`.
2. **Explicit** — `call`/`apply`/`bind` set `this` to the first argument.
3. **Implicit** — called as a method: `obj.fn()` → `this === obj`.
4. **Default** — a plain call `fn()` → `this` is `undefined` (strict mode) or `window`/`globalThis` (sloppy).

```javascript
const user = {
  name: "Ada",
  greet() { return `Hi ${this.name}`; },
};
user.greet();            // "Hi Ada"  (implicit)
const g = user.greet;
g();                     // "Hi undefined" — lost `this`
g.call(user);            // "Hi Ada"  (explicit)
```

**Arrow functions have no own `this`** — they inherit it lexically from the enclosing scope. That's exactly why they're used for callbacks inside methods/class fields, and why you should **not** use an arrow for an object method that needs `this` to be the object.

## call, apply & bind

All three set `this` explicitly:

```javascript
function intro(greeting) { return `${greeting}, ${this.name}`; }
const p = { name: "Sam" };

intro.call(p, "Hi");       // invokes now; args listed individually
intro.apply(p, ["Hi"]);    // invokes now; args as an array
const bound = intro.bind(p); // returns a NEW function, permanently bound
bound("Hi");               // "Hi, Sam"
```

Mnemonic: **A**pply = **A**rray, **C**all = **C**omma, **B**ind = returns a **B**ound copy for later.

## Prototypes & Inheritance

JS uses **prototypal inheritance**: every object has a hidden link (`[[Prototype]]`, exposed as `__proto__`) to another object. Property lookups walk this **prototype chain** until found or `null`.

```javascript
const animal = { speak() { return "..."; } };
const dog = Object.create(animal);   // dog.__proto__ === animal
dog.speak(); // "..." found on the prototype
```

- **Constructor functions / `new`**: methods go on `Fn.prototype` so all instances share one copy (memory-efficient) instead of each instance having its own.
- **`class`** is syntactic sugar over prototypes — `extends`, `super`, `constructor`. Under the hood it's still the prototype chain.
- `Array`, `Object`, `Function` methods (`.map`, `.hasOwnProperty`) live on their prototypes.

```javascript
class Animal { constructor(n){ this.n = n; } speak(){ return `${this.n} makes a sound`; } }
class Dog extends Animal { speak(){ return `${this.n} barks`; } }
new Dog("Rex").speak(); // "Rex barks"
```

## == vs === and Type Coercion

- **`===`** (strict) — no coercion; compares type *and* value. **Default to this.**
- **`==`** (loose) — coerces types first, producing famous surprises:

```javascript
0 == "";        // true
0 == "0";       // true
"" == "0";      // false
null == undefined; // true
NaN == NaN;     // false (NaN is never equal to anything)
[] == ![];      // true 😵
```

**Truthy/falsy:** the 8 falsy values are `false, 0, -0, 0n, "", null, undefined, NaN`. Everything else (including `[]`, `{}`, `"0"`) is truthy.

Use `===`; reach for `??` (nullish coalescing) when you specifically want to treat only `null`/`undefined` as "missing" (so `0` and `""` pass through).

## Functions: Arrow vs Regular, Pure, HOF

- **Arrow vs regular**: arrows have no own `this`, no `arguments` object, can't be `new`-ed, and can't be generators. Regular functions get their own `this` (call-site dependent) and `arguments`.
- **Higher-order function (HOF)**: takes and/or returns a function — `map`, `filter`, `addEventListener`, a debounce wrapper.
- **Pure function**: same input → same output, no side effects. Predictable, testable, cacheable — the basis of functional React/Redux.
- **First-class functions**: functions are values — pass, return, store them.

## Arrays: map, filter, reduce & friends

```javascript
const nums = [1, 2, 3, 4];
nums.map(n => n * 2);           // [2,4,6,8]        — transform (new array)
nums.filter(n => n % 2 === 0);  // [2,4]            — select (new array)
nums.reduce((a, n) => a + n, 0);// 10               — fold to a single value
nums.find(n => n > 2);          // 3
nums.some(n => n > 3);          // true
nums.every(n => n > 0);         // true
```

- **`map`/`filter`/`reduce` don't mutate**; they return new arrays. **`sort`, `splice`, `reverse`, `push` DO mutate** — copy first (`[...arr].sort()`) in React.
- `reduce` is the swiss-army knife — you can build `map`/`filter`/group-by/flatten from it.
- `forEach` is for side effects and returns `undefined` (can't chain).

## Objects, Destructuring, Spread & Rest

```javascript
const { name, age = 0, ...rest } = user;      // destructure + default + rest
const [first, , third] = arr;                 // array destructuring, skipping
const merged = { ...defaults, ...overrides };  // spread (shallow) merge
const clone = [...arr];                        // shallow array copy
const sum = (...nums) => nums.reduce((a, b) => a + b); // rest params
```

- **Spread `...`** expands; **rest `...`** collects. Same syntax, opposite jobs by context.
- **Optional chaining** `a?.b?.c` short-circuits to `undefined` instead of throwing on null/undefined.

## Shallow vs Deep Copy

```javascript
const shallow = { ...obj };            // top level copied; nested objects still SHARED
const deep = structuredClone(obj);      // modern deep clone (handles Dates, Maps, cycles)
const deepJSON = JSON.parse(JSON.stringify(obj)); // deep, but drops functions/undefined/Dates
```

- **Shallow copy** (`{...o}`, `Object.assign`, `slice`, `[...a]`) duplicates only the first level; nested references are shared, so mutating `shallow.nested.x` also changes the original.
- **Deep copy** duplicates everything. Prefer `structuredClone`. The `JSON` trick is common but lossy.
- This is *the* reason immutable updates in React must copy every level you change: `{ ...state, user: { ...state.user, name } }`.

## Immutability

Treating data as read-only and producing new values instead of mutating. Enables cheap change detection (reference equality), predictable state, and undo/redo. In React/Redux, never mutate state — always return new objects/arrays. `Object.freeze(obj)` enforces shallow immutability at runtime.
