'use client';

import { useActionState } from 'react';
import { createProductAction, type ProductFormState } from './actions';
import { ProductFields } from './ProductFields';

const initial: ProductFormState = null;

export function CreateForm() {
  const [state, formAction, pending] = useActionState(createProductAction, initial);
  return (
    <form action={formAction} className="space-y-6">
      {state?.message ? (
        <p className="rounded border border-rose-500/50 bg-rose-950/40 px-4 py-2 text-rose-200 text-sm">{state.message}</p>
      ) : null}
      <ProductFields />
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-apricot px-6 py-2 text-ink text-sm font-semibold disabled:opacity-50"
        style={{ background: 'linear-gradient(90deg, #e8a87c, #d4a055)' }}
      >
        {pending ? 'Saving…' : 'Create product'}
      </button>
    </form>
  );
}
