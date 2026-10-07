import type { Product } from '@/types/product';

import { ProductCard } from './ProductCard';
import styles from './ProductGrid.module.css';

type ProductGridProps = {
  products: Product[];
  filtersVisible?: boolean;
};

export function ProductGrid({ products, filtersVisible = true }: ProductGridProps) {
  return (
    <ul className={`${styles.grid} ${filtersVisible ? styles.cols3 : styles.cols4}`}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
