import { cache } from 'react';

import type { CategoriesResponse, ProductQuery, ProductsResponse } from '@/types/product';

function getApiUrl(): string {
  const url = process.env.API_URL;

  if (!url) {
    throw new Error('API_URL is not set. Copy frontend/.env.example to .env.local');
  }

  return url.replace(/\/$/, '');
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, init);

  if (!response.ok) {
    throw new Error(`API request failed (${response.status}) for ${path}`);
  }

  return (await response.json()) as T;
}

export const getProducts = cache(async (params: ProductQuery = {}): Promise<ProductsResponse> => {
  const search = new URLSearchParams();

  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.category) search.set('category', params.category);
  if (params.minPrice !== undefined) search.set('minPrice', String(params.minPrice));
  if (params.maxPrice !== undefined) search.set('maxPrice', String(params.maxPrice));
  if (params.sort) search.set('sort', params.sort);
  if (params.q) search.set('q', params.q);

  const query = search.toString();
  return apiFetch<ProductsResponse>(`/products${query ? `?${query}` : ''}`, {
    cache: 'no-store',
  });
});

export const getCategories = cache(async (): Promise<CategoriesResponse> => {
  return apiFetch<CategoriesResponse>('/categories', {
    next: { revalidate: 300 },
  });
});
