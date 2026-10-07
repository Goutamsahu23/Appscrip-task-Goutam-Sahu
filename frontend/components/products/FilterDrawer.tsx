'use client';

import Image from 'next/image';
import { useEffect } from 'react';

import type { ParsedSearchParams } from '@/lib/searchParams';
import type { Category } from '@/types/product';

import { FilterSidebar } from './FilterSidebar';
import styles from './FilterDrawer.module.css';

type FilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  current: ParsedSearchParams;
};

export function FilterDrawer({ open, onClose, categories, current }: FilterDrawerProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className={styles.overlay}
        aria-label="Close filters overlay"
        onClick={onClose}
      />
      <aside className={styles.panel} aria-label="Filters" role="dialog" aria-modal="true">
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
