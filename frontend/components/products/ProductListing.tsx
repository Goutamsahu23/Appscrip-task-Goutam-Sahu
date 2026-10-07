'use client';

import { useState } from 'react';

import type { ParsedSearchParams } from '@/lib/searchParams';
import type { Category, Product } from '@/types/product';

import { FilterDrawer } from './FilterDrawer';
import { FilterSidebar } from './FilterSidebar';
import { ProductGrid } from './ProductGrid';
import styles from './ProductListing.module.css';
import { Toolbar } from './Toolbar';

type ProductListingProps = {
  total: number;
  current: ParsedSearchParams;
  products: Product[];
  categories: Category[];
};

export function ProductListing({
  total,
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
