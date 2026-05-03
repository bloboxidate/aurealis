'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertAdminSession } from '@/lib/admin/require-admin-session';
import { ADMIN_BASE } from '@/lib/admin/const';
import {
  createCompanyProduct,
  deleteCompanyProduct,
  updateCompanyProduct,
  type CompanyProductUpsert,
} from '@/lib/sariee/company-products';

const CAT = ['skincare', 'makeup', 'fragrance'] as const;

export type ProductFormState = { message: string } | null;

type ProductFormData = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  image: string;
  price_egp: number;
  category: (typeof CAT)[number];
  in_stock: boolean;
  featured: boolean;
};

type Parsed = { err: string } | { data: ProductFormData };

function parseForm(formData: FormData): Parsed {
  const id = String(formData.get('id') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { err: 'Slug: lowercase letters, numbers, and hyphens only (e.g. my-product-name).' };
  }
  const name_en = String(formData.get('name_en') ?? '').trim();
  const name_ar = String(formData.get('name_ar') ?? '').trim();
  const description_en = String(formData.get('description_en') ?? '').trim();
  const description_ar = String(formData.get('description_ar') ?? '').trim();
  const image = String(formData.get('image') ?? '').trim();
  if (!name_en || !name_ar || !description_en || !description_ar || !image) {
    return { err: 'All name, description, and image fields are required.' };
  }
  const priceRaw = String(formData.get('price_egp') ?? '').trim();
  const price_egp = Math.round(Number(priceRaw));
  if (!Number.isFinite(price_egp) || price_egp < 0) {
    return { err: 'Invalid price (whole EGP).' };
  }
  const category = String(formData.get('category') ?? '').trim();
  if (!CAT.includes(category as (typeof CAT)[number])) {
    return { err: 'Invalid category.' };
  }
  const in_stock = formData.get('in_stock') === 'on';
  const featured = formData.get('featured') === 'on';
  return {
    data: {
      id,
      slug,
      name_en,
      name_ar,
      description_en,
      description_ar,
      image,
      price_egp,
      category: category as (typeof CAT)[number],
      in_stock,
      featured,
    },
  };
}

function toUpsert(row: Omit<ProductFormData, 'id'> & { id?: string }): CompanyProductUpsert {
  return {
    id: row.id?.trim() ? row.id.trim() : undefined,
    slug: row.slug,
    name_en: row.name_en,
    name_ar: row.name_ar,
    description_en: row.description_en,
    description_ar: row.description_ar,
    image: row.image,
    price_egp: row.price_egp,
    category: row.category,
    in_stock: row.in_stock,
    featured: row.featured,
  };
}

export async function createProductAction(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await assertAdminSession();
  const p = parseForm(formData);
  if ('err' in p) {
    return { message: p.err };
  }
  const { id: _omitId, ...fields } = p.data;
  void _omitId;
  const result = await createCompanyProduct(toUpsert(fields));
  if (!result.ok) {
    return { message: result.message };
  }
  revalidatePath(`${ADMIN_BASE}/products`);
  redirect(`${ADMIN_BASE}/products`);
}

export async function updateProductAction(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await assertAdminSession();
  const p = parseForm(formData);
  if ('err' in p) {
    return { message: p.err };
  }
  const row = p.data;
  if (!row.id) {
    return { message: 'Missing product id.' };
  }
  const result = await updateCompanyProduct(toUpsert(row) as CompanyProductUpsert & { id: string });
  if (!result.ok) {
    return { message: result.message };
  }
  revalidatePath(`${ADMIN_BASE}/products`);
  revalidatePath(`${ADMIN_BASE}/products/${row.id}/edit`);
  redirect(`${ADMIN_BASE}/products`);
}

export async function deleteProductFormAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await assertAdminSession();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) {
    return { message: 'Missing id' };
  }
  const result = await deleteCompanyProduct(id);
  if (!result.ok) {
    return { message: result.message };
  }
  revalidatePath(`${ADMIN_BASE}/products`);
  redirect(`${ADMIN_BASE}/products`);
}
