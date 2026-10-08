import Link from 'next/link';

import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <Link href="/" className={styles.breadcrumbLink}>
              Home
            </Link>
          </li>
          <li aria-hidden="true" className={styles.breadcrumbSep}>
            |
          </li>
          <li>
            <span className={styles.breadcrumbCurrent} aria-current="page">
              Shop
            </span>
          </li>
        </ol>
      </nav>
      <h1 className={styles.title}>Discover our products</h1>
      <p className={styles.description}>
        Lorem ipsum dolor sit amet consectetur. Amet est posuere rhoncus scelerisque. Dolor integer
        scelerisque nibh amet mi ut elementum dolor.
      </p>
    </section>
  );
}
