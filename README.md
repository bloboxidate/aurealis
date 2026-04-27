# Auréalis

E-commerce storefront for a cosmetics brand: **Next.js 16 (App Router)**, **React 19**, **Tailwind v4**, **i18n** (`en` / `ar` via [next-intl](https://next-intl.dev)), cart with **Zustand**, and optional **Paymob Accept** card payments (server-only integration). A separate **admin** mini-app lives under `admin/` and runs on **port 3001** in development.

**Docs:** [ARCHITECTURE.md](./ARCHITECTURE.md) (system design), [SECURITY.md](./SECURITY.md) (threats, rate limits, CSP, edge/WAF). **Update those and this README** when you add routes, APIs, or deployment steps.

**Last updated:** 2026-04-24

**Brand & UI (at a glance):** The site uses a **mood-board palette** in `app/globals.css` and shared components. **`components/BrandWordmark.tsx`** uses the transparent **`logo-black.png`** with normal compositing (no white artboard) on both the **home hero** (warm **CSS filter** to match apricot) and the **navbar**. The **footer** also uses the black lockup. The **locale toggle** (English / Arabic) is the pill in the top bar (`/en/...` ↔ `/ar/...`).

**Storefront (at a glance):** Full i18n shop flow — catalog, product PDP, search, **cart** (Zustand), **wishlist** (Zustand), **checkout** (demo order + optional Paymob), **order success** with local order write-through. **Account** area links to **order history** and **order detail** (per-browser `localStorage`), **track order** (ref + email, same store), and **settings** (copy-only until backend auth). Content pages: about, contact, FAQ, shipping, **returns**, legal (privacy, terms), **cookie notice**, **accessibility** statement, and a **directory** (human-facing sitemap). **SEO:** `app/sitemap.ts` and `app/robots.ts` (base URL from `NEXT_PUBLIC_SITE_URL` or localhost). **Errors:** `app/[locale]/not-found.tsx` and `app/[locale]/error.tsx`.

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

## Environment

Copy `.env.example` to `.env.local` and fill in values. For Paymob, set at least: `PAYMOB_API_KEY`, `PAYMOB_MERCHANT_ID`, `PAYMOB_INTEGRATION_ID`, `PAYMOB_HMAC_SECRET`, and `NEXT_PUBLIC_SITE_URL` (public URL for return links, sitemap, and `robots.txt`). For local dev without a public URL, the sitemap/robots fall back to a localhost default. For admin, use a **separate** `admin/.env.local` and never commit real secrets.

## Project structure (short)

```
app/                 # App Router: root, sitemap / robots, [locale]/* pages
  [locale]/          # all shop + content + account (see ARCHITECTURE.md)
  api/paymob/        # paymob/ready, init, return
components/          # Shared UI: Navbar, Footer, BrandWordmark, ProductCard, ContentPageLayout, …
i18n/                # next-intl routing + request config
lib/                 # data, cart store, wishlist, orders (local), checkout-pending, paymob, validate-cart, supabase, …
messages/            # en.json, ar.json
proxy.ts             # next-intl locale handling + /api/* rate cap (Next.js 16+ proxy)
public/              # logo-orange.png, logo-black.png, submark, loader art (Git LFS for binaries per .gitattributes)
admin/               # second Next app: login + protected dashboard
```

**Assets:** Wordmarks and submarks live under `public/`. The hero and **navbar** use the black wordmark in `components/BrandWordmark.tsx` (with optional `filter` on the hero); the **footer** uses `public/logo-black.png` in `components/Footer.tsx`.

For diagrams and deeper detail, read [ARCHITECTURE.md](./ARCHITECTURE.md).

## Deploy

Storefront: any Node host or [Vercel](https://vercel.com) (set env vars in the project dashboard). **Admin** should be deployed only on a private network or with strict access controls (separate project, IP restrictions, or VPN), not on the same public entrypoint as the shop unless you add another layer of protection.

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [next-intl](https://next-intl.dev)
- [Paymob developers](https://developers.paymob.com)
