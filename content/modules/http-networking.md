# HTTP, Networking & Web Security

"What happens when you type a URL and press Enter?" is the most-asked frontend systems question because a good answer touches DNS, TCP, TLS, HTTP, caching, and rendering — the whole stack. This module walks that journey, then digs into HTTP itself, caching, the Same-Origin Policy and CORS, how authentication actually works in the browser, and how to avoid async race conditions with cancellation.

## What happens when you type a URL

A high-level narrative you can deliver in an interview:

1. **URL parsing.** The browser splits the URL into scheme, host, port, path, query, fragment. It checks if it's a search term vs a URL, and applies HSTS (force HTTPS) if known.
2. **DNS resolution.** The hostname (`example.com`) is resolved to an IP address. The browser checks its cache → OS cache → router → ISP resolver, which recursively queries root → TLD → authoritative name servers. Cached via TTL.
3. **TCP connection.** A TCP handshake (SYN → SYN-ACK → ACK) establishes a reliable connection to the server's IP on the port (443 for HTTPS).
4. **TLS handshake.** For HTTPS, the client and server negotiate a cipher, the server presents its certificate (verified against a trusted CA), and they derive session keys. Now traffic is encrypted.
5. **HTTP request.** The browser sends `GET / HTTP/1.1` (or HTTP/2) with headers (Host, cookies, Accept, User-Agent).
6. **Server responds.** Status line + headers + body (the HTML).
7. **Rendering.** The browser parses HTML → DOM, CSS → CSSOM, builds the render tree, does layout and paint, and fetches sub-resources (CSS, JS, images) — often over the same connection (HTTP/2 multiplexing).

The point interviewers want: you understand there are **many caches and round-trips** between a keystroke and pixels, and where latency hides (DNS, TLS, render-blocking CSS/JS).

## HTTP fundamentals

HTTP is a **stateless**, text-based request/response protocol. Every request is independent; state (like login) is layered on via cookies/tokens.

**Methods (verbs):**

| Method | Purpose | Safe | Idempotent |
|---|---|---|---|
| `GET` | Read a resource | ✅ | ✅ |
| `POST` | Create / arbitrary action | ❌ | ❌ |
| `PUT` | Replace a resource | ❌ | ✅ |
| `PATCH` | Partially update | ❌ | ❌ |
| `DELETE` | Remove a resource | ❌ | ✅ |

- **Safe** = no server state change (cacheable, prefetchable). **Idempotent** = calling it N times has the same effect as once (crucial for safe retries). `POST` is neither — retrying can double-charge.

**Status codes** — know the families and the famous members:

- **1xx** informational (rare).
- **2xx** success — `200 OK`, `201 Created`, `204 No Content`.
- **3xx** redirect — `301` permanent, `302`/`307` temporary, `304 Not Modified` (cache still valid).
- **4xx** client error — `400` bad request, `401` unauthenticated, `403` forbidden (authenticated, not allowed), `404` not found, `409` conflict, `422` validation, `429` too many requests.
- **5xx** server error — `500` internal, `502` bad gateway, `503` unavailable, `504` gateway timeout.

`401` vs `403` is a classic: **401 = "who are you?" (not logged in); 403 = "I know you, you can't do this."**

**Headers** carry metadata. Request: `Authorization`, `Cookie`, `Accept`, `Content-Type`, `Origin`. Response: `Content-Type`, `Set-Cookie`, `Cache-Control`, `Access-Control-Allow-Origin`. The **body** carries the payload (JSON, HTML, binary).

**Versions:** HTTP/1.1 (one request per connection, head-of-line blocking) → **HTTP/2** (multiplexing many streams over one connection, header compression) → **HTTP/3** (over QUIC/UDP, no TCP head-of-line blocking).

## Caching

Caching avoids re-fetching unchanged resources — one of the biggest performance levers. The server controls it with response headers.

**`Cache-Control`** is the modern master switch:

```
Cache-Control: max-age=31536000, immutable   // cache 1 year, never revalidate (hashed assets)
Cache-Control: no-cache                        // cache BUT revalidate every time before use
Cache-Control: no-store                        // never cache (sensitive data)
Cache-Control: private                         // only the browser, not shared CDNs
```

Note the trap: **`no-cache` does not mean "don't cache"** — it means "store it, but revalidate with the server before serving." `no-store` is the one that truly forbids caching.

**Validation / conditional requests** — when a cached copy expires, the browser revalidates instead of re-downloading:

- **`ETag`** — a content fingerprint. Browser sends `If-None-Match: <etag>`; if unchanged the server returns **`304 Not Modified`** (empty body, cheap) and the browser reuses its copy.
- **`Last-Modified`** — a timestamp; browser sends `If-Modified-Since`.

**Cache-busting strategy** you can name: serve static assets with hashed filenames (`app.3f9a2.js`) and `max-age` far in the future + `immutable`; when content changes the filename changes, so the browser fetches the new one. HTML itself uses `no-cache` so it always revalidates and points at the latest hashed assets.

**CDN caching** — a CDN caches responses at edge nodes geographically near users, cutting latency and origin load. It respects `Cache-Control` (and `s-maxage` for shared caches). Great for static assets and cacheable API responses.

## Same-Origin Policy & CORS

The **Same-Origin Policy (SOP)** is a foundational browser security rule: script on one **origin** can't read responses from a different origin. An **origin** = scheme + host + port. `https://app.com` and `https://api.app.com` are *different* origins (different host); so are `http://` vs `https://` and different ports.

SOP is why a malicious page can't silently read your bank's API using your session. But legitimate apps *do* need cross-origin calls (your frontend on one domain, API on another) — that's what **CORS** relaxes.

**CORS (Cross-Origin Resource Sharing)** is a server-driven opt-in. The *server* sends headers telling the browser which origins may read its responses. The browser enforces it — CORS is **not** a server-side protection, it's the browser refusing to expose the response to JS.

```
Access-Control-Allow-Origin: https://app.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true   // needed to send cookies cross-origin
```

**Preflight requests** — for "non-simple" requests (methods beyond GET/POST/HEAD, custom headers, or `Content-Type: application/json`), the browser first sends an **`OPTIONS`** preflight asking permission:

```
OPTIONS /api/users
Origin: https://app.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

If the server's response approves the origin/method/headers, the browser then sends the real request. "Simple" requests (a plain GET, or a form POST) skip preflight.

Common interview clarifications:

- A **CORS error is a browser-side block**; the request often *did* reach the server (and may have executed!) — the browser just hides the response from your JS.
- CORS protects the *reading of responses*, not the *making of requests* — which is why **CSRF** (state-changing requests) is a separate problem needing separate defenses.
- `Access-Control-Allow-Origin: *` cannot be combined with credentialed (cookie) requests.

## Authentication in the browser

HTTP is stateless, so "being logged in" means attaching proof to each request. Two dominant models:

**Session-based (stateful):** server creates a session, stores it server-side, and sends a **session ID in a cookie**. The browser auto-sends the cookie on every request; the server looks it up. Easy to revoke (delete server-side), but requires server/shared storage.

**Token-based (stateless):** on login the server returns a signed **JWT (JSON Web Token)** containing claims (user id, roles, expiry). The client sends it back, usually in `Authorization: Bearer <token>`. The server verifies the signature — no server-side lookup needed, so it scales horizontally. Downside: hard to revoke before expiry (mitigate with short-lived access tokens + refresh tokens).

**Cookie security flags** — critical to name correctly:

| Flag | Effect |
|---|---|
| `HttpOnly` | JavaScript **cannot** read the cookie (`document.cookie`) — defends against token theft via XSS |
| `Secure` | Cookie sent only over HTTPS |
| `SameSite=Strict/Lax/None` | Controls whether the cookie is sent on cross-site requests — the primary **CSRF** defense |
| `Domain` / `Path` / `Max-Age` | Scope and lifetime |

**Where to store a token — the classic tradeoff:**

- **`localStorage`** — convenient, but **readable by any JS**, so an XSS bug leaks the token. Not auto-sent (no CSRF risk).
- **`HttpOnly` cookie** — invisible to JS (XSS can't read it), but auto-sent, so it needs `SameSite`/CSRF tokens.

The common recommendation: **HttpOnly, Secure, SameSite cookies** for auth tokens, so a single XSS can't exfiltrate them. `SameSite=Lax` is the modern browser default and blocks most CSRF.

## Async race conditions & cancellation

In async UIs, responses can arrive **out of order**. Type "a", then "ab" quickly: the request for "a" might resolve *after* "ab", overwriting fresh results with stale ones — a **race condition**.

Defenses:

**AbortController** — cancel an in-flight `fetch` so a superseded request can't clobber state:

```js
let controller;
async function search(query) {
  controller?.abort();                 // cancel the previous request
  controller = new AbortController();
  try {
    const res = await fetch(`/api?q=${query}`, { signal: controller.signal });
    setResults(await res.json());
  } catch (e) {
    if (e.name === "AbortError") return; // expected — ignore
    throw e;
  }
}
```

In React, this is the canonical `useEffect` cleanup for data fetching:

```js
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(e => { if (e.name !== "AbortError") setError(e); });
  return () => controller.abort(); // cancel on unmount / dep change
}, [url]);
```

**Other patterns:**

- **Ignore stale responses** — track the latest request id and drop responses that don't match (`if (id !== latestId) return`).
- **Debounce** the trigger so you fire fewer requests in the first place.
- Combine debounce (fewer requests) + AbortController (cancel the rest) + the latest-wins check for robust search-as-you-type.
