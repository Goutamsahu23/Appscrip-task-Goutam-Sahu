'use client';

import { useState, type ReactNode } from 'react';

import type { ParsedSearchParams } from '@/lib/searchParams';

import styles from './ProductListing.module.css';
import { Toolbar } from './Toolbar';

type ProductListingProps = {
  total: number;
  current: ParsedSearchParams;
  children: ReactNode;
};

export function ProductListing({ total, current, children }: ProductListingProps) {
  const [filtersVisible, setFiltersVisible] = useState(true);

  return (
    <section className={styles.listing}>
      <Toolbar
        total={total}
        current={current}
        filtersVisible={filtersVisible}
        onToggleFilters={() => setFiltersVisible((value) => !value)}
      />

      <div
        className={`${styles.body} ${filtersVisible ? '' : styles.bodyFiltersHidden}`}
        data-filters={filtersVisible ? 'visible' : 'hidden'}
      >
        {filtersVisible ? (
          <aside className={styles.filtersPlaceholder} aria-label="Filters">
            Filter sidebar will land in the next steps.
          </aside>
        ) : null}
        <div className={styles.content}>{children}</div>
      </div>
    </section>
  );
}
