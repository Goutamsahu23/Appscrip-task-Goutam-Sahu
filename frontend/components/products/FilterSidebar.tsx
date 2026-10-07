'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { PRICE_PRESETS } from '@/lib/constants';
import { hrefWithParams, type ParsedSearchParams } from '@/lib/searchParams';
import type { Category } from '@/types/product';

import styles from './FilterSidebar.module.css';

type FilterSidebarProps = {
  categories: Category[];
  current: ParsedSearchParams;
  onNavigate?: () => void;
};

export function FilterSidebar({ categories, current, onNavigate }: FilterSidebarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [query, setQuery] = useState(current.q ?? '');
  const [minInput, setMinInput] = useState(current.minPrice?.toString() ?? '');
  const [maxInput, setMaxInput] = useState(current.maxPrice?.toString() ?? '');

  useEffect(() => {
    setQuery(current.q ?? '');
    setMinInput(current.minPrice?.toString() ?? '');
    setMaxInput(current.maxPrice?.toString() ?? '');
  }, [current.q, current.minPrice, current.maxPrice]);

  useEffect(() => {
    const trimmed = query.trim();
    const nextQ = trimmed || undefined;

    if (nextQ === current.q) return;

    const timer = window.setTimeout(() => {
      startTransition(() => {
        router.push(hrefWithParams(current, { q: nextQ, page: null }));
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [query, current, router]);

  function navigate(changes: Parameters<typeof hrefWithParams>[1]) {
    startTransition(() => {
      router.push(hrefWithParams(current, changes));
      onNavigate?.();
    });
  }

  const hasActiveFilters =
    Boolean(current.category) ||
    current.minPrice !== undefined ||
    current.maxPrice !== undefined ||
    Boolean(current.q);

  function isPresetActive(minPrice?: number, maxPrice?: number) {
    return current.minPrice === minPrice && current.maxPrice === maxPrice;
  }

  function applyCustomPrice() {
    const minPrice = minInput.trim() === '' ? undefined : Number(minInput);
    const maxPrice = maxInput.trim() === '' ? undefined : Number(maxInput);

    if (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) return;
    if (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) return;
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) return;

    navigate({ minPrice, maxPrice, page: null });
  }

  return (
    <div className={styles.sidebar} data-pending={isPending ? 'true' : 'false'}>
      <label className={styles.search}>
        <Image src="/icons/search.svg" alt="" width={16} height={16} />
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search products"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search products"
        />
      </label>

      {hasActiveFilters ? (
        <button
          type="button"
          className={styles.clearAll}
          onClick={() =>
            navigate({
              category: undefined,
              minPrice: undefined,
              maxPrice: undefined,
              q: undefined,
              page: null,
            })
          }
        >
          Clear all
        </button>
      ) : null}

      <section className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          aria-expanded={categoryOpen}
          onClick={() => setCategoryOpen((value) => !value)}
        >
          Category
          <Image
            className={`${styles.sectionHeaderIcon} ${categoryOpen ? styles.sectionHeaderIconOpen : ''}`}
            src="/icons/chevron-down.svg"
            alt=""
            width={16}
            height={16}
          />
        </button>

        {categoryOpen ? (
          <div className={styles.sectionBody}>
            <div className={styles.options} role="radiogroup" aria-label="Category">
              <button
                type="button"
                className={styles.option}
                role="radio"
                aria-checked={!current.category}
                onClick={() => navigate({ category: undefined, page: null })}
              >
                <span
                  className={`${styles.radio} ${!current.category ? styles.radioActive : ''}`}
                />
                All
              </button>

              {categories.map((category) => {
                const selected = current.category === category.slug;
                return (
                  <button
                    key={category.id}
                    type="button"
                    className={styles.option}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => navigate({ category: category.slug, page: null })}
                  >
                    <span className={`${styles.radio} ${selected ? styles.radioActive : ''}`} />
                    {category.name}
                    <span className={styles.count}>{category.productCount}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </section>

      <section className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          aria-expanded={priceOpen}
          onClick={() => setPriceOpen((value) => !value)}
        >
          Price
          <Image
            className={`${styles.sectionHeaderIcon} ${priceOpen ? styles.sectionHeaderIconOpen : ''}`}
            src="/icons/chevron-down.svg"
            alt=""
            width={16}
            height={16}
          />
        </button>

        {priceOpen ? (
          <div className={styles.sectionBody}>
            <div className={styles.presets}>
              {PRICE_PRESETS.map((preset) => {
                const active = isPresetActive(preset.minPrice, preset.maxPrice);
                return (
                  <button
                    key={preset.label}
                    type="button"
                    className={styles.preset}
                    aria-pressed={active}
                    onClick={() =>
                      navigate({
                        minPrice: active ? undefined : preset.minPrice,
                        maxPrice: active ? undefined : preset.maxPrice,
                        page: null,
                      })
                    }
                  >
                    <span
                      className={`${styles.checkbox} ${active ? styles.checkboxActive : ''}`}
                    />
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className={styles.rangeRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Min</span>
                <input
                  className={styles.fieldInput}
                  type="number"
                  min={0}
                  step="1"
                  inputMode="decimal"
                  value={minInput}
                  onChange={(event) => setMinInput(event.target.value)}
                  placeholder="0"
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Max</span>
                <input
                  className={styles.fieldInput}
                  type="number"
                  min={0}
                  step="1"
                  inputMode="decimal"
                  value={maxInput}
                  onChange={(event) => setMaxInput(event.target.value)}
                  placeholder="Any"
                />
              </label>
              <button type="button" className={styles.apply} onClick={applyCustomPrice}>
                Apply
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
