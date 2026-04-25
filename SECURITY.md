# Security model — Auréalis

**Last updated:** 2026-04-24

This file explains what the **application** does to reduce common web risks, and what must be handled **outside** the app (infrastructure). It is not a legal guarantee; review for your own threat model.

---

## What this codebase implements

| Risk | Mitigations |
|------|-------------|
| **XSS (stored/reflected in UI)** | React renders text safely by default; no `dangerouslySetInnerHTML` in app code. Paymob checkout fields are **sanitized** server-side before external APIs. **Content-Security-Policy** (see `next.config.ts`) limits script, frame, and object sources. |
| **CSRF to JSON APIs** | Paymob `POST /api/paymob/init` checks **Origin** against your site URL in production. Same-site form posts are the normal browser case. |
| **Brute force (API / admin login)** | **Per-IP rate limits:** global `middleware` for all `/api/*` (configurable `API_RATE_MAX_PER_MIN`); stricter limit on `POST /api/paymob/init` and on Paymob return redirect; admin login throttled with `checkLoginRate`. |
| **DoS (application layer)** | JSON **body size caps** (e.g. init 32KB, admin login 24KB). In-memory **rate limits** (per process). |
| **SQL injection** | The storefront does not run raw SQL. **Supabase** (when used) should only use the client / parameterized queries, never string-concatenated SQL. |
| **Command injection** | No shell execution in app code. |
| **Leaky responses** | Paymob return `HEAD` no longer returns internal headers. Generic **validation_error** (no Zod details) to clients. |
| **Transport** | **HSTS** when `VERCEL=1` or `ENABLE_HSTS=1` (set on any production HTTPS host that is not on Vercel). |
| **Sensitive API responses** | `Cache-Control: no-store` and related cache headers on payment-related JSON and redirects (see `lib/security/secure-api-headers.ts`) so credentials and flow state are not written to shared caches. |

**Supabase** (`lib/supabase.ts`): the client is created **lazily** and returns `null` if env is missing, so a missing config does not crash the app at import time.

---

## Encryption and credentials (what is protected how)

- **In transit (browser ↔ your site ↔ providers):** All production traffic is expected to use **HTTPS (TLS)**. You configure TLS at the host (Vercel, etc.); the app does not disable TLS. Outbound `fetch` to Paymob and Supabase uses **https** endpoints.
- **Admin session cookies:** Stored as **AES-256-GCM** ciphertext (v2 tokens) derived from `ADMIN_SESSION_SECRET` via scrypt, with a random IV per session and GCM authentication. **Legacy** v1 **HMAC-SHA256** cookies may still validate until all sessions expire or users log in again. Cookies are **HttpOnly** and (in production) **Secure**; the `__Secure-` cookie name is used on HTTPS when `VERCEL=1` or `USE_SECURE_COOKIE=1`.
- **Passwords / API keys:** Never stored in the browser; **Paymob** and **Supabase** credentials exist only in server **environment** / secrets, not in the client bundle. User passwords for admin use **bcrypt** hashes (`ADMIN_PASS_HASH`), not reversible encryption.
- **At rest (database / logs):** Row-level and disk encryption is provided by your **hosting and database** (e.g. Supabase project settings, Vercel); this codebase does not replace provider-managed at-rest encryption.
- **Client-side data:** The public cart in `localStorage` holds **non-secret** line items; do not use it for credentials or payment data.

---

## What you must do at the edge (non-negotiable for “DDoS” and large attacks)

- **DDoS / volumetric / network floods** are not fully solvable in Node or Next.js. Use a **WAF** and DDoS protection: **Cloudflare**, **Vercel** (for apps hosted there), **AWS Shield + WAF**, **Azure Front Door**, etc. Rate-based rules and bot management belong here.  
- **Rate limits** in this app are **in-memory** per instance: they **reset** on deploy and do not coordinate across many servers. For multi-region or multiple replicas, use **Redis / Upstash** (or the provider’s rate-limit product) for shared counters.  
- **Secrets**: store `PAYMOB_*`, `ADMIN_SESSION_SECRET`, `ADMIN_PASS_HASH`, etc. in a secrets manager; never in git.  
- **Admin app**: keep it on a private network, VPN, or **IP allowlist**; do not rely on “security through obscurity” on port 3001 alone.  

---

## CSP and third parties

- The CSP in `next.config.ts` may need new **`connect-src`** or **`img-src`** entries when you add analytics, image CDNs, or new APIs. Tighten `script-src` (e.g. **nonces**) when your deployment supports it.  
- If `Cross-Origin-Resource-Policy: same-site` blocks a legitimate cross-origin image or script, adjust or remove that header in `next.config.ts` and document the exception.

---

## Reporting

For a production security report or bug bounty, provide steps to reproduce, impact, and affected environment (no live exploitation against users without permission).
