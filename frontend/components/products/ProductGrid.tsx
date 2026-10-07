import type { Product } from '@/types/product';

import { ProductCard } from './ProductCard';
import styles from './ProductGrid.module.css';

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <ul className={styles.grid}>
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard product={product} showNewBadge={index === 0} />
        </li>
      ))}
    </ul>
  );
}
