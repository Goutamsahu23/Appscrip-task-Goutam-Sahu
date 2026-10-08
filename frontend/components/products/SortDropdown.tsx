'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  const activeIndex = Math.max(
    0,
    SORT_OPTIONS.findIndex((option) => option.value === current.sort),
  );
  const activeOption = SORT_OPTIONS[activeIndex] ?? SORT_OPTIONS[0];

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  function closeMenu(restoreFocus = true) {
    setOpen(false);
    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  }

  function selectSort(value: SortValue | undefined) {
    closeMenu();
    startTransition(() => {
      router.push(hrefWithParams(current, { sort: value, page: null }));
    });
  }

  function focusItem(index: number) {
    const next = (index + SORT_OPTIONS.length) % SORT_OPTIONS.length;
    itemRefs.current[next]?.focus();
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!open) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        closeMenu();
        break;
      case 'ArrowDown': {
        event.preventDefault();
        const currentIdx = itemRefs.current.findIndex((el) => el === document.activeElement);
        focusItem(currentIdx < 0 ? 0 : currentIdx + 1);
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const currentIdx = itemRefs.current.findIndex((el) => el === document.activeElement);
        focusItem(currentIdx < 0 ? SORT_OPTIONS.length - 1 : currentIdx - 1);
        break;
      }
      case 'Home':
        event.preventDefault();
        focusItem(0);
        break;
      case 'End':
        event.preventDefault();
        focusItem(SORT_OPTIONS.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div
      className={styles.wrap}
      ref={rootRef}
      data-pending={isPending ? 'true' : 'false'}
      onKeyDown={onMenuKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {activeOption?.label}
        <Image src="/icons/chevron-down.svg" alt="" width={16} height={16} />
      </button>

      {open ? (
        <div className={styles.menu} id={menuId} role="menu" aria-label="Sort products">
          {SORT_OPTIONS.map((option, index) => {
            const selected = option.value === current.sort;
            return (
              <button
                key={option.label}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
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
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
