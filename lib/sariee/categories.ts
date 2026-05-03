import 'server-only';

import { sarieeFetch } from './client';
import { extractArray, asRecord } from './json-helpers';
import { productsFromListJson } from './catalog-fetch';
import type { Product } from '@/lib/products/types';

function tryParse(text: string): unknown {
  try { return JSON.parse(text); } catch { return null; }
}

export type SarieeCategory = {
  id: string | number;
  slug: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  image: string;
};

function mapCategory(raw: unknown): SarieeCategory | null {
  const r = asRecord(raw);
  if (!r) return null;
  const id = r.id ?? r.category_id;
  if (id === undefined || id === null) return null;
  const slug = String(r.slug ?? r.handle ?? r.seo_link ?? id).toLowerCase().replace(/\s+/g, '-');
  return {
    id: typeof id === 'number' ? id : String(id),
    slug,
    name: String(r.name ?? r.name_en ?? r.title ?? ''),
    name_ar: String(r.name_ar ?? r.name_arabic ?? r.name ?? ''),
    description: String(r.description ?? r.description_en ?? ''),
    description_ar: String(r.description_ar ?? r.description_arabic ?? r.description ?? ''),
    image: String(r.image ?? r.cover ?? r.thumbnail ?? ''),
  };
}

async function fetchJson(path: string): Promise<unknown> {
  const res = await sarieeFetch(path, { method: 'GET' });
  if (!res.ok) return null;
  return tryParse(await res.text());
}

export async function fetchAllCategories(): Promise<SarieeCategory[]> {
  const json = await fetchJson('/api/frontend/categories/all-categories');
  return extractArray(json).map(mapCategory).filter(Boolean) as SarieeCategory[];
}

export async function fetchSingleCategory(slug: string): Promise<SarieeCategory | null> {
  const attempts = [
    `/api/frontend/categories/single-category?slug=${encodeURIComponent(slug)}`,
    `/api/frontend/categories/single-category?id=${encodeURIComponent(slug)}`,
  ];
  for (const path of attempts) {
    const json = await fetchJson(path);
    if (!json) continue;
    const r = asRecord(json);
    const raw = asRecord(r?.data) ?? asRecord(r?.category) ?? r;
    const c = mapCategory(raw);
    if (c) return c;
  }
  return null;
}

export async function fetchCategoryProducts(slug: string): Promise<Product[]> {
  const attempts = [
    `/api/frontend/categories/single-category-products?slug=${encodeURIComponent(slug)}`,
    `/api/frontend/categories/single-category-products?id=${encodeURIComponent(slug)}`,
    `/api/frontend/categories/single-category-products?category_slug=${encodeURIComponent(slug)}`,
  ];
  for (const path of attempts) {
    const json = await fetchJson(path);
    if (!json) continue;
    const products = productsFromListJson(json);
    if (products.length > 0) return products;
  }
  return [];
}
