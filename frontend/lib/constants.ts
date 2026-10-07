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

export type PricePreset = {
  label: string;
  minPrice?: number;
  maxPrice?: number;
};

export const PRICE_PRESETS: PricePreset[] = [
  { label: 'Under $50', maxPrice: 50 },
  { label: '$50 – $100', minPrice: 50, maxPrice: 100 },
  { label: '$100 – $200', minPrice: 100, maxPrice: 200 },
  { label: '$200 & above', minPrice: 200 },
];

export const NAV_LINKS = [
  { label: 'SHOP', href: '#' },
  { label: 'SKILLS', href: '#' },
  { label: 'STORIES', href: '#' },
  { label: 'ABOUT', href: '#' },
  { label: 'CONTACT US', href: '#' },
] as const;

export const FOOTER_BRAND_LINKS = [
  'About Us',
  'Stories',
  'Artisans',
  'Boutiques',
  'Contact Us',
  'EU Compliances Docs',
] as const;

export const FOOTER_QUICK_LINKS = [
  'Orders & Shipping',
  'Join/Login as a Seller',
  'Payment & Pricing',
  'Return & Refunds',
  'FAQs',
  'Privacy Policy',
  'Terms & Conditions',
] as const;
