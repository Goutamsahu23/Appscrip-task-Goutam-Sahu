import type { Metadata } from 'next';

import type { ParsedSearchParams } from '@/lib/searchParams';
import { getSiteUrl, humanizeSlug } from '@/lib/site';
import type { Product } from '@/types/product';

export function buildCanonicalPath(params: ParsedSearchParams): string {
  const search = new URLSearchParams();
  if (params.category) search.set('category', params.category);
  if (params.page > 1) search.set('page', String(params.page));
  const query = search.toString();
  return query ? `/?${query}` : '/';
}

export function buildPageMetadata(
  params: ParsedSearchParams,
  products: Product[],
  total: number,
): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalPath = buildCanonicalPath(params);
  const canonicalUrl = `${siteUrl}${canonicalPath === '/' ? '' : canonicalPath}`;

  let title = 'Discover Our Products | mettā muse';
  let description =
    'Browse our curated product listing with filters, sorting, and pagination from mettā muse.';

  if (params.q) {
    title = `Search results for ${params.q} | mettā muse`;
    description = `Found ${total} product${total === 1 ? '' : 's'} matching “${params.q}”.`;
  } else if (params.category) {
    const label = humanizeSlug(params.category);
    title =
      params.page > 1
        ? `${label} – Page ${params.page} | mettā muse`
        : `${label} | mettā muse`;
    description = `Shop ${label.toLowerCase()} at mettā muse. ${total} product${total === 1 ? '' : 's'} available.`;
  } else if (params.page > 1) {
    title = `Discover Our Products – Page ${params.page} | mettā muse`;
  }

  const firstImage = products[0]?.images[0]?.url;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      siteName: 'mettā muse',
      ...(firstImage
        ? {
            images: [
              {
                url: firstImage,
                alt: products[0]?.images[0]?.alt ?? products[0]?.title ?? 'Product',
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(firstImage ? { images: [firstImage] } : {}),
    },
  };
}
