'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

import { SORT_OPTIONS } from '@/lib/constants';
import { hrefWithParams, type ParsedSearchParams } from '@/lib/searchParams';
import type { SortValue } from '@/types/product';

import { useNavigationPending } from './NavigationPending';
import styles from './SortDropdown.module.css';

type SortDropdownProps = {
  current: ParsedSearchParams;
};

export function SortDropdown({ current }: SortDropdownProps) {
  const router = useRouter();
  const { isPending, startTransition } = useNavigationPending();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const activeOption =
    SORT_OPTIONS.find((option) => option.value === current.sort) ?? SORT_OPTIONS[0];

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  function selectSort(value: SortValue | undefined) {
    setOpen(false);
    startTransition(() => {
      router.push(hrefWithParams(current, { sort: value, page: null }));
    });
  }

  return (
    <div className={styles.wrap} ref={rootRef} data-pending={isPending ? 'true' : 'false'}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {activeOption?.label}
        <Image src="/icons/chevron-down.svg" alt="" width={16} height={16} />
      </button>

      {open ? (
        <ul className={styles.menu} id={menuId} role="listbox">
          {SORT_OPTIONS.map((option) => {
            const selected = option.value === current.sort;
            return (
              <li key={option.label} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`${styles.option} ${selected ? styles.optionActive : ''}`}
                  onClick={() => selectSort(option.value)}
                >
                  <span className={styles.label}>{option.label}</span>
                  <span className={styles.checkSlot} aria-hidden="true">
                    {selected ? (
                      <Image src="/icons/check.svg" alt="" width={16} height={16} />
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
