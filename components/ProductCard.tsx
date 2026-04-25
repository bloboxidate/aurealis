'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useCartStore } from '@/lib/store';
import type { Product } from '@/lib/data';

const CATEGORY_BG: Record<string, string> = {
  skincare:
    'linear-gradient(145deg, color-mix(in srgb, #fff9f3 50%, #f7d595 50%) 0%, color-mix(in srgb, #f7d595 75%, #fff9f3 25%) 100%)',
  makeup:
    'linear-gradient(145deg, color-mix(in srgb, #fff9f3 40%, #f8ae7f 60%) 0%, color-mix(in srgb, #f8ae7f 50%, #f7d595 50%) 100%)',
  fragrance:
    'linear-gradient(145deg, color-mix(in srgb, #fff9f3 50%, #bfb5e8 50%) 0%, color-mix(in srgb, #bfb5e8 55%, #a5bf97 45%) 100%)',
};

const CATEGORY_ACCENT: Record<string, string> = {
  skincare:  '#a5bf97',
  makeup:    '#f8ae7f',
  fragrance: '#bfb5e8',
};

type CardSize = 'default' | 'showcase';

export default function ProductCard({ product, size = 'default' }: { product: Product; size?: CardSize }) {
  const t = useTranslations('product');
  const locale = useLocale();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const bg   = CATEGORY_BG[product.category]     ?? CATEGORY_BG.makeup;
  const accent = CATEGORY_ACCENT[product.category] ?? '#f8ae7f';
  const showcase = size === 'showcase';

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.in_stock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      href={`/${locale}/product/${product.slug}`}
      className={`group block ${showcase ? 'max-w-4xl' : ''}`}
    >
      <div
        className={`relative overflow-hidden mb-4 ring-1 ring-ink/5 shadow-xl lux-card-lift ${
          showcase
            ? 'aspect-[4/3] sm:aspect-[16/9] rounded-[2rem]'
            : 'aspect-[3/4] rounded-2xl'
        }`}
        style={{ background: bg }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 80 80"
            className={showcase ? 'w-24 h-24 sm:w-32 sm:h-32' : 'w-14 h-14'}
            fill="none"
            aria-hidden
          >
            <path
              d="M40 8l2.2 28.8L80 40l-37.8 3.2L40 72l-2.2-28.8L0 40l37.8-3.2Z"
              fill={accent}
              fillOpacity="0.2"
            />
            <path
              d="M40 8l2.2 28.8L80 40l-37.8 3.2L40 72l-2.2-28.8L0 40l37.8-3.2Z"
              stroke={accent}
              strokeWidth="0.8"
              fill="none"
            />
          </svg>
        </div>

        {!product.in_stock && (
          <div className="absolute inset-0 bg-petal/75 flex items-center justify-center backdrop-blur-sm">
            <span
              className="text-[10px] tracking-[0.3em] uppercase text-muted font-bold"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {t('out_of_stock')}
            </span>
          </div>
        )}

        <div
          className="absolute inset-x-0 bottom-0 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        >
          <button
            onClick={handleAdd}
            disabled={!product.in_stock}
            className="w-full min-h-[48px] py-3.5 md:py-4 text-petal text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-bold disabled:opacity-40 touch-manipulation"
            style={{
              fontFamily: 'var(--font-ui)',
              backgroundColor: accent,
            }}
            type="button"
          >
            {added ? t('added') : t('add_to_cart')}
          </button>
        </div>
      </div>

      <div className={`px-1 space-y-1 ${showcase ? 'text-center sm:text-left' : ''}`}>
        <h3
          className={`text-ink font-light leading-snug group-hover:text-apricot transition-colors ${
            showcase ? 'text-2xl sm:text-3xl' : 'text-[1.12rem] sm:text-lg'
          }`}
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
        >
          {name}
        </h3>
        <p
          className="text-muted text-xs sm:text-sm tracking-wider"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {t('egp')} {product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
