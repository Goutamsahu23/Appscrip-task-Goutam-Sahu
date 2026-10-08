import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type FakeStoreProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function loadProducts(): Promise<FakeStoreProduct[]> {
  try {
    const response = await fetch('https://fakestoreapi.com/products');

    if (response.ok) {
      console.log('Loaded products from FakeStore API');
      return (await response.json()) as FakeStoreProduct[];
    }

    console.warn(`FakeStore API returned ${response.status}, using local snapshot`);
  } catch (error) {
    console.warn('FakeStore API unreachable, using local snapshot', error);
  }

  // Same FakeStore dataset, kept locally so seed still works when the API is down
  const snapshotPath = path.join(process.cwd(), 'prisma', 'data', 'fakestore-products.json');
  const raw = await readFile(snapshotPath, 'utf8');
  return JSON.parse(raw) as FakeStoreProduct[];
}

async function main() {
  const products = await loadProducts();
  const categoryNames = [...new Set(products.map((product) => product.category))];

  // Remote DBs (e.g. Render) need a higher interactive timeout than the 5s default
  await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const categoriesBySlug = new Map<string, { id: number }>();

      for (const name of categoryNames) {
        const slug = toSlug(name);
        const category = await tx.category.upsert({
          where: { slug },
          create: { name, slug },
          update: { name },
        });
        categoriesBySlug.set(slug, category);
      }

      for (const item of products) {
        const slug = toSlug(item.category);
        const category = categoriesBySlug.get(slug);

        if (!category) {
          throw new Error(`No category mapped for "${item.category}"`);
        }

        // Store FakeStore image URL as-is; API returns absolute URLs unchanged
        await tx.product.upsert({
          where: { id: item.id },
          create: {
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            ratingRate: item.rating.rate,
            ratingCount: item.rating.count,
            categoryId: category.id,
            images: {
              create: {
                url: item.image,
                alt: item.title,
                position: 0,
              },
            },
          },
          update: {
            title: item.title,
            description: item.description,
            price: item.price,
            ratingRate: item.rating.rate,
            ratingCount: item.rating.count,
            categoryId: category.id,
            images: {
              deleteMany: {},
              create: {
                url: item.image,
                alt: item.title,
                position: 0,
              },
            },
          },
        });
      }
    },
    { timeout: 60_000 },
  );

  // Explicit ids leave the serial sequence behind; nudge it forward
  await prisma.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('"Product"', 'id'),
      COALESCE((SELECT MAX(id) FROM "Product"), 1)
    )
  `;

  console.log(`Seeded ${categoryNames.length} categories and ${products.length} products`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
