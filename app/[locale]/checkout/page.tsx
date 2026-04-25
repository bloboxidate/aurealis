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
  const [cardReady, setCardReady] = useState(false);
  const [cardInfoLoading, setCardInfoLoading] = useState(true);
  const [cardRedirecting, setCardRedirecting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let c = true;
    (async () => {
      try {
        const r = await fetch('/api/paymob/ready', { cache: 'no-store' });
        const d = (await r.json()) as { cardPaymentsReady?: boolean };
        if (c) setCardReady(!!d.cardPaymentsReady);
      } catch {
        if (c) setCardReady(false);
      } finally {
        if (c) setCardInfoLoading(false);
      }
    })();
    return () => {
      c = false;
    };
  }, []);

  const urlError = search.get('error');
  useEffect(() => {
    if (urlError === 'paymob_hmac') setFormError('hmac');
    else if (urlError === 'payment_declined') setFormError('declined');
    else if (urlError === 'rate_limited' || urlError === 'rate') setFormError('rate');
    else if (urlError) setFormError('generic');
  }, [urlError]);

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

  const onDemo = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `AUR-${Date.now().toString(36).toUpperCase()}`;
    clearCart();
    router.push(`/${locale}/checkout/success?ref=${encodeURIComponent(id)}`);
  };

  const onPayWithCard = async (form: HTMLFormElement) => {
    if (!form.reportValidity()) return;
    setFormError(null);
    if (!cardReady) {
      setFormError('generic');
      return;
    }
    const fd = new FormData(form);
    const fullName = String(fd.get('full_name') ?? '');
    const email = String(fd.get('email') ?? '');
    const phone = String(fd.get('phone') ?? '');
    const address = String(fd.get('address') ?? '');
    const city = String(fd.get('city') ?? '');

    setCardRedirecting(true);
    try {
      const r = await fetch('/api/paymob/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          items: lineItems,
          fullName,
          email,
          phone,
          address,
          city,
        }),
      });
      const data = (await r.json()) as { iframeUrl?: string; error?: string };
      if (!r.ok || !data.iframeUrl) {
        if (r.status === 429) setFormError('rate');
        else if (data.error === 'rate_limited') setFormError('rate');
        else setFormError('generic');
        setCardRedirecting(false);
        return;
      }
      window.location.assign(data.iframeUrl);
    } catch {
      setFormError('generic');
      setCardRedirecting(false);
    }
  };

  const errMsg =
    formError === 'hmac'
      ? t('error_paymob_hmac')
      : formError === 'declined'
        ? t('error_payment_declined')
        : formError === 'rate'
          ? t('error_rate_limited')
          : formError === 'generic'
            ? t('error_generic')
            : null;

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
          <p className="text-xs text-muted mb-4" style={{ fontFamily: 'var(--font-ui)' }}>
            {!cardInfoLoading && cardReady ? t('paymob_ready_note') : t('demo_note')}
          </p>
          {errMsg && (
            <p
              className="text-sm text-red-800/90 bg-red-50 border border-red-200/80 rounded-xl px-4 py-3 mb-6"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {errMsg}
            </p>
          )}

          <form onSubmit={onDemo} className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12" id="checkout-form">
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
              <p className="text-xs text-muted" style={{ fontFamily: 'var(--font-body)' }}>
                {t('payment_note')}
              </p>
              {!cardInfoLoading && cardReady && (
                <button
                  type="button"
                  form="checkout-form"
                  disabled={cardRedirecting}
                  onClick={() => {
                    const f = document.getElementById('checkout-form') as HTMLFormElement | null;
                    if (f) void onPayWithCard(f);
                  }}
                  className="w-full py-4 rounded-full bg-ink text-petal text-[10px] tracking-[0.35em] uppercase font-bold hover:bg-ink/90 transition-colors disabled:opacity-60"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {cardRedirecting ? t('card_redirecting') : t('place_order_card')}
                </button>
              )}
              <button
                type="submit"
                form="checkout-form"
                disabled={cardRedirecting}
                className="w-full py-4 rounded-full bg-apricot text-petal text-[10px] tracking-[0.35em] uppercase font-bold hover:bg-apricot-deep transition-colors disabled:opacity-50"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {t('place_order')}
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
