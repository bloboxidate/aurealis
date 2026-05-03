import 'server-only';

import { sarieeFetch } from '@/lib/sariee/client';
import { mapSarieeItemToProduct } from '@/lib/sariee/catalog-mapper';
import { extractArray, parseJsonUnknown } from '@/lib/sariee/json-helpers';
import type { Product } from '@/lib/products/types';

async function readJson(res: Response): Promise<unknown> {
  const text = await res.text();
  return parseJsonUnknown(text);
}

export async function fetchSarieeListAllJson(): Promise<unknown | null> {
  const res = await sarieeFetch('/api/frontend/products/list-all', { method: 'GET' });
  if (!res.ok) return null;
  return readJson(res);
}

export async function fetchSarieeSingleProductJson(query: Record<string, string>): Promise<unknown | null> {
  const qs = new URLSearchParams(query).toString();
  const path = `/api/frontend/products/single-product${qs ? `?${qs}` : ''}`;
  const res = await sarieeFetch(path, { method: 'GET' });
  if (!res.ok) return null;
  return readJson(res);
}

function extractSingleProductPayload(json: unknown): unknown {
  const r = json !== null && typeof json === 'object' && !Array.isArray(json) ? (json as Record<string, unknown>) : null;
  if (!r) return null;
  for (const k of ['data', 'product', 'item', 'result']) {
    const v = r[k];
    if (v !== undefined && v !== null) return v;
  }
  return json;
}

/**
 * Map Sariee list-all JSON to Product[] (skips unparseable rows).
 */
export function productsFromListJson(json: unknown): Product[] {
  const items = extractArray(json);
  const out: Product[] = [];
  for (const item of items) {
    const p = mapSarieeItemToProduct(item);
    if (p) out.push(p);
  }
  return out;
}

export function productFromSingleJson(json: unknown): Product | null {
  const payload = extractSingleProductPayload(json);
  return mapSarieeItemToProduct(payload);
}

/** Try the two most common query key patterns for Sariee / Laravel storefronts. */
export async function fetchSingleProductBySlug(slug: string): Promise<Product | null> {
  const tries: Record<string, string>[] = [
    { slug },
    { seo_link: slug },
  ];
  for (const q of tries) {
    const json = await fetchSarieeSingleProductJson(q);
    const p = json ? productFromSingleJson(json) : null;
    if (p && (p.slug === slug || p.id === slug)) return p;
  }
  return null;
}

export async function fetchSingleProductById(id: string): Promise<Product | null> {
  const json = await fetchSarieeSingleProductJson({ id });
  return json ? productFromSingleJson(json) : null;
}

async function fetchProductListEndpoint(path: string): Promise<Product[]> {
  const res = await sarieeFetch(path, { method: 'GET' });
  if (!res.ok) return [];
  const json = await readJson(res);
  return productsFromListJson(json);
}

export async function fetchRelatedProducts(productId: string): Promise<Product[]> {
  return fetchProductListEndpoint(
    `/api/frontend/products/related-featured?product_id=${encodeURIComponent(productId)}&id=${encodeURIComponent(productId)}`
  );
}

export async function fetchBestSellingProducts(): Promise<Product[]> {
  return fetchProductListEndpoint('/api/frontend/products/best-selling');
}

export async function fetchRecommendedProducts(): Promise<Product[]> {
  return fetchProductListEndpoint('/api/frontend/products/recommended');
}

export async function fetchFilterData(): Promise<unknown> {
  const res = await sarieeFetch('/api/frontend/products/filter-data', { method: 'GET' });
  if (!res.ok) return null;
  return readJson(res);
}
