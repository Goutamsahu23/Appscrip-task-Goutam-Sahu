'use client';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useId, useRef, useState, useTransition } from 'react';

import styles from './Header.module.css';

export function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const trimmed = query.trim();
    const currentQ = searchParams.get('q') ?? undefined;
    const nextQ = trimmed || undefined;

    if (nextQ === currentQ) return;

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextQ) {
        params.set('q', nextQ);
      } else {
        params.delete('q');
      }
      params.delete('page');

      const href = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      startTransition(() => {
        router.push(href);
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [query, open, searchParams, pathname, router]);

  return (
    <div
      ref={rootRef}
      className={styles.searchWrap}
      data-pending={isPending ? 'true' : 'false'}
    >
      <button
        type="button"
        className={styles.iconButton}
        aria-label={open ? 'Close search' : 'Search'}
        aria-expanded={open}
        aria-controls={inputId}
        onClick={() => setOpen((value) => !value)}
      >
        <Image src="/icons/search.svg" alt="" width={20} height={20} />
      </button>

      {open ? (
        <label className={styles.searchField} htmlFor={inputId}>
          <span className="srOnly">Search products</span>
          <input
            ref={inputRef}
            id={inputId}
            className={styles.searchInput}
            type="search"
            placeholder="Search products"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      ) : null}
    </div>
  );
}
