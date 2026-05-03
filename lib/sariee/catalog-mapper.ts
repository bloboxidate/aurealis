import type { Product } from '@/lib/products/types';
import { categories } from '@/lib/products/types';
import { asRecord } from '@/lib/sariee/json-helpers';

function str(v: unknown): string {
  if (typeof v === 'string') return v;
  if (v === null || v === undefined) return '';
  return String(v);
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim()) {
    const n = Number.parseFloat(v.replace(/,/g, ''));
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function slugFromRaw(raw: Record<string, unknown>, idFallback: string): string {
  const direct = str(raw.slug ?? raw.handle ?? raw.seo_slug).trim().toLowerCase().replace(/\s+/g, '-');
  if (direct) return direct;
  const link = str(raw.seo_link ?? raw.link ?? raw.url ?? raw.permalink);
  const m = link.match(/\/([^/?#]+)\/?$/);
  if (m?.[1]) return decodeURIComponent(m[1]).toLowerCase();
  const base = idFallback.replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
  return base.slice(0, 120) || 'product';
}

function firstImageUrl(raw: Record<string, unknown>): string {
  for (const k of ['image', 'main_image', 'thumbnail', 'cover', 'photo', 'img', 'image_url', 'mainImage']) {
    const v = raw[k];
    if (typeof v === 'string' && v.trim().length > 0) return v.trim();
  }
  const images = raw.images;
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === 'string' && first.trim()) return first.trim();
    const fr = asRecord(first);
    if (fr) {
      const u = str(fr.url ?? fr.src ?? fr.path);
      if (u) return u;
    }
  }
  return '/logo-orange.png';
}

function normalizeCategory(v: unknown): (typeof categories)[number] {
  const s = str(v).toLowerCase();
  for (const c of categories) {
    if (s === c || s.includes(c)) return c;
  }
  if (s.includes('perfume') || s.includes('fragrance') || s.includes('عطر')) return 'fragrance';
  if (s.includes('makeup') || s.includes('cosmetic') || s.includes('مكياج')) return 'makeup';
  return 'skincare';
}

function inStock(raw: Record<string, unknown>): boolean {
  if (raw.in_stock === false || raw.is_available === false || raw.available === false) return false;
  const q = num(raw.quantity ?? raw.stock ?? raw.qty ?? raw.in_stock_quantity, NaN);
  if (Number.isFinite(q)) return q > 0;
  return true;
}

function featured(raw: Record<string, unknown>): boolean {
  return Boolean(raw.featured ?? raw.is_featured ?? raw.featured_product ?? raw.isFeatured);
}

/**
 * Best-effort map of Sariee storefront product JSON into the site's Product shape.
 * Adjust when you have stable 200-response samples from Sariee.
 */
export function mapSarieeItemToProduct(raw: unknown): Product | null {
  const r = asRecord(raw);
  if (!r) return null;
  const id = str(r.id ?? r.product_id ?? r.uuid ?? r.sku ?? r.code).trim() || slugFromRaw(r, 'x');
  const slug = slugFromRaw(r, id);
  const name_en = str(r.name_en ?? r.name ?? r.title ?? r.product_name ?? r.nameEn).trim() || slug;
  const name_ar = str(r.name_ar ?? r.name_arabic ?? r.title_ar ?? r.nameAr ?? name_en).trim() || name_en;
  const description_en = str(r.description_en ?? r.description ?? r.body ?? r.short_description ?? '').trim() || name_en;
  const description_ar = str(r.description_ar ?? r.description_arabic ?? r.body_ar ?? description_en).trim() || description_en;
  const price = Math.round(
    num(r.price_egp, NaN) ||
      num(r.price, NaN) ||
      num(r.final_price, NaN) ||
      num(r.amount, NaN) ||
      num(r.sale_price, NaN) ||
      0
  );
  return {
    id,
    slug,
    name_en,
    name_ar,
    description_en,
    description_ar,
    price: Number.isFinite(price) && price >= 0 ? price : 0,
    category: normalizeCategory(r.category ?? r.category_slug ?? r.type),
    image: firstImageUrl(r),
    in_stock: inStock(r),
    featured: featured(r),
  };
}
