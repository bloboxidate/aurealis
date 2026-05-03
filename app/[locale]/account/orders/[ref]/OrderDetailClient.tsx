'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

type OrderLine = {
  name?: string;
  product_name?: string;
  quantity?: number;
  qty?: number;
  price?: number;
  unit_price?: number;
  total?: number;
  [key: string]: unknown;
};

type SarieeOrderDetail = {
  id?: string | number;
  ref?: string;
  order_number?: string;
  created_at?: string;
  status?: string;
  total?: number;
  total_price?: number;
  grand_total?: number;
  customer_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  items?: OrderLine[];
  order_items?: OrderLine[];
  products?: OrderLine[];
  [key: string]: unknown;
};

function getLines(o: SarieeOrderDetail): OrderLine[] {
  return (o.items ?? o.order_items ?? o.products ?? []) as OrderLine[];
}

function lineName(l: OrderLine): string {
  return String(l.name ?? l.product_name ?? l.title ?? '—');
}

function lineQty(l: OrderLine): number {
  return Number(l.quantity ?? l.qty ?? 1);
}

function linePrice(l: OrderLine): number {
  return Number(l.price ?? l.unit_price ?? l.line_total ?? l.total ?? 0);
}

export function OrderDetailClient({ refParam }: { refParam: string }) {
  const t = useTranslations('orderDetail');
  const tProduct = useTranslations('product');
  const locale = useLocale();
  const [order, setOrder] = useState<SarieeOrderDetail | null | 'loading'>('loading');

  useEffect(() => {
    fetch(`/api/sariee/order/${encodeURIComponent(refParam)}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { order?: SarieeOrderDetail } | null) => setOrder(d?.order ?? null))
      .catch(() => setOrder(null));
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

  const ref = String(order.ref ?? order.order_number ?? order.id ?? refParam);
  const dateStr = String(order.created_at ?? order.date ?? '');
  const date = dateStr
    ? new Date(dateStr).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-GB', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    : null;

  const customerName = String(order.customer_name ?? order.name ?? '');
  const total = Number(order.total ?? order.total_price ?? order.grand_total ?? 0);
  const lines = getLines(order);

  return (
    <div className="space-y-8">
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-[10px] tracking-[0.2em] uppercase text-muted font-bold" style={{ fontFamily: 'var(--font-ui)' }}>
            {t('ref')}
          </dt>
          <dd className="font-mono text-ink" style={{ fontFamily: 'var(--font-ui)' }}>
            {ref}
          </dd>
        </div>
        {date && (
          <div>
            <dt className="text-[10px] tracking-[0.2em] uppercase text-muted font-bold" style={{ fontFamily: 'var(--font-ui)' }}>
              {t('date')}
            </dt>
            <dd className="text-ink/90" style={{ fontFamily: 'var(--font-body)' }}>
              {date}
            </dd>
          </div>
        )}
        {(customerName || order.address || order.phone) && (
          <div className="sm:col-span-2">
            <dt className="text-[10px] tracking-[0.2em] uppercase text-muted font-bold" style={{ fontFamily: 'var(--font-ui)' }}>
              {t('ship_to')}
            </dt>
            <dd className="text-ink/90 whitespace-pre-line" style={{ fontFamily: 'var(--font-body)' }}>
              {[customerName, order.address, order.city, order.phone, order.email]
                .filter(Boolean)
                .join('\n')}
            </dd>
          </div>
        )}
        {order.status && (
          <div>
            <dt className="text-[10px] tracking-[0.2em] uppercase text-muted font-bold" style={{ fontFamily: 'var(--font-ui)' }}>
              {t('status')}
            </dt>
            <dd className="text-ink/90 capitalize">{String(order.status)}</dd>
          </div>
        )}
      </dl>

      {lines.length > 0 && (
        <div className="rounded-2xl border border-border/80 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-light/50 text-left">
              <tr>
                <th className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted" style={{ fontFamily: 'var(--font-ui)' }}>
                  {t('line_item')}
                </th>
                <th className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted w-20" style={{ fontFamily: 'var(--font-ui)' }}>
                  {t('qty')}
                </th>
                <th className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted text-right" style={{ fontFamily: 'var(--font-ui)' }}>
                  {t('line_total')}
                </th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i} className="border-t border-border/60">
                  <td className="px-4 py-3" style={{ fontFamily: 'var(--font-body)' }}>
                    {lineName(l)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{lineQty(l)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {tProduct('egp')} {linePrice(l).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 flex justify-between font-semibold text-ink border-t border-border bg-light/30">
            <span style={{ fontFamily: 'var(--font-ui)' }}>{t('total')}</span>
            <span>{tProduct('egp')} {total.toLocaleString()}</span>
          </div>
        </div>
      )}

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
