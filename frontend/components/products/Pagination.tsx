import Image from 'next/image';
import Link from 'next/link';

import { hrefWithParams, type ParsedSearchParams } from '@/lib/searchParams';

import styles from './Pagination.module.css';

type PaginationProps = {
  current: ParsedSearchParams;
  page: number;
  totalPages: number;
};

function getPageItems(page: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | 'ellipsis'> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push('ellipsis');

  for (let value = start; value <= end; value += 1) {
    items.push(value);
  }

  if (end < totalPages - 1) items.push('ellipsis');

  items.push(totalPages);
  return items;
}

export function Pagination({ current, page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const previousHref = page > 1 ? hrefWithParams(current, { page: page - 1 }) : null;
  const nextHref = page < totalPages ? hrefWithParams(current, { page: page + 1 }) : null;
  const pageItems = getPageItems(page, totalPages);

  return (
    <nav className={styles.nav} aria-label="Pagination">
      <ul className={styles.list}>
        <li>
          {previousHref ? (
            <Link className={styles.link} href={previousHref} aria-label="Previous page" rel="prev">
              <Image
                className={styles.arrowIcon}
                src="/icons/chevron-left.svg"
                alt=""
                width={16}
                height={16}
              />
            </Link>
          ) : (
            <span className={styles.disabled} aria-disabled="true" aria-label="Previous page">
              <Image
                className={styles.arrowIcon}
                src="/icons/chevron-left.svg"
                alt=""
                width={16}
                height={16}
              />
            </span>
          )}
        </li>

        {pageItems.map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`}>
              <span className={styles.ellipsis} aria-hidden="true">
                …
              </span>
            </li>
          ) : (
            <li key={item}>
              {item === page ? (
                <span className={styles.pageCurrent} aria-current="page">
                  {item}
                </span>
              ) : (
                <Link
                  className={styles.link}
                  href={hrefWithParams(current, { page: item })}
                  aria-label={`Page ${item}`}
                >
                  {item}
                </Link>
              )}
            </li>
          ),
        )}

        <li>
          {nextHref ? (
            <Link className={styles.link} href={nextHref} aria-label="Next page" rel="next">
              <Image
                className={`${styles.arrowIcon} ${styles.arrowNext}`}
                src="/icons/chevron-left.svg"
                alt=""
                width={16}
                height={16}
              />
            </Link>
          ) : (
            <span className={styles.disabled} aria-disabled="true" aria-label="Next page">
              <Image
                className={`${styles.arrowIcon} ${styles.arrowNext}`}
                src="/icons/chevron-left.svg"
                alt=""
                width={16}
                height={16}
              />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
