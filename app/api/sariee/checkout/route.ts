import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { sarieeCheckoutBodySchema } from '@/lib/security/sariee-checkout-schema';
import { readJsonWithLimit } from '@/lib/security/parse-body';
import { withNoStore } from '@/lib/security/secure-api-headers';
import { validateCartLines } from '@/lib/validate-cart';
import {
  initSarieeCart,
  addItemsToSarieeCart,
  setCartCity,
  applySarieePromo,
  getSarieePaymentMethods,
  sarieeCheckoutAction,
} from '@/lib/sariee/cart';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MAX_BODY = 32_768;

export async function POST(request: Request) {
  const h = { headers: withNoStore() };

  const raw = await readJsonWithLimit(request, MAX_BODY);
  if (!raw.ok) return raw.response;

  let body: ReturnType<typeof sarieeCheckoutBodySchema.parse>;
  try {
    body = sarieeCheckoutBodySchema.parse(raw.data);
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: 'validation_error', details: e.flatten() }, { status: 400, ...h });
    }
    throw e;
  }

  // Validate cart lines against Sariee catalog
  const cartValidation = await validateCartLines(body.items, 'sariee-checkout');
  if (!cartValidation.ok) {
    return NextResponse.json({ error: cartValidation.error }, { status: 400, ...h });
  }

  const sessionOpts = {
    sarieeSession: body.sarieeSession ?? null,
    bearerOverride: body.customerBearer ?? null,
  };

  // 1. Init Sariee cart
  const initResult = await initSarieeCart(sessionOpts);
  if (!initResult.ok) {
    return NextResponse.json({ error: 'cart_init_failed', detail: initResult.error }, { status: 502, ...h });
  }
  const { cartId } = initResult;

  // 2. Add items
  const addResult = await addItemsToSarieeCart(
    cartId,
    body.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    sessionOpts
  );
  if (!addResult.ok) {
    return NextResponse.json({ error: 'cart_add_failed', detail: addResult.error }, { status: 502, ...h });
  }

  // 3. Set shipping city (optional — don't fail checkout if it errors)
  if (body.cityId !== undefined) {
    await setCartCity(cartId, body.cityId, sessionOpts);
  }

  // 4. Apply promo code (optional — don't fail checkout if it errors)
  let promoDiscount: number | undefined;
  if (body.promoCode) {
    const promoResult = await applySarieePromo(cartId, body.promoCode, sessionOpts);
    if (promoResult.ok) promoDiscount = promoResult.discount;
  }

  // 5. Get available payment methods and pick one
  let paymentMethodId: string | number = body.paymentMethodId ?? 1;
  if (!body.paymentMethodId) {
    const methodsResult = await getSarieePaymentMethods(cartId, sessionOpts);
    if (methodsResult.ok && methodsResult.methods.length > 0) {
      // Prefer online card payment; fall back to first available
      const card = methodsResult.methods.find((m) =>
        /card|online|credit|debit|visa|mastercard/i.test(m.name + m.type)
      );
      paymentMethodId = (card ?? methodsResult.methods[0]!).id;
    }
  }

  // 6. Execute checkout — creates the order in Sariee
  const checkoutResult = await sarieeCheckoutAction(
    cartId,
    {
      name: body.fullName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
    },
    paymentMethodId,
    sessionOpts
  );

  if (!checkoutResult.ok) {
    return NextResponse.json({ error: 'checkout_failed', detail: checkoutResult.error }, { status: 502, ...h });
  }

  return NextResponse.json(
    {
      ref: checkoutResult.ref,
      paymentUrl: checkoutResult.paymentUrl,
      promoDiscount,
      cartId,
    },
    { status: 200, ...h }
  );
}
