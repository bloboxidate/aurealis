# Auréalis

E-commerce storefront for a cosmetics brand: **Next.js 16 (App Router)**, **React 19**, **Tailwind v4**, **i18n** (`en` / `ar` via [next-intl](https://next-intl.dev)), cart with **Zustand**, and optional **Paymob Accept** card payments (server-only integration). A separate **admin** mini-app lives under `admin/` and runs on **port 3001** in development.

**Docs:** [ARCHITECTURE.md](./ARCHITECTURE.md) (system design), [SECURITY.md](./SECURITY.md) (threats, rate limits, CSP, edge/WAF). **Update those and this README** when you add routes, APIs, or deployment steps.

**Last updated:** 2026-04-24

**Brand & UI (at a glance):** The site uses a **mood-board palette** in `app/globals.css` and shared components. The **Auréalis wordmark** appears in the **navbar** (center), the **home hero** (large, right column on desktop / center on mobile) via `components/BrandWordmark.tsx`, and the **footer** (`public/logo-black.png`). The **locale toggle** (English / Arabic) is the pill control in the top bar (switches to `/en/...` or `/ar/...`).

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

Copy `.env.example` to `.env.local` and fill in values. For Paymob, set at least: `PAYMOB_API_KEY`, `PAYMOB_MERCHANT_ID`, `PAYMOB_INTEGRATION_ID`, `PAYMOB_HMAC_SECRET`, and `NEXT_PUBLIC_SITE_URL` (public URL used in return links). For admin, use a **separate** `admin/.env.local` and never commit real secrets.

## Project structure (short)

```
app/                 # App Router: root + [locale]/* routes
  api/paymob/        # paymob/ready, init, return
components/          # Shared UI (e.g. Navbar, Footer, BrandWordmark, ProductCard)
i18n/                # next-intl routing + request config
lib/                 # data, store, supabase, paymob, cart validation
messages/            # en.json, ar.json
proxy.ts             # next-intl locale handling + /api/* rate cap (Next.js 16+ proxy)
public/              # logo-orange.png, logo-black.png, submark, loader art (Git LFS for binaries per .gitattributes)
admin/               # second Next app: login + protected dashboard
```

Wordmarks and submarks live under `public/`; hero/nav use `BrandWordmark` (orange on petal), footer uses the black logo in `components/Footer.tsx`.

For diagrams and deeper detail, read [ARCHITECTURE.md](./ARCHITECTURE.md).

## Deploy

Storefront: any Node host or [Vercel](https://vercel.com) (set env vars in the project dashboard). **Admin** should be deployed only on a private network or with strict access controls (separate project, IP restrictions, or VPN), not on the same public entrypoint as the shop unless you add another layer of protection.

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [next-intl](https://next-intl.dev)
- [Paymob developers](https://developers.paymob.com)
