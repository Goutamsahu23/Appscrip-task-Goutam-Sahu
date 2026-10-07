import type { SortValue } from '@/types/product';

export type SortOption = {
  label: string;
  value: SortValue | undefined;
};

export const SORT_OPTIONS: SortOption[] = [
  { label: 'RECOMMENDED', value: undefined },
  { label: 'NEWEST FIRST', value: 'newest' },
  { label: 'POPULAR', value: 'rating_desc' },
  { label: 'PRICE: HIGH TO LOW', value: 'price_desc' },
  { label: 'PRICE: LOW TO HIGH', value: 'price_asc' },
];

export const DEFAULT_PAGE_SIZE = 12;
