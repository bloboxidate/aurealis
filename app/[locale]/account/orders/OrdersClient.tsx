'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getStoredOrders, type StoredOrder } from '@/lib/orders-persist';

export function OrdersClient() {
  const t = useTranslations('orders');
  const locale = useLocale();
  const [list, setList] = useState<StoredOrder[]>([]);

  useEffect(() => {
    setList(getStoredOrders());
  }, []);

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
        const href = `/${locale}/account/orders/${encodeURIComponent(o.ref)}`;
        const date = new Date(o.createdAt).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-GB', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
        return (
          <li key={o.ref}>
            <Link
              href={href}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/80 bg-light/30 px-4 py-3 hover:border-apricot/50 transition-colors"
            >
              <span className="font-mono text-sm text-ink" style={{ fontFamily: 'var(--font-ui)' }}>
                {o.ref}
              </span>
              <span className="text-xs text-muted" style={{ fontFamily: 'var(--font-ui)' }}>
                {date}
              </span>
              <span className="text-sm text-ink w-full sm:w-auto sm:text-right">
                {t('egp')} {o.totalEgp.toLocaleString()}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
