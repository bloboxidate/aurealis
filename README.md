# Auréalis

E-commerce storefront for a cosmetics brand: **Next.js 16 (App Router)**, **React 19**, **Tailwind v4**, **i18n** (`en` / `ar` via [next-intl](https://next-intl.dev)), cart with **Zustand**, and optional **Paymob Accept** card payments (server-only integration). A separate **admin** mini-app lives under `admin/` and runs on **port 3001** in development.

**Docs:** [ARCHITECTURE.md](./ARCHITECTURE.md) (system design), [SECURITY.md](./SECURITY.md) (threats, rate limits, CSP, edge/WAF). **Update those and this README** when you add routes, APIs, or deployment steps.

**Last updated:** 2026-04-27 — catalog: Supabase `products` table; manage from **admin** → `/products` (requires `SUPABASE_SERVICE_ROLE_KEY` in `admin/.env.local`, see `admin/.env.example`).

**Brand & UI (at a glance):** The site uses a **mood-board palette** in `app/globals.css` and shared components. **`components/BrandWordmark.tsx`** uses the transparent **`logo-black.png`** with normal compositing (no white artboard) on both the **home hero** (warm **CSS filter** to match apricot) and the **navbar**. The **footer** also uses the black lockup. The **locale toggle** (English / Arabic) is the pill in the top bar (`/en/...` ↔ `/ar/...`).

**Storefront (at a glance):** Full i18n shop flow — catalog, product PDP, search, **cart** (Zustand), **wishlist** (Zustand), **checkout** (demo order + optional Paymob), **order success** with local order write-through. **Account** (Supabase Auth) with **order history** and **track order** still primarily **client** `localStorage` today. **SEO:** `metadataBase` + Open Graph in `app/layout.tsx`; `app/sitemap.ts` and `app/robots.ts` use `getPublicSiteUrl()` from `lib/env`. **Ops:** `GET /api/health` (no-store JSON for probes). **Build:** `instrumentation.ts` runs **production env assertions** (HTTPS site URL, Paymob all-or-nothing, Supabase pair). **CI:** GitHub Actions (lint, typecheck, build). **Errors:** `app/[locale]/not-found.tsx` and `app/[locale]/error.tsx`.

---

## Quick start (storefront)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Locale-prefixed routes: `/en/...`, `/ar/...` (see `i18n/routing.ts`).

## Admin app (separate process)

```bash
cd admin && npm install   # first time only
npm run dev
```

Listens on [http://localhost:3001](http://localhost:3001). Configure `admin/.env.local` (see `.env.example` in the repo root for variable names). From repo root you can also run `npm run dev:admin` after `admin` dependencies are installed.

## Scripts (repo root)

| Script | Purpose |
|--------|---------|
| `npm run dev` | Storefront dev server (port 3000) |
| `npm run build` | Production build — storefront |
| `npm start` | Start production server — storefront |
| `npm run dev:admin` | Admin dev server (port 3001) |
| `npm run build:admin` | Production build — admin |
| `npm run start:admin` | Start production — admin |
| `npm run lint` | ESLint — storefront |
| `npm run typecheck` | `tsc --noEmit` — storefront |

## Environment

Copy `.env.example` to `.env.local` and fill in values. **Production builds** (`NODE_ENV=production`, including `next build` and the production server) require **`NEXT_PUBLIC_SITE_URL` with `https://`** and enforce consistent optional integrations: **all four** Paymob keys or **none**; **both** Supabase public keys or **neither**. Set `SKIP_PRODUCTION_ENV_CHECK=1` only for rare debugging. CI sets a dummy `https://` URL. For local dev, sitemap/robots default to `http://localhost:3000` when the variable is unset. For the **admin** app, use a **separate** `admin/.env.local` (see `admin/.env.example` for `SUPABASE_SERVICE_ROLE_KEY` and session/password vars). Never commit real secrets.

## Project structure (short)

```
app/                 # App Router: root, sitemap / robots, [locale]/*, api/health, paymob, sariee
components/          # Shared UI: Navbar, Footer, BrandWordmark, ProductCard, ContentPageLayout, …
i18n/                # next-intl routing + request config
lib/                 # data, env (public URL), stores, paymob, validate-cart, supabase, …
messages/            # en.json, ar.json
proxy.ts             # next-intl + /api/* rate cap (Next.js 16+ proxy)
instrumentation.ts   # production env checks on server start
types/database.ts   # Supabase `Database` type; regenerate with Supabase CLI when schema changes
supabase/migrations/ # SQL: profiles + RLS (apply in Supabase; optional for current UI)
public/              # assets (use Git LFS for binaries per .gitattributes)
.github/workflows/   # CI: lint, typecheck, build
admin/               # second Next app (port 3001 in dev)
```

**Assets:** Wordmarks and submarks live under `public/`. The hero and **navbar** use the black wordmark in `components/BrandWordmark.tsx` (with optional `filter` on the hero); the **footer** uses `public/logo-black.png` in `components/Footer.tsx`.

For diagrams and deeper detail, read [ARCHITECTURE.md](./ARCHITECTURE.md).

## Deploy

Storefront: any Node host or [Vercel](https://vercel.com) (set **all** required env vars in the project dashboard; run `next build` once locally with production env to catch assertion failures). Point uptime checks at **`/api/health`**. **Admin** should be deployed only on a private network or with strict access controls (separate project, IP restrictions, or VPN), not on the same public entrypoint as the shop unless you add another layer of protection.

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [next-intl](https://next-intl.dev)
- [Paymob developers](https://developers.paymob.com)
