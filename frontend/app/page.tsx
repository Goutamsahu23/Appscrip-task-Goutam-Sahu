import { Hero } from '@/components/products/Hero';
import { ProductListing } from '@/components/products/ProductListing';
import { getProducts } from '@/lib/api';
import { parseSearchParams, toProductQuery } from '@/lib/searchParams';

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const rawParams = await searchParams;
  const params = parseSearchParams(rawParams);
  const { data, meta } = await getProducts(toProductQuery(params));

  return (
    <main>
      <Hero />
      <ProductListing total={meta.total} current={params} products={data} />
    </main>
  );
}
