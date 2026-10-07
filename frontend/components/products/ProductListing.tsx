'use client';

import { useState } from 'react';

import type { ParsedSearchParams } from '@/lib/searchParams';
import type { Category, Product } from '@/types/product';

import { FilterDrawer } from './FilterDrawer';
import { FilterSidebar } from './FilterSidebar';
import { Pagination } from './Pagination';
import { ProductGrid } from './ProductGrid';
import styles from './ProductListing.module.css';
import { Toolbar } from './Toolbar';

type ProductListingProps = {
  total: number;
  totalPages: number;
  page: number;
  current: ParsedSearchParams;
  products: Product[];
  categories: Category[];
};

export function ProductListing({
  total,
  totalPages,
  page,
  current,
  products,
  categories,
}: ProductListingProps) {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <section className={styles.listing}>
      <Toolbar
        total={total}
        current={current}
        filtersVisible={filtersVisible}
        onToggleFilters={() => setFiltersVisible((value) => !value)}
        onOpenMobileFilters={() => setDrawerOpen(true)}
      />

      <div
        className={`${styles.body} ${filtersVisible ? '' : styles.bodyFiltersHidden}`}
        data-filters={filtersVisible ? 'visible' : 'hidden'}
      >
        {filtersVisible ? (
          <aside className={styles.filters} aria-label="Filters">
            <FilterSidebar categories={categories} current={current} />
          </aside>
        ) : null}
        <div className={styles.content}>
          <ProductGrid products={products} />
          <Pagination current={current} page={page} totalPages={totalPages} />
        </div>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={categories}
        current={current}
      />
    </section>
  );
}
