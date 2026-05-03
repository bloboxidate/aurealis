import 'server-only';

import type { Product } from '@/lib/products/types';
import {
  fetchSarieeListAllJson,
  fetchSingleProductById,
  fetchSingleProductBySlug,
  productsFromListJson,
} from '@/lib/sariee/catalog-fetch';
import { isSarieeConfigured } from '@/lib/sariee/config';

/**
 * Product catalog from Sariee (`/api/frontend/products/list-all`, `single-product`).
 * Requires `SARIEE_API_BEARER_TOKEN` (and valid Sariee store context).
 */
export async function getAllProducts(): Promise<Product[]> {
  if (!isSarieeConfigured()) return [];
  const json = await fetchSarieeListAllJson();
  if (json == null) return [];
  return productsFromListJson(json);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (!isSarieeConfigured()) return undefined;
  const p = await fetchSingleProductById(id);
  return p ?? undefined;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSarieeConfigured()) return undefined;
  const p = await fetchSingleProductBySlug(slug);
  return p ?? undefined;
}

export async function getProductsByIds(ids: string[]): Promise<Map<string, Product>> {
  const map = new Map<string, Product>();
  if (ids.length === 0) return map;
  const all = await getAllProducts();
  const want = new Set(ids);
  for (const p of all) {
    if (want.has(p.id)) map.set(p.id, p);
  }
  for (const id of ids) {
    if (map.has(id)) continue;
    const one = await fetchSingleProductById(id);
    if (one) map.set(id, one);
  }
  return map;
}
