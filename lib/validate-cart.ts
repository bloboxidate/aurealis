import { getProductById } from './data';
import type { Product } from './data';

export type CartLineInput = { productId: string; quantity: number };

export type ValidatedLine = { product: Product; quantity: number; lineAmountCents: number };

export type ValidateCartResult =
  | { ok: true; lines: ValidatedLine[]; amountCents: number; merchantRef: string }
  | { ok: false; error: string };

/** Server-side recalculation: never trust client prices. Amount in piasters (1 EGP = 100). */
export function validateCartLines(
  items: CartLineInput[],
  merchantRef: string
): ValidateCartResult {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: 'empty_cart' };
  }

  const lines: ValidatedLine[] = [];

  for (const row of items) {
    if (!row?.productId || typeof row.quantity !== 'number' || row.quantity < 1 || row.quantity > 99) {
      return { ok: false, error: 'invalid_item' };
    }

    const product = getProductById(String(row.productId));
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
