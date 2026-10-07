'use client';

import Image from 'next/image';

import type { ParsedSearchParams } from '@/lib/searchParams';

import { SortDropdown } from './SortDropdown';
import styles from './Toolbar.module.css';

type ToolbarProps = {
  total: number;
  current: ParsedSearchParams;
  filtersVisible: boolean;
  onToggleFilters: () => void;
  onOpenMobileFilters: () => void;
};

export function Toolbar({
  total,
  current,
  filtersVisible,
  onToggleFilters,
  onOpenMobileFilters,
}: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <p className={styles.count} data-testid="item-count">
          {total} Items
        </p>
        <button type="button" className={styles.filterToggle} onClick={onToggleFilters}>
          <Image
            className={`${styles.filterToggleIcon} ${filtersVisible ? '' : styles.filterToggleIconHidden}`}
            src="/icons/chevron-left.svg"
            alt=""
            width={16}
            height={16}
          />
          {filtersVisible ? 'Hide filter' : 'Show filter'}
        </button>
      </div>

      <div className={styles.right}>
        <button type="button" className={styles.mobileFilter} onClick={onOpenMobileFilters}>
          Filter
          <Image src="/icons/chevron-down.svg" alt="" width={14} height={14} />
        </button>
        <div className={styles.sortSlot}>
          <SortDropdown current={current} />
        </div>
      </div>
    </div>
  );
}
