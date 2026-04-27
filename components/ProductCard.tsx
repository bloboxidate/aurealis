'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useCartStore } from '@/lib/store';
import { useWishlistStore } from '@/lib/wishlist-store';
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
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(product.id));
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

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
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

        <div className="absolute top-3 end-3 z-[2]">
          <button
            type="button"
            onClick={handleWishlist}
            className="min-w-[44px] min-h-[44px] rounded-full bg-petal/90 backdrop-blur-sm border border-ink/10 flex items-center justify-center text-ink/50 hover:text-apricot transition-colors touch-manipulation"
            aria-pressed={inWishlist}
            aria-label={inWishlist ? t('wishlist_remove') : t('wishlist_add')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden className={inWishlist ? 'text-apricot' : 'text-ink/50'}>
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill={inWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {!product.in_stock && (
          <div className="absolute inset-0 bg-petal/75 flex items-center justify-center backdrop-blur-sm z-[1]">
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
