'use client';

import { useActionState, useState } from 'react';
import { deleteProductFormAction, type ProductFormState } from './actions';

const initial: ProductFormState = null;

export function DeleteProductButton({ id }: { id: string }) {
  const [state, formAction, pending] = useActionState(deleteProductFormAction, initial);
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" className="text-rose-400 text-sm" onClick={() => setOpen(true)}>
        Delete
      </button>
    );
  }
  return (
    <form action={formAction} className="inline-flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      {state?.message ? <span className="text-rose-300 text-xs">{state.message}</span> : null}
      <button type="submit" disabled={pending} className="text-rose-400 text-sm">
        {pending ? '…' : 'Confirm delete'}
      </button>
      <button type="button" className="text-slate-500 text-sm" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </form>
  );
}
