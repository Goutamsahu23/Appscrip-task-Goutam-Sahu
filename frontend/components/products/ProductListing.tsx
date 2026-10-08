'use client';

import { useRef, useState } from 'react';

import type { ParsedSearchParams } from '@/lib/searchParams';
import type { Category, Product } from '@/types/product';

import { EmptyState } from './EmptyState';
import { FilterDrawer } from './FilterDrawer';
import { FilterSidebar } from './FilterSidebar';
import { NavigationPendingProvider, useNavigationPending } from './NavigationPending';
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

export function ProductListing(props: ProductListingProps) {
  return (
    <NavigationPendingProvider>
      <ProductListingInner {...props} />
    </NavigationPendingProvider>
  );
}

function ProductListingInner({
  total,
  totalPages,
  page,
  current,
  products,
  categories,
}: ProductListingProps) {
  const { isPending } = useNavigationPending();
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mobileFilterRef = useRef<HTMLButtonElement>(null);
  const isEmpty = products.length === 0;

  return (
    <section className={styles.listing} data-pending={isPending ? 'true' : 'false'}>
      <Toolbar
        total={total}
        current={current}
        filtersVisible={filtersVisible}
        onToggleFilters={() => setFiltersVisible((value) => !value)}
        onOpenMobileFilters={() => setDrawerOpen(true)}
        mobileFilterRef={mobileFilterRef}
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
        <div
          className={`${styles.content} ${isPending ? styles.contentPending : ''}`}
          aria-busy={isPending}
        >
          <h2 className="srOnly">Products</h2>
          {isEmpty ? (
            <EmptyState current={current} />
          ) : (
            <>
              <ProductGrid products={products} filtersVisible={filtersVisible} />
              <Pagination current={current} page={page} totalPages={totalPages} />
            </>
          )}
        </div>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={categories}
        current={current}
        triggerRef={mobileFilterRef}
      />
    </section>
  );
}
