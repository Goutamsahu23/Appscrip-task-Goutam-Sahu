# Appscrip Backend (API)

Express 5 + TypeScript + Prisma + PostgreSQL products API for the mettā muse PLP. Seed loads FakeStore once into Postgres; the frontend never calls FakeStore.

Live API:

- Products: [https://appscrip-task-goutam-sahu.onrender.com/api/products](https://appscrip-task-goutam-sahu.onrender.com/api/products)
- Categories: [https://appscrip-task-goutam-sahu.onrender.com/api/categories](https://appscrip-task-goutam-sahu.onrender.com/api/categories)

`/api` alone has no index route (404). Use `/api/products` or `/api/categories`.

Monorepo overview: [`../README.md`](../README.md).

---

## Prerequisites

- Node.js 20+
- PostgreSQL (local or remote)
- npm

---

## Local setup

```bash
cd backend
cp .env.example .env
# Edit DATABASE_URL and CORS_ORIGIN (see below)
npm install
```

Create the database if needed:

```sql
CREATE DATABASE appscrip;
```

Then:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

API base: **http://localhost:4000/api**  
Smoke check: open http://localhost:4000/api/products

---

## Environment variables

Copy [`.env.example`](.env.example) → `.env`. Never commit `.env`.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | yes | — | Postgres connection string |
| `CORS_ORIGIN` | yes | — | Allowed origins, comma-separated (e.g. `http://localhost:3000`) |
| `PORT` | no | `4000` | HTTP listen port |
| `PUBLIC_URL` | no | `http://localhost:4000` | Prefix for relative image paths (unused when DB stores absolute FakeStore URLs) |
| `NODE_ENV` | no | `development` | `development` \| `test` \| `production` |

### Local `.env` example

```env
NODE_ENV=development
PORT=4000
PUBLIC_URL=http://localhost:4000
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/appscrip?schema=public
```

### Production (Render) example

```env
NODE_ENV=production
DATABASE_URL=<Internal or External Postgres URL>
PUBLIC_URL=https://appscrip-task-goutam-sahu.onrender.com
CORS_ORIGIN=https://appscrip-task-goutam-sahu.vercel.app
```

Leave `PORT` unset on Render (platform injects it).

**Build / start on Render**

```bash
# Build
npm install && npx prisma generate && npm run build

# Start (migrate at runtime if using Internal DB URL)
npx prisma migrate deploy && npm start
```

If you use the **External** DB URL, you can also run `prisma migrate deploy` in the build step.

---

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run `node dist/server.js` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm run db:generate` | `prisma generate` |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | Seed categories + products |
| `npm run db:studio` | Prisma Studio |

---

## Seed

```bash
npm run db:seed
```

1. Tries `https://fakestoreapi.com/products`
2. Falls back to `prisma/data/fakestore-products.json` if FakeStore is down
3. Upserts **4 categories** + **20 products**
4. Stores each product’s FakeStore `image` URL in `ProductImage.url` (absolute `https://fakestoreapi.com/img/...`)

Safe to re-run (upserts by FakeStore product id).

### Seed production DB from your machine

Use the Render Postgres **External** URL:

```bash
cd backend
# Set DATABASE_URL in .env to External URL, e.g. ...@dpg-….oregon-postgres.render.com/appscrip_db?sslmode=require
npm run db:seed
```

Or run `npx prisma db seed` in the Render service shell (Internal URL works there).

---

## API reference

**Base (local):** `http://localhost:4000/api`  
**Base (live):** `https://appscrip-task-goutam-sahu.onrender.com/api`  

All routes are **GET** only.

### Error shape

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [{ "path": "minPrice", "message": "..." }]
  }
}
```

| HTTP | Code | When |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Invalid query or params |
| 404 | `PRODUCT_NOT_FOUND` / `NOT_FOUND` | Missing product / unknown route |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected failure |

---

### `GET /categories`

Categories with `productCount`, ordered by name.

**Response `200`**

```json
{
  "data": [
    {
      "id": 1,
      "name": "electronics",
      "slug": "electronics",
      "productCount": 6,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### `GET /products`

Paginated list with filter, sort, and search.

| Query | Type | Default | Notes |
| --- | --- | --- | --- |
| `page` | integer | `1` | >= 1 |
| `limit` | integer | `12` | 1–100 |
| `category` | string | — | Slug, e.g. `electronics`, `mens-clothing` |
| `minPrice` | number | — | >= 0 |
| `maxPrice` | number | — | Must be >= `minPrice` when both set |
| `sort` | string | — | `price_asc` \| `price_desc` \| `rating_desc` \| `newest` |
| `q` | string | — | Case-insensitive title/description search (max 100) |

**Response `200`**

```json
{
  "data": [ /* product objects */ ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 20,
    "totalPages": 2
  }
}
```

Each product includes `category`, `images` (with absolute FakeStore `url`), `price`, ratings, etc.

---

### `GET /products/:id`

Single product by numeric id.

- **200:** `{ "data": { /* product */ } }`
- **404:** `{ "error": { "code": "PRODUCT_NOT_FOUND", "message": "..." } }`

---

## Curl smoke tests

With `npm run dev` running:

```bash
# Categories
curl -s "http://localhost:4000/api/categories"

# Default product list
curl -s "http://localhost:4000/api/products"

# Filter + sort
curl -s "http://localhost:4000/api/products?category=electronics&minPrice=50&sort=price_asc"

# Search
curl -s "http://localhost:4000/api/products?q=jacket"

# Pagination
curl -s "http://localhost:4000/api/products?page=2&limit=8"

# Single product
curl -s "http://localhost:4000/api/products/1"

# Not found → expect 404
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:4000/api/products/99999"

# Validation → expect 400
curl -s "http://localhost:4000/api/products?minPrice=100&maxPrice=10"

# Bare /api → expect 404
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:4000/api"
```

**Live**

```bash
curl -s "https://appscrip-task-goutam-sahu.onrender.com/api/categories"
curl -s "https://appscrip-task-goutam-sahu.onrender.com/api/products"
curl -s "https://appscrip-task-goutam-sahu.onrender.com/api/products/1"
```

(Render free tier may cold-start for 30–60s.)

There is no Jest/supertest suite yet; the curls above are the API smoke checks.

---

## Project structure

```text
backend/
  prisma/
    schema.prisma
    migrations/
    seed.ts
    data/fakestore-products.json
  src/
    app.ts / server.ts
    config/env.ts
    middlewares/          # cors logging, validate, errors, 404
    modules/
      products/           # routes, controller, service, schema
      categories/
    routes/index.ts       # mounts /products, /categories under /api
  public/images/          # optional; seed uses FakeStore URLs in DB
```

---

## Notes

- Frontend `API_URL` must point at this API’s **base** (`…/api`), not `/api/products`.
- Set `CORS_ORIGIN` to the Next.js origin or browser requests from the storefront will fail (SSR still works server-side).
- Product images are FakeStore absolute URLs stored in the DB — no need to commit image files for deploy.
