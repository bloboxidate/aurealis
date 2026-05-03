'use client';

import { useEffect, useState, Suspense } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';

function CheckoutForm() {
  const t = useTranslations('checkout');
  const tProduct = useTranslations('product');
  const tCart = useTranslations('cart');
  const locale = useLocale();
  const router = useRouter();
  const search = useSearchParams();
  const { items, total, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => { setMounted(true); }, []);

  const urlError = search.get('error');
  useEffect(() => {
    if (urlError === 'checkout_failed') setFormError(t('error_generic'));
    else if (urlError === 'rate_limited') setFormError(t('error_rate_limited'));
    else if (urlError) setFormError(t('error_generic'));
  }, [urlError, t]);

  if (!mounted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-petal pt-32" />
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-petal px-4 pt-28 sm:pt-32 pb-20 max-w-lg mx-auto text-center">
          <h1
            className="text-2xl font-light italic text-ink mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('empty_title')}
          </h1>
          <p className="text-muted text-sm mb-8" style={{ fontFamily: 'var(--font-body)' }}>
            {t('empty_body')}
          </p>
          <Link
            href={`/${locale}/cart`}
            className="inline-block px-8 py-3 rounded-full bg-apricot text-petal text-[10px] tracking-[0.3em] uppercase font-bold"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {t('back_cart')}
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const lineItems = items.map((i) => ({ productId: i.product.id, quantity: i.quantity }));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;

    setFormError(null);
    setSubmitting(true);

    const fd = new FormData(form);
    const payload = {
      locale,
      items: lineItems,
      fullName: String(fd.get('full_name') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      address: String(fd.get('address') ?? ''),
      city: String(fd.get('city') ?? ''),
      promoCode: promoCode.trim() || undefined,
    };

    try {
      const r = await fetch('/api/sariee/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await r.json()) as {
        ref?: string;
        paymentUrl?: string | null;
        error?: string;
        detail?: string;
      };

      if (!r.ok || !data.ref) {
        setFormError(t('error_generic'));
        if (process.env.NODE_ENV === 'development') {
          console.error('[checkout]', data);
        }
        setSubmitting(false);
        return;
      }

      clearCart();

      if (data.paymentUrl) {
        window.location.assign(data.paymentUrl);
        return;
      }

      router.push(`/${locale}/checkout/success?ref=${encodeURIComponent(data.ref)}`);
    } catch {
      setFormError(t('error_generic'));
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-petal px-4 sm:px-6 py-10 pt-28 sm:pt-32">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-[clamp(1.75rem,4vw,2.5rem)] font-light italic text-ink mb-10"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h1>

          {formError && (
            <p
              className="text-sm text-red-800/90 bg-red-50 border border-red-200/80 rounded-xl px-4 py-3 mb-6"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {formError}
            </p>
          )}

          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              {(
                [
                  ['full_name', t('field_name'), 'text'],
                  ['email', t('field_email'), 'email'],
                  ['phone', t('field_phone'), 'tel'],
                ] as const
              ).map(([name, label, type]) => (
                <div key={name}>
                  <label
                    className="block text-[10px] tracking-[0.3em] uppercase font-bold text-muted mb-1.5"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {label}
                  </label>
                  <input
                    name={name}
                    type={type}
                    required
                    className="w-full rounded-xl border border-border bg-petal px-4 py-2.5 text-sm text-ink"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                </div>
              ))}
              <div>
                <label
                  className="block text-[10px] tracking-[0.3em] uppercase font-bold text-muted mb-1.5"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {t('field_address')}
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  className="w-full rounded-xl border border-border bg-petal px-4 py-2.5 text-sm text-ink resize-y"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
              <div>
                <label
                  className="block text-[10px] tracking-[0.3em] uppercase font-bold text-muted mb-1.5"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {t('field_city')}
                </label>
                <input
                  name="city"
                  type="text"
                  required
                  className="w-full rounded-xl border border-border bg-petal px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label
                  className="block text-[10px] tracking-[0.3em] uppercase font-bold text-muted mb-1.5"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {t('field_promo')}
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder={t('promo_placeholder')}
                  className="w-full rounded-xl border border-border bg-petal px-4 py-2.5 text-sm text-ink"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border/80 bg-light/50 p-6 space-y-3">
                <h2
                  className="text-sm tracking-[0.25em] uppercase font-bold text-ink/80"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {tCart('order_summary')}
                </h2>
                {items.map(({ product, quantity }) => {
                  const name = locale === 'ar' ? product.name_ar : product.name_en;
                  return (
                    <div key={product.id} className="flex justify-between gap-2 text-sm text-ink/80">
                      <span>
                        {name} × {quantity}
                      </span>
                      <span>
                        {tProduct('egp')} {(product.price * quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
                <div className="border-t border-border pt-3 flex justify-between font-semibold text-ink">
                  <span>{tCart('total')}</span>
                  <span>
                    {tProduct('egp')} {total().toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full bg-apricot text-petal text-[10px] tracking-[0.35em] uppercase font-bold hover:bg-apricot-deep transition-colors disabled:opacity-60"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {submitting ? t('placing_order') : t('place_order')}
              </button>
              <Link
                href={`/${locale}/cart`}
                className="block text-center text-[10px] tracking-[0.3em] uppercase font-bold text-muted hover:text-apricot"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {t('back_edit')}
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <div className="min-h-screen bg-petal pt-32" />
        <Footer />
      </>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
