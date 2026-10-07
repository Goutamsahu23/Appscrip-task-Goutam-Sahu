import type { ProductQuery, SortValue } from '@/types/product';

import { DEFAULT_PAGE_SIZE, SORT_OPTIONS } from './constants';

const SORT_VALUES = new Set(
  SORT_OPTIONS.map((option) => option.value).filter(Boolean) as SortValue[],
);

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function toPositiveInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return undefined;
  return parsed;
}

function toNonNegativeNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return parsed;
}

export type ParsedSearchParams = {
  page: number;
  limit: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortValue;
  q?: string;
};

export function parseSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ParsedSearchParams {
  const page = toPositiveInt(firstValue(raw.page)) ?? 1;
  const limit = Math.min(toPositiveInt(firstValue(raw.limit)) ?? DEFAULT_PAGE_SIZE, 100);

  const categoryRaw = firstValue(raw.category)?.trim();
  const category =
    categoryRaw && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(categoryRaw) ? categoryRaw : undefined;

  let minPrice = toNonNegativeNumber(firstValue(raw.minPrice));
  let maxPrice = toNonNegativeNumber(firstValue(raw.maxPrice));

  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    minPrice = undefined;
    maxPrice = undefined;
  }

  const sortRaw = firstValue(raw.sort);
  const sort =
    sortRaw && SORT_VALUES.has(sortRaw as SortValue) ? (sortRaw as SortValue) : undefined;

  const qRaw = firstValue(raw.q)?.trim();
  const q = qRaw && qRaw.length <= 100 ? qRaw : undefined;

  return {
    page,
    limit,
    category,
    minPrice,
    maxPrice,
    sort,
    q,
  };
}

export function toProductQuery(params: ParsedSearchParams): ProductQuery {
  return {
    page: params.page,
    limit: params.limit,
    category: params.category,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    sort: params.sort,
    q: params.q,
  };
}

export function buildQuery(
  current: ParsedSearchParams,
  changes: Partial<ParsedSearchParams> & { page?: number | null },
): string {
  const next: ParsedSearchParams = {
    ...current,
    ...changes,
    page: changes.page === null ? 1 : (changes.page ?? current.page),
  };

  // Reset to page 1 when filters or sort change (unless page was set explicitly)
  const filterChanged =
    ('category' in changes ||
      'minPrice' in changes ||
      'maxPrice' in changes ||
      'sort' in changes ||
      'q' in changes) &&
    !('page' in changes);

  if (filterChanged) {
    next.page = 1;
  }

  const search = new URLSearchParams();

  if (next.page > 1) search.set('page', String(next.page));
  if (next.limit !== DEFAULT_PAGE_SIZE) search.set('limit', String(next.limit));
  if (next.category) search.set('category', next.category);
  if (next.minPrice !== undefined) search.set('minPrice', String(next.minPrice));
  if (next.maxPrice !== undefined) search.set('maxPrice', String(next.maxPrice));
  if (next.sort) search.set('sort', next.sort);
  if (next.q) search.set('q', next.q);

  const query = search.toString();
  return query ? `?${query}` : '/';
}

export function hrefWithParams(
  current: ParsedSearchParams,
  changes: Partial<ParsedSearchParams> & { page?: number | null },
): string {
  const query = buildQuery(current, changes);
  return query.startsWith('?') ? `/${query}` : query;
}
