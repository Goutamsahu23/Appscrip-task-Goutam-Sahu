import styles from './ProductSkeleton.module.css';

type ProductGridSkeletonProps = {
  count?: number;
};

export function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps) {
  return (
    <ul className={styles.grid} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className={styles.card}>
          <div className={`${styles.media} ${styles.pulse}`} />
          <div className={styles.lines}>
            <div className={`${styles.line} ${styles.lineTitle} ${styles.pulse}`} />
            <div className={`${styles.line} ${styles.linePrice} ${styles.pulse}`} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ProductListingSkeleton() {
  return (
    <>
      <div className={styles.hero} aria-hidden="true">
        <div className={`${styles.heroTitle} ${styles.pulse}`} />
        <div className={`${styles.heroText} ${styles.pulse}`} />
        <div className={`${styles.heroText} ${styles.heroTextShort} ${styles.pulse}`} />
      </div>

      <div className={styles.listing} aria-busy="true" aria-live="polite">
        <span className="srOnly">Loading products</span>
        <div className={styles.toolbar}>
          <div className={`${styles.toolbarBlock} ${styles.toolbarLeft} ${styles.pulse}`} />
          <div className={`${styles.toolbarBlock} ${styles.toolbarRight} ${styles.pulse}`} />
        </div>
        <div className={styles.body}>
          <div className={styles.filters}>
            <div className={`${styles.filterBlock} ${styles.pulse}`} />
            <div className={`${styles.filterBlock} ${styles.filterTall} ${styles.pulse}`} />
            <div className={`${styles.filterBlock} ${styles.filterTall} ${styles.pulse}`} />
          </div>
          <ProductGridSkeleton />
        </div>
      </div>
    </>
  );
}
