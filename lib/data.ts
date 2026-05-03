/** Product type and server loaders. Catalog is sourced from Sariee (see `lib/products/service.ts`). */
export { categories, type Product } from '@/lib/products/types';
export { getAllProducts, getProductById, getProductBySlug, getProductsByIds } from '@/lib/products/service';
