import { getSiteUrl, humanizeSlug } from '@/lib/site';
import type { Product } from '@/types/product';

type ProductListJsonLdProps = {
  products: Product[];
  categorySlug?: string;
  page: number;
  pageSize: number;
};

function escapeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function ProductListJsonLd({
  products,
  categorySlug,
  page,
  pageSize,
}: ProductListJsonLdProps) {
  const siteUrl = getSiteUrl();

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: siteUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Shop',
      item: `${siteUrl}/`,
    },
  ];

  if (categorySlug) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: humanizeSlug(categorySlug),
      item: `${siteUrl}/?category=${encodeURIComponent(categorySlug)}`,
    });
  }

  const itemList = {
    '@type': 'ItemList',
    name: categorySlug
      ? `${humanizeSlug(categorySlug)} products`
      : 'Discover our products',
    numberOfItems: products.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: products.map((product, index) => {
      const image = product.images[0];
      return {
        '@type': 'ListItem',
        position: (page - 1) * pageSize + index + 1,
        item: {
          '@type': 'Product',
          name: product.title,
          description: product.description,
          image: image?.url ? [image.url] : undefined,
          sku: String(product.id),
          category: product.category.name,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
          aggregateRating:
            product.ratingCount > 0
              ? {
                  '@type': 'AggregateRating',
                  ratingValue: product.ratingRate,
                  reviewCount: product.ratingCount,
                }
              : undefined,
        },
      };
    }),
  };

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
      },
      itemList,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(graph) }}
    />
  );
}
