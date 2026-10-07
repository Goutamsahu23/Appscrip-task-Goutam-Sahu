import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <p className={styles.breadcrumb}>
        Home
        <span className={styles.breadcrumbSep}>|</span>
        <span className={styles.breadcrumbCurrent}>Shop</span>
      </p>
      <h1 className={styles.title}>Discover our products</h1>
      <p className={styles.description}>
        Lorem ipsum dolor sit amet consectetur. Amet est posuere rhoncus scelerisque. Dolor integer
        scelerisque nibh amet mi ut elementum dolor.
      </p>
    </section>
  );
}
