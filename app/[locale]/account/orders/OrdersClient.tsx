'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

type SarieeOrder = {
  id?: string | number;
  ref?: string;
  order_number?: string;
  created_at?: string;
  total?: number;
  total_price?: number;
  status?: string;
  [key: string]: unknown;
};

function getOrderRef(o: SarieeOrder): string {
  return String(o.ref ?? o.order_number ?? o.id ?? '—');
}

function getOrderTotal(o: SarieeOrder): number {
  return Number(o.total ?? o.total_price ?? o.grand_total ?? 0);
}

function getOrderDate(o: SarieeOrder): string | null {
  const v = o.created_at ?? o.date ?? o.order_date;
  return typeof v === 'string' ? v : null;
}

export function OrdersClient() {
  const t = useTranslations('orders');
  const locale = useLocale();
  const [list, setList] = useState<SarieeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/api/sariee/orders', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: { orders?: SarieeOrder[]; authenticated?: boolean }) => {
        setList(d.orders ?? []);
        setAuthenticated(d.authenticated ?? false);
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-32 animate-pulse rounded-2xl bg-light/50" aria-hidden />;
  }

  if (!authenticated) {
    return (
      <p className="text-ink/70 mb-6" style={{ fontFamily: 'var(--font-body)' }}>
        {t('sign_in_prompt')}
      </p>
    );
  }

  if (list.length === 0) {
    return (
      <p className="text-ink/70 mb-6" style={{ fontFamily: 'var(--font-body)' }}>
        {t('empty')}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {list.map((o) => {
        const ref = getOrderRef(o);
        const href = `/${locale}/account/orders/${encodeURIComponent(ref)}`;
        const dateStr = getOrderDate(o);
        const date = dateStr
          ? new Date(dateStr).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-GB', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })
          : null;

        return (
          <li key={ref}>
            <Link
              href={href}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/80 bg-light/30 px-4 py-3 hover:border-apricot/50 transition-colors"
            >
              <span className="font-mono text-sm text-ink" style={{ fontFamily: 'var(--font-ui)' }}>
                {ref}
              </span>
              {date && (
                <span className="text-xs text-muted" style={{ fontFamily: 'var(--font-ui)' }}>
                  {date}
                </span>
              )}
              <span className="text-sm text-ink w-full sm:w-auto sm:text-right">
                {t('egp')} {getOrderTotal(o).toLocaleString()}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
