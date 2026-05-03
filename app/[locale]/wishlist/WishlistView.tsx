'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import ProductCard from '@/components/ProductCard';
import { useWishlistStore } from '@/lib/wishlist-store';
import type { Product } from '@/lib/data';

export function WishlistView({ products }: { products: Product[] }) {
  const t = useTranslations('wishlist');
  const ids = useWishlistStore((s) => s.ids);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const list = useMemo(() => {
    if (!mounted) return [];
    return products.filter((p) => ids.includes(p.id));
  }, [ids, mounted, products]);

  if (!mounted) {
    return <div className="h-36 rounded-2xl bg-light/40 animate-pulse" aria-hidden />;
  }
  if (list.length === 0) {
    return (
      <p className="text-ink/70 mb-8" style={{ fontFamily: 'var(--font-body)' }}>
        {t('empty')}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
      {list.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function WishlistFooterCta() {
  const t = useTranslations('wishlist');
  const locale = useLocale();
  return (
    <div className="mt-10 pt-8 border-t border-border/50">
      <Link
        href={`/${locale}/shop`}
        className="text-[10px] tracking-[0.25em] uppercase font-bold text-apricot hover:underline"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {t('shop_cta')}
      </Link>
    </div>
  );
}
