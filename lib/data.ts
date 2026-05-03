/**
 * Product type and server loaders. Catalog lives in Supabase `public.products` — manage via the admin app.
 * Catalog is loaded from Sariee (see `lib/products/service.ts`).
 */
export { categories, type Product } from '@/lib/products/types';
export { getAllProducts, getProductById, getProductBySlug, getProductsByIds } from '@/lib/products/service';
