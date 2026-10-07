# Appscrip Product Listing (Frontend)

Next.js App Router storefront that renders a server-side product listing from the local Express API. Filters, sort, search, and pagination are all driven by the URL so results stay shareable and crawlable.

## Prerequisites

- Node.js 20+
- Backend API running (see root [`README.md`](../README.md)) — default `http://localhost:4000`

## Setup

```bash
cd frontend
cp .env.example .env.local
# confirm API_URL points at your backend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local`. Never commit `.env.local`.

| Variable | Required | Description |
| --- | --- | --- |
| `API_URL` | yes | Backend API base URL used by server components (e.g. `http://localhost:4000/api`) |

`API_URL` is read only on the server (`getProducts` / `getCategories`). It is not exposed to the browser bundle.

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
- **Filters** — category, price presets / custom range, debounced search; desktop sidebar + mobile drawer
- **Sort** — recommended, newest, popular, price asc/desc
- **Pagination** — crawlable `<Link>` prev / page / next controls
- **UX states** — loading skeleton, pending transition dim, empty state, error boundary
- **Layout** — announcement bar, header (mobile menu), hero, footer
- **Styling** — CSS Modules + design tokens in `app/globals.css`
- **Icons** — SVG files under `public/icons/` (no inline icon components)

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
  lib/                     # API client, searchParams helpers, constants
  public/icons/            # SVG icons
  types/                   # Shared TypeScript types
```

## Notes

- The frontend never calls FakeStore directly — only this project’s backend.
- Inter is used as the body font (Simplon Norm from the design file is not freely available).
- Keep the backend running while developing; otherwise `app/error.tsx` will surface an API failure state.
