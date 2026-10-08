'use client';

import Image from 'next/image';
import { useRef, type RefObject } from 'react';

import type { ParsedSearchParams } from '@/lib/searchParams';
import { useFocusTrap } from '@/lib/useFocusTrap';
import type { Category } from '@/types/product';

import { FilterSidebar } from './FilterSidebar';
import styles from './FilterDrawer.module.css';

type FilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  current: ParsedSearchParams;
  triggerRef?: RefObject<HTMLButtonElement | null>;
};

export function FilterDrawer({
  open,
  onClose,
  categories,
  current,
  triggerRef,
}: FilterDrawerProps) {
  const panelRef = useRef<HTMLElement>(null);
  useFocusTrap(panelRef, { open, onClose, restoreFocusRef: triggerRef });

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className={styles.overlay}
        aria-label="Close filters overlay"
        tabIndex={-1}
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        className={styles.panel}
        aria-label="Filters"
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Filters</h2>
          <button type="button" className={styles.close} aria-label="Close filters" onClick={onClose}>
            <Image src="/icons/x.svg" alt="" width={22} height={22} />
          </button>
        </div>
        <div className={styles.body}>
          <FilterSidebar categories={categories} current={current} onNavigate={onClose} />
        </div>
      </aside>
    </>
  );
}
