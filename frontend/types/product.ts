export type Category = {
  id: number;
  name: string;
  slug: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductImage = {
  id: number;
  url: string;
  alt: string | null;
  position: number;
  productId: number;
};

export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  ratingRate: number;
  ratingCount: number;
  categoryId: number;
  category: ProductCategory;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
};

export type ProductsMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProductsResponse = {
  data: Product[];
  meta: ProductsMeta;
};

export type CategoriesResponse = {
  data: Category[];
};

export type SortValue = 'price_asc' | 'price_desc' | 'rating_desc' | 'newest';

export type ProductQuery = {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortValue;
  q?: string;
};
