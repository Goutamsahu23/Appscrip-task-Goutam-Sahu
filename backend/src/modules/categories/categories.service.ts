import { prisma } from '../../lib/prisma';

type CategoryListRow = {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    products: number;
  };
};

export async function listCategories() {
  const categories: CategoryListRow[] = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    productCount: category._count.products,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  }));
}
