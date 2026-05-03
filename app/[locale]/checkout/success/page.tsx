'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function SuccessBody() {
  const searchParams = useSearchParams();
  const t = useTranslations('orderSuccess');
  const locale = useLocale();
  const ref = searchParams.get('ref') ?? '—';

  const orderHref = ref !== '—'
    ? `/${locale}/account/orders/${encodeURIComponent(ref)}`
    : null;

  return (
    <div className="min-h-screen bg-petal px-4 pt-28 sm:pt-32 pb-20 text-center max-w-lg mx-auto">
      <p className="text-4xl mb-4" aria-hidden>✦</p>
      <h1
        className="text-2xl sm:text-3xl font-light italic text-ink mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {t('title')}
      </h1>
      <p className="text-ink/70 mb-2" style={{ fontFamily: 'var(--font-body)' }}>
        {t('message')}
      </p>
      <p className="text-sm font-mono text-apricot mb-8" style={{ fontFamily: 'var(--font-ui)' }}>
        {t('ref_label')}: {ref}
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
        {orderHref && (
          <Link
            href={orderHref}
            className="inline-flex justify-center px-8 py-3.5 rounded-full border-2 border-apricot/50 text-ink text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-apricot/10"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {t('cta_order')}
          </Link>
        )}
        <Link
          href={`/${locale}/shop`}
          className="inline-flex justify-center px-8 py-3.5 rounded-full bg-ink text-petal text-[10px] tracking-[0.3em] uppercase font-bold"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {t('cta_shop')}
        </Link>
        <Link
          href={`/${locale}`}
          className="inline-flex justify-center px-8 py-3.5 rounded-full border-2 border-ink/15 text-ink/70 text-[10px] tracking-[0.3em] uppercase font-bold"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {t('cta_home')}
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-[50vh] bg-petal" />}>
        <SuccessBody />
      </Suspense>
      <Footer />
    </>
  );
}
