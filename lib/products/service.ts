import 'server-only';
import type { Product } from '@/lib/products/types';
import type { Database } from '@/types/database';
import { getSupabaseServer } from '@/lib/supabase/server';

type ProductRow = Database['public']['Tables']['products']['Row'];

export function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name_en: row.name_en,
    name_ar: row.name_ar,
    description_en: row.description_en,
    description_ar: row.description_ar,
    price: row.price_egp,
    category: row.category as Product['category'],
    image: row.image,
    in_stock: row.in_stock,
    featured: row.featured,
  };
}

/**
 * Fetches all products from Supabase. Returns [] if not configured or on error.
 */
export async function getAllProducts(): Promise<Product[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return [];
  const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[getAllProducts]', error.message);
    }
    return [];
  }
  return (data as ProductRow[]).map(mapRowToProduct);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const supabase = await getSupabaseServer();
  if (!supabase) return undefined;
  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
  if (error || !data) return undefined;
  return mapRowToProduct(data as ProductRow);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = await getSupabaseServer();
  if (!supabase) return undefined;
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
  if (error || !data) return undefined;
  return mapRowToProduct(data as ProductRow);
}

export async function getProductsByIds(ids: string[]): Promise<Map<string, Product>> {
  const map = new Map<string, Product>();
  if (ids.length === 0) return map;
  const supabase = await getSupabaseServer();
  if (!supabase) return map;
  const { data, error } = await supabase.from('products').select('*').in('id', [...new Set(ids)]);
  if (error || !data) {
    if (process.env.NODE_ENV === 'development' && error) {
      console.error('[getProductsByIds]', error.message);
    }
    return map;
  }
  for (const row of data as ProductRow[]) {
    const p = mapRowToProduct(row);
    map.set(p.id, p);
  }
  return map;
}
