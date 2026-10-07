import Link from 'next/link';

import type { ParsedSearchParams } from '@/lib/searchParams';

import styles from './EmptyState.module.css';

type EmptyStateProps = {
  current: ParsedSearchParams;
};

export function EmptyState({ current }: EmptyStateProps) {
  const hasFilters =
    Boolean(current.category) ||
    current.minPrice !== undefined ||
    current.maxPrice !== undefined ||
    Boolean(current.q);

  return (
    <div className={styles.empty} role="status" data-testid="empty-state">
      <h2 className={styles.title}>No products found</h2>
      <p className={styles.message}>
        {hasFilters
          ? 'Try adjusting your search or filters to see more results.'
          : 'There are no products to show right now. Please check back later.'}
      </p>
      {hasFilters ? (
        <Link className={styles.action} href="/">
          Clear filters
        </Link>
      ) : null}
    </div>
  );
}
