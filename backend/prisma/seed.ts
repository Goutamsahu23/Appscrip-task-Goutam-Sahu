import 'dotenv/config';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'products');
const MAX_SLUG_LENGTH = 80;

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

function extensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'].includes(ext)) {
      return ext;
    }
  } catch {
    // ignore malformed URLs
  }
  return '.jpg';
}

function uniqueImageSlug(title: string, used: Set<string>): string {
  let base = toSlug(title).slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, '');
  if (!base) base = 'product';

  let candidate = base;
  let suffix = 2;
  while (used.has(candidate)) {
    const trailer = `-${suffix}`;
    candidate = `${base.slice(0, MAX_SLUG_LENGTH - trailer.length)}${trailer}`;
    suffix += 1;
  }

  used.add(candidate);
  return candidate;
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

async function downloadProductImage(
  remoteUrl: string,
  slug: string,
): Promise<{ url: string; downloaded: boolean }> {
  const ext = extensionFromUrl(remoteUrl);
  const filename = `${slug}${ext}`;
  const absolutePath = path.join(IMAGES_DIR, filename);
  const relativeUrl = `/images/products/${filename}`;

  try {
    const response = await fetch(remoteUrl, {
      headers: { 'User-Agent': 'AppscripSeed/1.0' },
    });

    if (!response.ok) {
      console.warn(`Image download failed (${response.status}) for ${remoteUrl}, keeping remote URL`);
      return { url: remoteUrl, downloaded: false };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(absolutePath, buffer);
    return { url: relativeUrl, downloaded: true };
  } catch (error) {
    console.warn(`Image download error for ${remoteUrl}, keeping remote URL`, error);
    return { url: remoteUrl, downloaded: false };
  }
}

async function main() {
  const products = await loadProducts();
  const categoryNames = [...new Set(products.map((product) => product.category))];
  const usedSlugs = new Set<string>();

  await mkdir(IMAGES_DIR, { recursive: true });

  let downloadedCount = 0;
  const imageUrls = new Map<number, string>();

  for (const item of products) {
    const slug = uniqueImageSlug(item.title, usedSlugs);
    const result = await downloadProductImage(item.image, slug);
    imageUrls.set(item.id, result.url);
    if (result.downloaded) downloadedCount += 1;
  }

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

        const imageUrl = imageUrls.get(item.id) ?? item.image;

        // Keep FakeStore ids so re-running the seed updates the same rows
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
                url: imageUrl,
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
                url: imageUrl,
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

  console.log(
    `Seeded ${categoryNames.length} categories and ${products.length} products (${downloadedCount} images downloaded)`,
  );
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
