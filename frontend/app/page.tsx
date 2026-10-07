import { getProducts } from '@/lib/api';
import { parseSearchParams, toProductQuery } from '@/lib/searchParams';

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const rawParams = await searchParams;
  const params = parseSearchParams(rawParams);
  const { meta } = await getProducts(toProductQuery(params));

  return (
    <main style={{ padding: '48px 24px', fontFamily: 'var(--font-body), sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '12px' }}>DISCOVER OUR PRODUCTS</h1>
      <p data-testid="item-count">{meta.total} ITEMS</p>
      {params.category ? <p>category: {params.category}</p> : null}
      {params.sort ? <p>sort: {params.sort}</p> : null}
      {params.q ? <p>q: {params.q}</p> : null}
    </main>
  );
}
