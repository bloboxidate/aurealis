import type { Product } from '@/lib/products/types';
import { getProductsByIds } from '@/lib/products/service';

export type CartLineInput = { productId: string; quantity: number };

export type ValidatedLine = { product: Product; quantity: number; lineAmountCents: number };

export type ValidateCartResult =
  | { ok: true; lines: ValidatedLine[]; amountCents: number; merchantRef: string }
  | { ok: false; error: string };

export async function validateCartLines(
  items: CartLineInput[],
  merchantRef: string
): Promise<ValidateCartResult> {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: 'empty_cart' };
  }

  const lines: ValidatedLine[] = [];
  const ids: string[] = [];

  for (const row of items) {
    if (!row?.productId || typeof row.quantity !== 'number' || row.quantity < 1 || row.quantity > 99) {
      return { ok: false, error: 'invalid_item' };
    }
    ids.push(String(row.productId));
  }

  const byId = await getProductsByIds(ids);

  for (const row of items) {
    const product = byId.get(String(row.productId));
    if (!product) {
      return { ok: false, error: 'unknown_product' };
    }
    if (!product.in_stock) {
      return { ok: false, error: 'out_of_stock' };
    }

    const lineAmountCents = Math.round(product.price * 100) * row.quantity;
    lines.push({ product, quantity: row.quantity, lineAmountCents });
  }

  const amountCents = lines.reduce((s, l) => s + l.lineAmountCents, 0);
  if (amountCents < 100) {
    return { ok: false, error: 'amount_too_low' };
  }

  return { ok: true, lines, amountCents, merchantRef };
}
