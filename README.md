# Appscrip Products API

Node.js backend for browsing products and categories. Built with Express, TypeScript, Prisma, and PostgreSQL.

The API reads from its own database. Seed data comes from the FakeStore product set (live API when available, local snapshot otherwise). The frontend should call this API only — not FakeStore directly.

## Prerequisites

- Node.js 20+
- PostgreSQL running locally (or a reachable instance)
- npm

## Setup

```bash
cd backend
cp .env.example .env
# edit .env with your DATABASE_URL and CORS_ORIGIN
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Server defaults to `http://localhost:4000`.

## Environment variables

Copy [`backend/.env.example`](backend/.env.example) to `backend/.env`. Never commit `.env`.

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | no | `development` \| `test` \| `production` (default `development`) |
| `PORT` | no | HTTP port (default `4000`) |
| `CORS_ORIGIN` | yes | Comma-separated allowed origins, e.g. `http://localhost:3000` |
| `DATABASE_URL` | yes | PostgreSQL connection string for Prisma |

## Scripts

Run these from `backend/`:

| Script | What it does |
| --- | --- |
| `npm run dev` | Start API with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server |
| `npm run typecheck` | Type-check without emit |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed categories, products, images |
| `npm run db:generate` | Regenerate Prisma Client |
| `npm run db:studio` | Open Prisma Studio |

## API

Base URL: `http://localhost:4000/api`

All endpoints below are `GET` only.

### `GET /categories`

List categories ordered by name, with product counts.

**Example**

```bash
curl "http://localhost:4000/api/categories"
```

**Response**

```json
{
  "data": [
    {
      "id": 3,
      "name": "electronics",
      "slug": "electronics",
      "productCount": 6,
      "createdAt": "2026-10-07T06:21:58.787Z",
      "updatedAt": "2026-10-07T06:22:03.385Z"
    }
  ]
}
```

### `GET /products`

Paginated product list with filtering, sorting, and search.

| Query | Type | Default | Notes |
| --- | --- | --- | --- |
| `page` | integer | `1` | Must be >= 1 |
| `limit` | integer | `12` | Max `100` |
| `category` | string | — | Category slug, e.g. `mens-clothing` |
| `minPrice` | number | — | >= 0 |
| `maxPrice` | number | — | >= 0; must be >= `minPrice` when both set |
| `sort` | string | — | `price_asc` \| `price_desc` \| `rating_desc` \| `newest` |
| `q` | string | — | Case-insensitive search on title and description (max 100 chars) |

**Examples**

```bash
# first page
curl "http://localhost:4000/api/products?page=1&limit=12"

# filter + sort
curl "http://localhost:4000/api/products?category=electronics&minPrice=50&maxPrice=200&sort=price_asc"

# search
curl "http://localhost:4000/api/products?q=jacket"
```

**Response**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      "description": "...",
      "price": 109.95,
      "ratingRate": 3.9,
      "ratingCount": 120,
      "categoryId": 1,
      "category": {
        "id": 1,
        "name": "men's clothing",
        "slug": "mens-clothing"
      },
      "images": [
        {
          "id": 1,
          "url": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
          "alt": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
          "position": 0,
          "productId": 1
        }
      ],
      "createdAt": "2026-10-07T06:21:58.792Z",
      "updatedAt": "2026-10-07T06:22:03.391Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 20,
    "totalPages": 2
  }
}
```

`price` is always a JSON number (not a string).

### `GET /products/:id`

Single product with category and images.

**Example**

```bash
curl "http://localhost:4000/api/products/1"
```

**Response**

```json
{
  "data": {
    "id": 1,
    "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    "price": 109.95,
    "category": { "id": 1, "name": "men's clothing", "slug": "mens-clothing" },
    "images": []
  }
}
```

Missing product:

```bash
curl -i "http://localhost:4000/api/products/9999"
```

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with id 9999 not found"
  }
}
```

## Errors

Every error uses the same shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      { "path": "minPrice", "message": "minPrice must be less than or equal to maxPrice" }
    ]
  }
}
```

`details` is optional.

| Status | When |
| --- | --- |
| `400` | Validation failed, or malformed JSON body |
| `404` | Unknown route, or product not found |
| `500` | Unexpected server error (stack only in non-production) |

Common codes: `VALIDATION_ERROR`, `BAD_REQUEST`, `ROUTE_NOT_FOUND`, `PRODUCT_NOT_FOUND`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`.

## Database schema

Models:

- **Category** — `name`, unique `slug`
- **Product** — title, description, `price` (decimal), rating fields, FK to category
- **ProductImage** — url, optional alt, position; cascade-deletes with the product

Indexes used for list/filter/sort:

- `Product(categoryId)`, `Product(price)`, `Product(categoryId, price)`
- `Product(ratingRate)`, `Product(createdAt)`
- `ProductImage(productId)`
- GIN trigram index on `Product.title` (`pg_trgm`) for search

Migrations live in `backend/prisma/migrations/`. Seed script: `backend/prisma/seed.ts`.
