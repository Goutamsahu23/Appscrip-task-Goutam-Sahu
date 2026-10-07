import { Hero } from '@/components/products/Hero';
import { ProductListing } from '@/components/products/ProductListing';
import { getProducts } from '@/lib/api';
import { SORT_OPTIONS } from '@/lib/constants';
import { parseSearchParams, toProductQuery } from '@/lib/searchParams';

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const rawParams = await searchParams;
  const params = parseSearchParams(rawParams);
  const { meta } = await getProducts(toProductQuery(params));

  const activeSort =
    SORT_OPTIONS.find((option) => option.value === params.sort)?.label ?? 'RECOMMENDED';

  return (
    <main>
      <Hero />
      <ProductListing total={meta.total} current={params}>
        {/* Temporary SSR proof until the product grid ships */}
        <p className="srOnly" data-testid="item-count">
          {meta.total} Items
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.6 }}>
          Showing <strong data-testid="ssr-total">{meta.total}</strong> products.
          <br />
          Active sort: <strong data-testid="ssr-sort">{activeSort}</strong>
          {params.category ? (
            <>
              <br />
              Category: <strong>{params.category}</strong>
            </>
          ) : null}
        </p>
      </ProductListing>
    </main>
  );
}
