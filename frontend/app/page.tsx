import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Hero } from '@/components/products/Hero';
import { ProductListing } from '@/components/products/ProductListing';
import { ProductListJsonLd } from '@/components/seo/ProductListJsonLd';
import { getCategories, getProducts } from '@/lib/api';
import { buildPageMetadata } from '@/lib/metadata';
import { hrefWithParams, parseSearchParams, toProductQuery } from '@/lib/searchParams';

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const rawParams = await searchParams;
  const params = parseSearchParams(rawParams);
  const { data, meta } = await getProducts(toProductQuery(params));
  return buildPageMetadata(params, data, meta.total);
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const rawParams = await searchParams;
  const params = parseSearchParams(rawParams);

  const [{ data, meta }, { data: categories }] = await Promise.all([
    getProducts(toProductQuery(params)),
    getCategories(),
  ]);

  if (meta.totalPages > 0 && params.page > meta.totalPages) {
    redirect(hrefWithParams(params, { page: meta.totalPages }));
  }

  return (
    <main id="main-content">
      <ProductListJsonLd
        products={data}
        categorySlug={params.category}
        page={meta.page}
        pageSize={meta.limit}
      />
      <Hero />
      <ProductListing
        total={meta.total}
        totalPages={meta.totalPages}
        page={meta.page}
        current={params}
        products={data}
        categories={categories}
      />
    </main>
  );
}
