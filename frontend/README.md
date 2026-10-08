# Appscrip Frontend (PLP)

Next.js 15 App Router storefront that SSR’s the mettā muse product listing from the Express API. Filters, sort, search, and pagination are URL-driven (shareable + crawlable). The frontend **never** calls FakeStore — only this project’s backend.

**Live:** [https://appscrip-task-goutam-sahu.vercel.app/](https://appscrip-task-goutam-sahu.vercel.app/)

Backend docs: [`../backend/README.md`](../backend/README.md)  
Monorepo overview: [`../README.md`](../README.md)

---

## Prerequisites

- Node.js 20+
- Backend API running and seeded (see backend README)
  - Local default: `http://localhost:4000/api`
  - Live: `https://appscrip-task-goutam-sahu.onrender.com/api`

---

## Local setup

```bash
cd frontend
cp .env.example .env.local
# Set API_URL and SITE_URL (see below)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Order of operations**

1. Start Postgres + backend (`migrate` → `seed` → `npm run dev`)
2. Confirm http://localhost:4000/api/products returns JSON
3. Start this frontend
4. Confirm products render on http://localhost:3000

If the API is down, `app/error.tsx` shows the failure state.

---

## Environment variables

Copy [`.env.example`](.env.example) → `.env.local`. Never commit `.env.local`.

| Variable | Required | Example | Description |
| --- | --- | --- | --- |
| `API_URL` | yes | `http://localhost:4000/api` | Backend API **base** (no trailing slash). Server components call `${API_URL}/products` and `${API_URL}/categories`. |
| `SITE_URL` | no | `http://localhost:3000` | Public site origin for canonical URLs, Open Graph, and JSON-LD |

Both are **server-only** — not `NEXT_PUBLIC_*`.

### Local `.env.local`

```env
API_URL=http://localhost:4000/api
SITE_URL=http://localhost:3000
```

### Production (Vercel)

```env
API_URL=https://appscrip-task-goutam-sahu.onrender.com/api
SITE_URL=https://appscrip-task-goutam-sahu.vercel.app
```

Also set the backend `CORS_ORIGIN` to the Vercel origin.

**Vercel project tips**

- Root Directory: `frontend`
- Redeploy after changing env vars
- `next.config` builds `images.remotePatterns` from `API_URL` hostname + `fakestoreapi.com` for product images

---

## Scripts

Run from `frontend/`:

| Script | Description |
| --- | --- |
| `npm run dev` | Next.js dev server (Turbopack) on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |

---

## Features

- **SSR product listing** — `getProducts` / `getCategories` on the server
- **URL state** — `page`, `limit`, `category`, `minPrice`, `maxPrice`, `sort`, `q`
- **Filters** — category + price (presets / custom range); desktop sidebar + mobile drawer
- **Search** — header search updates `q` in the URL
- **Sort** — recommended, newest, popular, price asc/desc
- **Pagination** — crawlable `<Link>` controls; out-of-range pages redirect to last valid page
- **UX states** — loading skeleton, pending dim, empty state, error boundary
- **Layout** — announcement bar, header (mobile menu), hero, footer
- **Styling** — CSS Modules + tokens in `app/globals.css`
- **Icons** — SVGs under `public/icons/`

---

## URL examples

```text
http://localhost:3000/
http://localhost:3000/?sort=price_asc
http://localhost:3000/?category=electronics&minPrice=50&maxPrice=200
http://localhost:3000/?q=jacket&page=2
```

Live equivalents work the same on  
https://appscrip-task-goutam-sahu.vercel.app/

---

## SEO

- Unique `title` / `description` via `generateMetadata` (category, search, page)
- Canonical keeps `category` + `page` only (sort / price / `q` / `limit` variants map back)
- Open Graph + Twitter; `metadataBase` from `SITE_URL`
- JSON-LD: `ItemList` of `Product` + `BreadcrumbList`
- Headings: one `h1` (hero), listing `h2` (sr-only “Products”), card titles as `h3`
- Semantic breadcrumb `<nav>` on mobile
- Images: FakeStore absolute URLs from the API, meaningful `alt`, `next/image` AVIF/WebP, `priority` on the first row

---

## Accessibility

- Skip-to-content link
- Visible `:focus-visible` outlines
- Muted text tuned for ≥ 4.5:1 contrast
- Focus trap + Escape + scroll lock on mobile menu and filter drawer
- Sort dropdown: `role="menu"` / `menuitemradio` with arrow keys
- Category filter: native radios in a fieldset

---

## Manual QA checklist

| Check | How |
| --- | --- |
| SSR | View-source on `/` — product titles in HTML |
| Category filter | Pick a category — URL `category=` updates, list updates |
| Price filter | Preset or min/max — URL updates |
| Sort | Change sort — `sort=` in URL |
| Search | Header search — `q=` in URL |
| Pagination | Go to page 2 — `page=2` |
| Images | Product cards load (FakeStore via `next/image`) |
| Mobile | Menu + filter drawer open/close, focus trap, Escape |
| API down | Stop backend — error UI appears |

---

## Lighthouse

Production audit of the live site:

| Category | Score |
| --- | --- |
| Performance | 96 |
| Accessibility | 96 |
| Best Practices | 96 |
| SEO | 91 |

Screenshot (repo root): [`../docs/lighthouse-desktop.png`](../docs/lighthouse-desktop.png)

Local production audit:

```bash
cd frontend
npm run build
npm start
# Chrome DevTools → Lighthouse (Desktop), or:
npx lighthouse http://localhost:3000/ --view --only-categories=performance,accessibility,best-practices,seo
```

---

## Dependencies

Runtime:

| Package | Why |
| --- | --- |
| `next` | App Router, SSR, image optimization, routing |
| `react` / `react-dom` | Required by Next.js |

No UI kit, Redux, or axios. Filters, sort, pagination, and focus trap are hand-rolled.

Dev-only: TypeScript, ESLint, Prettier, `@types/*`.

---

## Design deviations

- **Font:** Inter instead of Simplon Norm (not freely licensed)
- **Filters:** Category / price / search only — FakeStore has no Ideal For / Fabric / Occasion fields
- **Header icons:** Wishlist, cart, profile are visual only; search opens the product search field
- **New badge:** Removed per product feedback

---

## Project structure

```text
frontend/
  app/                     # layout, page, loading, error, globals
  components/
    layout/                # AnnouncementBar, Header, Footer, MobileMenu
    products/              # Hero, Toolbar, filters, grid, cards, pagination
    seo/                   # JSON-LD
  lib/                     # api, searchParams, metadata, a11y
  public/icons/            # SVG icons
  types/                   # Product / query types
```

---

## Notes

- `API_URL` is the base (`…/api`), not `…/api/products`.
- Keep the backend running while developing.
- After changing `API_URL` on Vercel, redeploy so `next.config` remote image patterns match.
