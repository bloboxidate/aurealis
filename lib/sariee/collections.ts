import 'server-only';

import { sarieeFetch } from './client';
import { extractArray, asRecord } from './json-helpers';
import { productsFromListJson } from './catalog-fetch';
import type { Product } from '@/lib/products/types';

function tryParse(text: string): unknown {
  try { return JSON.parse(text); } catch { return null; }
}

export type SarieeCollection = {
  id: string | number;
  slug: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  image: string;
  products_count: number;
};

function mapCollection(raw: unknown): SarieeCollection | null {
  const r = asRecord(raw);
  if (!r) return null;
  const id = r.id ?? r.collection_id;
  if (id === undefined || id === null) return null;
  const slug = String(r.slug ?? r.handle ?? r.seo_link ?? id).toLowerCase().replace(/\s+/g, '-');
  return {
    id: typeof id === 'number' ? id : String(id),
    slug,
    name: String(r.name ?? r.name_en ?? r.title ?? ''),
    name_ar: String(r.name_ar ?? r.name_arabic ?? r.name ?? ''),
    description: String(r.description ?? r.description_en ?? ''),
    description_ar: String(r.description_ar ?? r.description_arabic ?? r.description ?? ''),
    image: String(r.image ?? r.cover ?? r.thumbnail ?? r.banner ?? ''),
    products_count: Number(r.products_count ?? r.count ?? 0),
  };
}

async function fetchJson(path: string): Promise<unknown> {
  const res = await sarieeFetch(path, { method: 'GET' });
  if (!res.ok) return null;
  return tryParse(await res.text());
}

export async function fetchCollections(): Promise<SarieeCollection[]> {
  const json = await fetchJson('/api/frontend/collection');
  return extractArray(json).map(mapCollection).filter(Boolean) as SarieeCollection[];
}

export async function fetchFeaturedCollections(): Promise<SarieeCollection[]> {
  const json = await fetchJson('/api/frontend/collection/featured');
  return extractArray(json).map(mapCollection).filter(Boolean) as SarieeCollection[];
}

export async function fetchSingleCollection(slug: string): Promise<SarieeCollection | null> {
  const attempts = [
    `/api/frontend/collection/single-collection?slug=${encodeURIComponent(slug)}`,
    `/api/frontend/collection/single-collection?id=${encodeURIComponent(slug)}`,
    `/api/frontend/show-collection?slug=${encodeURIComponent(slug)}`,
  ];
  for (const path of attempts) {
    const json = await fetchJson(path);
    if (!json) continue;
    const r = asRecord(json);
    const raw = asRecord(r?.data) ?? asRecord(r?.collection) ?? r;
    const c = mapCollection(raw);
    if (c) return c;
  }
  return null;
}

export async function fetchCollectionProducts(collectionId: string | number): Promise<Product[]> {
  const attempts = [
    `/api/frontend/collection/products?collection_id=${encodeURIComponent(String(collectionId))}`,
    `/api/frontend/collection/products?id=${encodeURIComponent(String(collectionId))}`,
  ];
  for (const path of attempts) {
    const json = await fetchJson(path);
    if (!json) continue;
    const products = productsFromListJson(json);
    if (products.length > 0) return products;
  }
  return [];
}
