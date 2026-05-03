'use client';

import { useActionState } from 'react';
import { updateProductAction, type ProductFormState } from './actions';
import { ProductFields } from './ProductFields';
import type { AdminProductRow } from '@/lib/admin/product-row';

const initial: ProductFormState = null;

export function EditForm({ product }: { product: AdminProductRow }) {
  const [state, formAction, pending] = useActionState(updateProductAction, initial);
  return (
    <form action={formAction} className="space-y-6">
      {state?.message ? (
        <p className="rounded border border-rose-500/50 bg-rose-950/40 px-4 py-2 text-rose-200 text-sm">{state.message}</p>
      ) : null}
      <ProductFields
        showIdField
        defaults={{
          id: product.id,
          slug: product.slug,
          name_en: product.name_en,
          name_ar: product.name_ar,
          description_en: product.description_en,
          description_ar: product.description_ar,
          price_egp: product.price_egp,
          category: product.category as 'skincare' | 'makeup' | 'fragrance',
          image: product.image,
          in_stock: product.in_stock,
          featured: product.featured,
        }}
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-apricot px-6 py-2 text-ink text-sm font-semibold disabled:opacity-50"
        style={{ background: 'linear-gradient(90deg, #e8a87c, #d4a055)' }}
      >
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}
