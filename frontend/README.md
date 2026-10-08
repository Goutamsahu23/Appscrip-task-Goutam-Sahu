# Appscrip Product Listing (Frontend)

Next.js App Router storefront that renders a server-side product listing from the local Express API. Filters, sort, search, and pagination are all driven by the URL so results stay shareable and crawlable.

## Prerequisites

- Node.js 20+
- Backend API running (see root [`README.md`](../README.md)) — default `http://localhost:4000`

## Setup

```bash
cd frontend
cp .env.example .env.local
# confirm API_URL and SITE_URL
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

After the backend seed downloads images, restart the API if it was already running so `/images` is served.

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local`. Never commit `.env.local`.

| Variable | Required | Description |
| --- | --- | --- |
| `API_URL` | yes | Backend API base URL used by server components (e.g. `http://localhost:4000/api`) |
| `SITE_URL` | no | Public site origin for canonical URLs, Open Graph, and JSON-LD (default `http://localhost:3000`) |

`API_URL` and `SITE_URL` are read on the server only. They are not exposed to the browser bundle as `NEXT_PUBLIC_*` vars.

## Scripts

Run these from `frontend/`:

| Script | What it does |
| --- | --- |
| `npm run dev` | Start Next.js (Turbopack) on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | Type-check without emit |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |

## Features

- **SSR product listing** — products and categories fetched on the server from the backend API
- **URL state** — `page`, `limit`, `category`, `minPrice`, `maxPrice`, `sort`, `q`
- **Filters** — category and price (presets / custom range); desktop sidebar + mobile drawer
- **Search** — header search icon opens a field that updates `q` in the URL
- **Sort** — recommended, newest, popular, price asc/desc
- **Pagination** — crawlable `<Link>` prev / page / next controls; out-of-range pages redirect to the last valid page
- **UX states** — loading skeleton, pending transition dim, empty state, error boundary
- **Layout** — announcement bar, header (mobile menu), hero, footer
- **Styling** — CSS Modules + design tokens in `app/globals.css`
- **Icons** — SVG files under `public/icons/` (no inline icon components)

## SEO

- Unique `title` / `description` per URL via `generateMetadata` (category, search, page)
- Canonical URL keeps `category` + `page` only (sort / price / `q` / `limit` variants point at the canonical)
- Open Graph + Twitter card tags; `metadataBase` from `SITE_URL`
- JSON-LD: `ItemList` of `Product` entries plus `BreadcrumbList` (Home → Shop → category)
- Heading structure: one `h1` (hero), listing `h2` (visually hidden “Products”), card titles as `h3`
- Semantic breadcrumb `<nav>` on mobile
- Images: SEO-friendly filenames from the API seed, meaningful `alt` (product title), `next/image` with AVIF/WebP, `priority` on the first four cards

## Accessibility

- Skip-to-content link
- Visible `:focus-visible` outlines (white on the dark footer)
- Muted text colour tuned for ≥ 4.5:1 contrast
- Focus trap + Escape + scroll lock on mobile menu and filter drawer
- Sort dropdown uses `role="menu"` / `menuitemradio` with arrow-key navigation
- Category filter uses native radio inputs inside a fieldset

## Dependencies (why each exists)

Runtime:

| Package | Why |
| --- | --- |
| `next` | App Router, SSR, image optimization, routing |
| `react` / `react-dom` | UI library required by Next.js |

No UI kit and no extra client libraries. Focus trap, filters, sort, and pagination are hand-rolled.

Dev-only: TypeScript, ESLint, Prettier, `@types/*`.

## Design deviations

- **Font:** Inter substitutes for Simplon Norm (not freely licensed).
- **Filters:** Category / price / search only — FakeStore data has no Ideal For / Fabric / Occasion attributes from the Figma accordions.
- **Header icons:** Wishlist, cart, and profile are visual chrome only. Search opens the product search field.

## Lighthouse

With the API running, build and serve the production frontend, then audit `http://localhost:3000/`:

```bash
cd frontend
npm run build
npm start
# In Chrome DevTools → Lighthouse (Desktop), or:
npx lighthouse http://localhost:3000/ --view --only-categories=performance,accessibility,best-practices,seo
```

Sample desktop scores from a local production audit of `/` (Chrome Lighthouse, Accessibility / Best Practices / SEO categories):

| Category | Score |
| --- | --- |
| Accessibility | 96 |
| Best Practices | 96 |
| SEO | 91 |

Scores are machine- and version-dependent; re-run after changes. Performance benefits from SSR, optimized images, and minimal JS.

## URL examples

```text
http://localhost:3000/
http://localhost:3000/?sort=price_asc
http://localhost:3000/?category=electronics&minPrice=50&maxPrice=200
http://localhost:3000/?q=jacket&page=2
```

## Project structure

```text
frontend/
  app/                     # App Router pages, layout, loading, error
  components/
    layout/                # AnnouncementBar, Header, Footer, MobileMenu
    products/              # Hero, Toolbar, filters, grid, cards, pagination
    seo/                   # JSON-LD helpers
  lib/                     # API client, searchParams, metadata, a11y hooks
  public/icons/            # SVG icons
  types/                   # Shared TypeScript types
```

## Notes

- The frontend never calls FakeStore directly — only this project’s backend.
- Keep the backend running while developing; otherwise `app/error.tsx` will surface an API failure state.
- Re-run `npm run db:seed` in `backend/` whenever you need fresh SEO-named product images.
