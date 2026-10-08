# Appscrip Task — Product Listing (mettā muse)

Full-stack product listing page (PLP) built against the [Appscrip design](https://www.figma.com/file/N0Tv7yYLf3kfMLQjUncUlx/Design-Task---PLP). The Next.js storefront SSR’s products from a custom Express + Prisma + PostgreSQL API. Seed data may be pulled from FakeStore once; the app never calls FakeStore from the frontend.

**Author:** Goutam Sahu  
**Repo:** [github.com/Goutamsahu23/Appscrip-task-Goutam-Sahu](https://github.com/Goutamsahu23/Appscrip-task-Goutam-Sahu)

---

## 1. Live URLs

| Surface | URL |
| --- | --- |
| Frontend | _TODO — add deployed Next.js URL (e.g. Vercel)_ |
| API | _TODO — add deployed API URL (e.g. Render / Railway)_ |

Local defaults while developing:

| Surface | URL |
| --- | --- |
| Frontend | http://localhost:3000 |
| API | http://localhost:4000/api |

---

## 2. Tech stack and why

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | **Next.js 15 (App Router) + React 19 + TypeScript** | Assignment prefers App Router; SSR and `generateMetadata` are first-class; TypeScript catches URL/API shape bugs early. |
| Styling | **CSS Modules + design tokens** | Matches “minimum pre-built JS packages” — no UI kit; scoped styles without Tailwind/CSS-in-JS overhead. |
| Backend | **Express 5 + TypeScript** | NestJS was preferred but Express with a modular layout keeps the surface small and clear for a GET-only API. |
| Validation | **Zod** | Shared-style runtime validation for env and query/params; clear 400 error details. |
| ORM / DB | **Prisma + PostgreSQL** | Typed models, migrations, seed; Postgres fits filter/sort/search with proper indexes. |
| Logging | **Pino + pino-http** | Structured request logs without a heavy APM stack. |
| Images | **Local files served by Express + `next/image`** | SEO-friendly filenames after seed; AVIF/WebP via Next optimizer. |

---

## 3. Setup steps (local)

### Prerequisites

- Node.js 20+
- PostgreSQL running locally (or a reachable instance)
- npm

### Backend + database

```bash
cd backend
cp .env.example .env
# Edit DATABASE_URL, CORS_ORIGIN (e.g. http://localhost:3000)
# Optional: PUBLIC_URL=http://localhost:4000

npm install
npm run db:migrate
npm run db:seed    # loads FakeStore data + downloads images to public/images/products/
npm run dev        # http://localhost:4000
```

Seed behaviour:

1. Tries `https://fakestoreapi.com/products`
2. Falls back to `backend/prisma/data/fakestore-products.json` if FakeStore is down
3. Downloads images into `backend/public/images/products/<seo-slug>.<ext>` and stores paths in the DB

### Frontend

```bash
cd frontend
cp .env.example .env.local
# API_URL=http://localhost:4000/api
# SITE_URL=http://localhost:3000

npm install
npm run dev        # http://localhost:3000
```

Keep the API running while developing; otherwise the storefront shows the error boundary.

---

## 4. Architecture overview and folder structure

```text
Browser
  └─ Next.js (SSR page.tsx → getProducts / getCategories)
       └─ Express API (/api/*)
            └─ Prisma → PostgreSQL
            └─ Static /images/products/* (seeded files)
```

- **SSR:** The home page fetches products on the server. Filter/sort/search/pagination update the URL; Next navigates without a full document reload while still re-rendering from the server.
- **URL as state:** `page`, `limit`, `category`, `minPrice`, `maxPrice`, `sort`, `q` are shareable and crawlable.
- **Frontend never talks to FakeStore** — only to this API.

```text
Appscrip-task-Goutam-Sahu/
├── README.md                 # This file
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   ├── seed.ts
│   │   └── data/fakestore-products.json
│   ├── public/images/products/   # gitignored; created by seed
│   └── src/
│       ├── app.ts / server.ts
│       ├── config/env.ts
│       ├── middlewares/
│       ├── modules/
│       │   ├── products/
│       │   └── categories/
│       └── routes/
└── frontend/
    ├── app/                  # layout, page, loading, error
    ├── components/
    │   ├── layout/           # header, footer, announcement, search
    │   ├── products/         # grid, filters, sort, pagination
    │   └── seo/              # JSON-LD
    ├── lib/                  # api, searchParams, metadata, a11y
    ├── public/icons/
    └── types/
```

More frontend detail: [`frontend/README.md`](frontend/README.md).

---

## 5. API endpoint list

Base URL (local): `http://localhost:4000/api`  
All routes are **GET** only. Errors use a consistent shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [{ "path": "minPrice", "message": "..." }]
  }
}
```

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/categories` | Categories with `productCount`, ordered by name |
| `GET` | `/products` | Paginated list (filter, sort, search) |
| `GET` | `/products/:id` | Single product with category + images |

### `GET /products` query params

| Query | Type | Default | Notes |
| --- | --- | --- | --- |
| `page` | integer | `1` | >= 1 |
| `limit` | integer | `12` | Max 100 |
| `category` | string | — | Slug, e.g. `electronics` |
| `minPrice` | number | — | >= 0 |
| `maxPrice` | number | — | >= `minPrice` when both set |
| `sort` | string | — | `price_asc` \| `price_desc` \| `rating_desc` \| `newest` |
| `q` | string | — | Case-insensitive title/description search (max 100) |

```bash
curl "http://localhost:4000/api/products?category=electronics&minPrice=50&sort=price_asc"
curl "http://localhost:4000/api/products/1"
curl "http://localhost:4000/api/categories"
```

Static product images: `GET http://localhost:4000/images/products/<slug>.png`

---

## 6. SSR approach and SEO decisions

### SSR

- `app/page.tsx` is an async Server Component.
- `getProducts` / `getCategories` run on the server (`API_URL` is server-only).
- Wrapped in React `cache()` so `generateMetadata` and the page share one fetch per request.
- Categories use `revalidate: 300`; product lists use `cache: 'no-store'` so filter changes stay fresh.
- Client interactions use `router.push` + `useTransition` so the URL updates without a full reload; view-source still shows real product HTML on first load.

### SEO

| Decision | Implementation |
| --- | --- |
| Unique titles/descriptions | `generateMetadata` from category, search, and page |
| Canonical | Keeps `category` + `page` only (sort/price/`q`/`limit` variants map back) |
| Open Graph / Twitter | Set via metadata + `SITE_URL` / `metadataBase` |
| Structured data | JSON-LD `ItemList` of `Product` + `BreadcrumbList` |
| Headings | Single `h1` (hero), listing `h2` (sr-only “Products”), cards as `h3` |
| Images | SEO filenames from seed, meaningful `alt`, `next/image` AVIF/WebP, `priority` on first row |
| Breadcrumb | Semantic `<nav>` (mobile-visible per design) |

Sample Lighthouse (desktop, local production audit of `/`): Accessibility **96**, Best Practices **96**, SEO **91**.

---

## 7. Dependencies used and why

### Frontend (runtime)

| Package | Why |
| --- | --- |
| `next` | App Router, SSR, routing, image optimization |
| `react` / `react-dom` | UI required by Next.js |

No UI kit, no Redux, no axios. Filters, sort, pagination, focus trap, and search are hand-rolled.

Dev-only: TypeScript, ESLint, Prettier, `@types/*`.

### Backend (runtime)

| Package | Why |
| --- | --- |
| `express` | HTTP server and routing |
| `cors` | Allow only the Next.js origin |
| `zod` | Env + request validation |
| `prisma` / `@prisma/client` | Schema, migrations, queries |
| `dotenv` | Load `.env` in development |
| `pino` / `pino-http` | Structured logging |

Dev-only: TypeScript, ESLint, Prettier, `tsx`, `pino-pretty`.

---

## 8. AI usage

This project was built with **Cursor** (AI-assisted IDE) as a coding partner, not as an unsupervised generator.

**What AI helped with**

- Scaffolding Express/Prisma modules and Next.js App Router structure
- Implementing URL-driven filters, sort, pagination, and SSR data fetching
- SEO (metadata, JSON-LD, image seeding) and accessibility (focus trap, keyboard sort menu)
- README drafts and iterative UI polish against the Figma brief

**What I owned / verified**

- Assignment requirements, scope cuts (e.g. no static HTML step when deferred), and design trade-offs
- Running migrations, seed, typecheck, lint, and manual browser checks
- Confirming SSR in view-source, API contracts, and Lighthouse sample scores
- Final code review before commit — AI suggestions were edited when they didn’t match the design or brief

**What AI did not do**

- Deploy production hosting or invent fake live URLs
- Replace understanding of the stack — prompts and reviews stayed requirement-driven

---

## 9. Known limitations and what I’d improve with more time

| Limitation | Improvement |
| --- | --- |
| Figma filter accordions (Ideal For, Fabric, etc.) aren’t in FakeStore data | Extend the schema with attributes and wire real facets |
| Simplon Norm isn’t freely licensed | Keep Inter, or license Simplon if the client provides it |
| Header wishlist / cart / profile are visual-only | Wire real routes or hide until implemented |
| No product detail page UI | Build `/products/[id]` using existing `GET /products/:id` |
| ~20 seeded products | Larger catalog + pagination stress tests |
| Live deploy URLs not filled in yet | Deploy frontend (Vercel) + API/DB (Render/Railway) and update §1 |
| Search `ILIKE` on description is heavier than title alone | Full-text search (`tsvector`) or dedicated search service |
| No automated e2e tests | Playwright for filter/sort/pagination + SSR smoke tests |
| Rate limiting / auth omitted (not required) | Add if the API is public on the internet |
| Payment badges are simplified SVGs | Swap for official brand assets if licensing allows |

---

## Environment variables (summary)

### Backend (`backend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `CORS_ORIGIN` | yes | Allowed origins (comma-separated) |
| `PORT` | no | Default `4000` |
| `PUBLIC_URL` | no | Absolute image URL base (default `http://localhost:4000`) |
| `NODE_ENV` | no | `development` \| `test` \| `production` |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
| --- | --- | --- |
| `API_URL` | yes | API base, e.g. `http://localhost:4000/api` |
| `SITE_URL` | no | Canonical / OG origin (default `http://localhost:3000`) |

Never commit `.env` / `.env.local`.

---

## Design deviations (brief)

- **Filters:** Category, price, and header search only — FakeStore has no Ideal For / Fabric fields.
- **Font:** Inter instead of Simplon Norm.
- **New product badge:** Removed per product feedback during build.
