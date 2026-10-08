import { Prisma } from '@prisma/client';

import { env } from '../../config/env';
import { NotFoundError } from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import type { ListProductsQuery } from './products.schema';

function toAbsoluteImageUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const base = env.PUBLIC_URL.replace(/\/$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
}

const productInclude = {
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  images: {
    orderBy: { position: 'asc' as const },
  },
};

type ProductRow = {
  id: number;
  title: string;
  description: string;
  price: Prisma.Decimal;
  ratingRate: number;
  ratingCount: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  images: Array<{
    id: number;
    url: string;
    alt: string | null;
    position: number;
    productId: number;
  }>;
};

function serializeProduct(product: ProductRow) {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: Number(product.price),
    ratingRate: product.ratingRate,
    ratingCount: product.ratingCount,
    categoryId: product.categoryId,
    category: product.category,
    images: product.images.map((image) => ({
      ...image,
      url: toAbsoluteImageUrl(image.url),
    })),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function buildWhere(query: ListProductsQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (query.category) {
    where.category = { slug: query.category };
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {};
    if (query.minPrice !== undefined) {
      where.price.gte = query.minPrice;
    }
    if (query.maxPrice !== undefined) {
      where.price.lte = query.maxPrice;
    }
  }

  const search = query.q?.trim();
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  return where;
}

function buildOrderBy(sort?: ListProductsQuery['sort']): Prisma.ProductOrderByWithRelationInput[] {
  // Keep id as a tiebreaker so page results don't shuffle between requests
  switch (sort) {
    case 'price_asc':
      return [{ price: 'asc' }, { id: 'asc' }];
    case 'price_desc':
      return [{ price: 'desc' }, { id: 'asc' }];
    case 'rating_desc':
      return [{ ratingRate: 'desc' }, { id: 'asc' }];
    case 'newest':
      return [{ createdAt: 'desc' }, { id: 'asc' }];
    default:
      return [{ id: 'asc' }];
  }
}

export async function listProducts(query: ListProductsQuery) {
  const { page, limit } = query;
  const where = buildWhere(query);
  const orderBy = buildOrderBy(query.sort);
  const skip = (page - 1) * limit;

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: productInclude,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return {
    data: (products as ProductRow[]).map(serializeProduct),
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export async function getProductById(id: number) {
  const product = (await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  })) as ProductRow | null;

  if (!product) {
    throw new NotFoundError(`Product with id ${id} not found`, 'PRODUCT_NOT_FOUND');
  }

  return serializeProduct(product);
}
