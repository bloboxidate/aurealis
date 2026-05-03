'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export function TrackOrderForm() {
  const t = useTranslations('trackOrder');
  const locale = useLocale();
  const [ref, setRef] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<'idle' | 'not_found' | 'found'>('idle');
  const [orderRef, setOrderRef] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult('idle');
    setLoading(true);

    try {
      const r = await fetch(`/api/sariee/order/${encodeURIComponent(ref.trim())}`, {
        cache: 'no-store',
      });
      if (r.ok) {
        const d = (await r.json()) as { order?: { email?: string; customer_email?: string } };
        const orderEmail = String(d.order?.email ?? d.order?.customer_email ?? '').toLowerCase().trim();
        const inputEmail = email.toLowerCase().trim();
        // verify email matches if Sariee returned one; if Sariee didn't return email, just show the order
        if (!orderEmail || orderEmail === inputEmail) {
          setOrderRef(ref.trim());
          setResult('found');
        } else {
          setResult('not_found');
        }
      } else {
        setResult('not_found');
      }
    } catch {
      setResult('not_found');
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
          className="w-full py-3.5 rounded-full bg-apricot text-petal text-[10px] tracking-[0.3em] uppercase font-bold disabled:opacity-60"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {loading ? '…' : t('submit')}
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
    </div>
  );
}
