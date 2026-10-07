import Image from 'next/image';

import type { Product } from '@/types/product';

import styles from './ProductCard.module.css';

type ProductCardProps = {
  product: Product;
  showNewBadge?: boolean;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function ProductCard({ product, showNewBadge = false }: ProductCardProps) {
  const image = product.images[0];
  const imageSrc = image?.url ?? '/icons/logo-mark.svg';
  const imageAlt = image?.alt ?? product.title;

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {showNewBadge ? <span className={styles.badge}>New product</span> : null}
        <Image
          className={styles.image}
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h2 className={styles.title} title={product.title}>
            {product.title}
          </h2>
          <button type="button" className={styles.wishlist} aria-label="Add to wishlist">
            <Image src="/icons/heart.svg" alt="" width={18} height={18} />
          </button>
        </div>
        <p className={styles.price}>{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
