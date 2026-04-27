'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getStoredOrderByRef, type StoredOrder } from '@/lib/orders-persist';

export function OrderDetailClient({ refParam }: { refParam: string }) {
  const t = useTranslations('orderDetail');
  const tProduct = useTranslations('product');
  const locale = useLocale();
  const [order, setOrder] = useState<StoredOrder | null | 'loading'>('loading');

  useEffect(() => {
    const o = getStoredOrderByRef(refParam);
    setOrder(o ?? null);
  }, [refParam]);

  if (order === 'loading') {
    return <div className="h-32 animate-pulse rounded-2xl bg-light/50" aria-hidden />;
  }
  if (!order) {
    return (
      <p className="text-ink/70" style={{ fontFamily: 'var(--font-body)' }}>
        {t('not_found')}
      </p>
    );
  }

  const date = new Date(order.createdAt).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return (
    <div className="space-y-8">
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-[10px] tracking-[0.2em] uppercase text-muted font-bold" style={{ fontFamily: 'var(--font-ui)' }}>
            {t('ref')}
          </dt>
          <dd className="font-mono text-ink" style={{ fontFamily: 'var(--font-ui)' }}>
            {order.ref}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[0.2em] uppercase text-muted font-bold" style={{ fontFamily: 'var(--font-ui)' }}>
            {t('date')}
          </dt>
          <dd className="text-ink/90" style={{ fontFamily: 'var(--font-body)' }}>
            {date}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[10px] tracking-[0.2em] uppercase text-muted font-bold" style={{ fontFamily: 'var(--font-ui)' }}>
            {t('ship_to')}
          </dt>
          <dd className="text-ink/90 whitespace-pre-line" style={{ fontFamily: 'var(--font-body)' }}>
            {order.fullName}
            {'\n'}
            {order.address}
            {'\n'}
            {order.city}
            {'\n'}
            {order.phone} · {order.email}
          </dd>
        </div>
      </dl>
      {order.paymobTxn && (
        <p className="text-xs text-muted" style={{ fontFamily: 'var(--font-ui)' }}>
          {t('paymob_id')}: {order.paymobTxn}
        </p>
      )}

      <div className="rounded-2xl border border-border/80 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-light/50 text-left">
            <tr>
              <th className="px-4 py-2 font-ui text-[10px] uppercase tracking-widest text-muted" style={{ fontFamily: 'var(--font-ui)' }}>
                {t('line_item')}
              </th>
              <th className="px-4 py-2 font-ui text-[10px] uppercase tracking-widest text-muted w-20" style={{ fontFamily: 'var(--font-ui)' }}>
                {t('qty')}
              </th>
              <th className="px-4 py-2 font-ui text-[10px] uppercase tracking-widest text-muted text-right" style={{ fontFamily: 'var(--font-ui)' }}>
                {t('line_total')}
              </th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((l, i) => (
              <tr key={`${l.productId}-${i}`} className="border-t border-border/60">
                <td className="px-4 py-3" style={{ fontFamily: 'var(--font-body)' }}>
                  {l.name}
                </td>
                <td className="px-4 py-3 tabular-nums">{l.quantity}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {tProduct('egp')} {(l.priceEach * l.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 flex justify-between font-semibold text-ink border-t border-border bg-light/30">
          <span style={{ fontFamily: 'var(--font-ui)' }}>{t('total')}</span>
          <span>
            {tProduct('egp')} {order.totalEgp.toLocaleString()}
          </span>
        </div>
      </div>

      <Link
        href={`/${locale}/account/orders`}
        className="inline-block text-[10px] tracking-[0.3em] uppercase font-bold text-apricot"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        ← {t('back_list')}
      </Link>
    </div>
  );
}
