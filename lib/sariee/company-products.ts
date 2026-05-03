import 'server-only';

import type { AdminProductRow } from '@/lib/admin/product-row';
import { sarieeFetch } from '@/lib/sariee/client';
import { mapSarieeItemToProduct } from '@/lib/sariee/catalog-mapper';
import { extractArray, parseJsonUnknown, sarieeUpstreamMessage } from '@/lib/sariee/json-helpers';

async function readJson(res: Response): Promise<unknown> {
  return parseJsonUnknown(await res.text());
}

function toAdminRow(raw: unknown): AdminProductRow | null {
  const p = mapSarieeItemToProduct(raw);
  if (!p) return null;
  return {
    id: p.id,
    slug: p.slug,
    name_en: p.name_en,
    name_ar: p.name_ar,
    description_en: p.description_en,
    description_ar: p.description_ar,
    price_egp: p.price,
    category: p.category,
    image: p.image,
    in_stock: p.in_stock,
    featured: p.featured,
  };
}

export async function listCompanyProducts(): Promise<AdminProductRow[]> {
  const res = await sarieeFetch('/api/company/product', { method: 'GET' });
  const json = await readJson(res);
  if (!res.ok) {
    throw new Error(sarieeUpstreamMessage(json, `Sariee list products failed (${res.status})`));
  }
  const rows: AdminProductRow[] = [];
  for (const item of extractArray(json)) {
    const r = toAdminRow(item);
    if (r) rows.push(r);
  }
  return rows;
}

export async function getCompanyProductById(id: string): Promise<AdminProductRow | null> {
  for (const key of ['id', 'product_id'] as const) {
    const qs = new URLSearchParams({ [key]: id }).toString();
    const res = await sarieeFetch(`/api/company/product/show?${qs}`, { method: 'GET' });
    const json = await readJson(res);
    if (!res.ok) continue;
    const row = toAdminRow(json) ?? toAdminRow((json as { data?: unknown })?.data);
    if (row) return row;
  }
  return null;
}

export type CompanyProductUpsert = {
  id?: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price_egp: number;
  category: string;
  image: string;
  in_stock: boolean;
  featured: boolean;
};

function upsertPayload(row: CompanyProductUpsert, mode: 'create' | 'update'): Record<string, unknown> {
  const base: Record<string, unknown> = {
    slug: row.slug,
    name_en: row.name_en,
    name_ar: row.name_ar,
    description_en: row.description_en,
    description_ar: row.description_ar,
    image: row.image,
    category: row.category,
    in_stock: row.in_stock,
    featured: row.featured,
    price: row.price_egp,
    price_egp: row.price_egp,
  };
  if (mode === 'update' && row.id) base.id = row.id;
  return base;
}

export async function createCompanyProduct(row: CompanyProductUpsert): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await sarieeFetch('/api/company/product', {
    method: 'POST',
    json: upsertPayload(row, 'create'),
  });
  const json = await readJson(res);
  if (!res.ok) return { ok: false, message: sarieeUpstreamMessage(json, `Create failed (${res.status})`) };
  return { ok: true };
}

export async function updateCompanyProduct(row: CompanyProductUpsert & { id: string }): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await sarieeFetch('/api/company/product', {
    method: 'PUT',
    json: upsertPayload(row, 'update'),
  });
  const json = await readJson(res);
  if (!res.ok) return { ok: false, message: sarieeUpstreamMessage(json, `Update failed (${res.status})`) };
  return { ok: true };
}

export async function deleteCompanyProduct(id: string): Promise<{ ok: true } | { ok: false; message: string }> {
  // API doc specifies product_barcode_id; fall back to product_id in case the store uses
  // a different identifier column.
  const attempts = [
    { product_barcode_id: id },
    { product_id: id },
  ];
  let res!: Response;
  let json: unknown;
  for (const body of attempts) {
    res = await sarieeFetch('/api/company/product', { method: 'DELETE', json: body });
    json = await readJson(res);
    if (res.ok) return { ok: true };
    if (res.status !== 422 && res.status !== 400 && res.status !== 404) break;
  }
  return { ok: false, message: sarieeUpstreamMessage(json, `Delete failed (${res.status})`) };
}
