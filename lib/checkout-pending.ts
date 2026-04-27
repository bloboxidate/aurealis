import type { CartItem } from '@/lib/store';
import type { PendingCheckout } from '@/lib/checkout-pending.types';

const PENDING = 'aurealis-checkout-pending';

export type { PendingCheckout } from '@/lib/checkout-pending.types';

export function setPendingCheckoutFromCart(
  items: CartItem[],
  totalEgp: number,
  form: { fullName: string; email: string; phone: string; address: string; city: string },
  source: 'demo' | 'card',
  locale: 'en' | 'ar'
): void {
  if (typeof window === 'undefined') return;
  const lineItems = items.map((i) => {
    const name = locale === 'ar' ? i.product.name_ar : i.product.name_en;
    return {
      productId: i.product.id,
      quantity: i.quantity,
      name,
      priceEach: i.product.price,
    };
  });
  const payload: PendingCheckout = {
    lineItems,
    totalEgp,
    email: form.email,
    fullName: form.fullName,
    phone: form.phone,
    address: form.address,
    city: form.city,
    source,
  };
  sessionStorage.setItem(PENDING, JSON.stringify(payload));
}

export function takePendingCheckout(): PendingCheckout | null {
  if (typeof window === 'undefined') return null;
  try {
    const r = sessionStorage.getItem(PENDING);
    if (!r) return null;
    sessionStorage.removeItem(PENDING);
    return JSON.parse(r) as PendingCheckout;
  } catch {
    return null;
  }
}
