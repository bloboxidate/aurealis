'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { findOrderForTracking } from '@/lib/orders-persist';

export function TrackOrderForm() {
  const t = useTranslations('trackOrder');
  const locale = useLocale();
  const [ref, setRef] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<'idle' | 'not_found' | 'found'>('idle');
  const [orderRef, setOrderRef] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult('idle');
    const o = findOrderForTracking(ref.trim(), email);
    if (!o) {
      setResult('not_found');
      return;
    }
    setOrderRef(o.ref);
    setResult('found');
  };

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="space-y-4 max-w-md">
        <div>
          <label htmlFor="t-ref" className="block text-[10px] tracking-[0.2em] uppercase text-muted font-bold mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
            {t('field_ref')}
          </label>
          <input
            id="t-ref"
            name="ref"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            className="w-full rounded-2xl border border-border/80 bg-light/20 px-4 py-3 text-ink"
            style={{ fontFamily: 'var(--font-body)' }}
            autoComplete="off"
            required
          />
        </div>
        <div>
          <label htmlFor="t-email" className="block text-[10px] tracking-[0.2em] uppercase text-muted font-bold mb-1" style={{ fontFamily: 'var(--font-ui)' }}>
            {t('field_email')}
          </label>
          <input
            id="t-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-border/80 bg-light/20 px-4 py-3 text-ink"
            style={{ fontFamily: 'var(--font-body)' }}
            autoComplete="email"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3.5 rounded-full bg-apricot text-petal text-[10px] tracking-[0.3em] uppercase font-bold"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {t('submit')}
        </button>
      </form>

      {result === 'not_found' && (
        <p className="text-sm text-ink/70" style={{ fontFamily: 'var(--font-body)' }}>
          {t('not_found')}
        </p>
      )}
      {result === 'found' && (
        <p className="text-sm text-ink/90" style={{ fontFamily: 'var(--font-body)' }}>
          {t('found')}{' '}
          <Link href={`/${locale}/account/orders/${encodeURIComponent(orderRef)}`} className="text-apricot font-semibold hover:underline">
            {t('view_order')}
          </Link>
        </p>
      )}

      <p className="text-xs text-muted" style={{ fontFamily: 'var(--font-ui)' }}>
        {t('note')}
      </p>
    </div>
  );
}
