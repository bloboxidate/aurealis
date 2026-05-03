/**
 * Product type and server loaders. Catalog lives in Supabase `public.products` — manage via the admin app.
 * @see supabase/migrations/00002_products.sql
 */
export { categories, type Product } from '@/lib/products/types';
export { getAllProducts, getProductById, getProductBySlug, getProductsByIds } from '@/lib/products/service';
