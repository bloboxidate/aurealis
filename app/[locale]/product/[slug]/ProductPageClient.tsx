'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Product } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { useState } from 'react';

export default function ProductPageClient({ product }: { product: Product }) {
  const t = useTranslations('product');
  const locale = useLocale();
  const productId = product.id;
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(productId));
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'how_to_use'>('description');


  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const description = locale === 'ar' ? product.description_ar : product.description_en;
  const ingredients = locale === 'ar' ? product.ingredients_ar || product.ingredients : product.ingredients;
  const howToUse = locale === 'ar' ? product.how_to_use_ar || product.how_to_use : product.how_to_use;

  const availableTabs = (
    [
      'description',
      ...(ingredients ? ['ingredients' as const] : []),
      ...(howToUse ? ['how_to_use' as const] : []),
    ] as const
  );

  const handleAdd = () => {
    if (!product.in_stock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = () => toggleWishlist(product.id);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-petal">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-44 sm:pt-52 pb-16 sm:pb-20">
          <nav
            className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[10px] sm:text-xs text-muted tracking-[0.25em] uppercase font-bold mb-8 sm:mb-12"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            <Link href={`/${locale}`} className="hover:text-apricot transition-colors">
              {locale === 'ar' ? 'الرئيسية' : 'Home'}
            </Link>
            <span className="text-ink/20">·</span>
            <Link href={`/${locale}/shop`} className="hover:text-apricot transition-colors">
              {locale === 'ar' ? 'المتجر' : 'Shop'}
            </Link>
            <span className="text-ink/20">·</span>
            <span className="text-ink line-clamp-1">{name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 xl:gap-24 items-start">
            <div
              className="relative aspect-[4/5] sm:aspect-square lg:aspect-[3/4] max-h-[min(80vh,720px)] rounded-[2.5rem] overflow-hidden flex items-center justify-center text-apricot ring-1 ring-ink/5 shadow-2xl"
              style={{
                background: 'linear-gradient(165deg, color-mix(in srgb, #fff9f3 20%, #f7d595 40%) 0%, color-mix(in srgb, #bfb5e8 30%, #a5bf97 70%) 100%)',
              }}
            >
              <svg viewBox="0 0 200 200" className="w-36 h-36 sm:w-44 sm:h-44 opacity-25" fill="none" aria-hidden>
                <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.8" />
                <path
                  d="M100 40 L106 94 L160 100 L106 106 L100 160 L94 106 L40 100 L94 94Z"
                  fill="currentColor"
                  fillOpacity="0.35"
                />
              </svg>
              <div
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[9px] sm:text-[10px] tracking-[0.4em] uppercase font-bold text-ink/40 bg-petal/80 backdrop-blur-sm px-3 py-1.5 rounded-full"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {product.category}
              </div>
            </div>

            <div className="space-y-8 sm:space-y-10 lg:pt-4">
              <div className="space-y-4">
                <p
                  className="text-[10px] sm:text-xs tracking-[0.45em] uppercase font-bold text-apricot"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {product.category}
                </p>
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-light italic text-ink leading-[1.05]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {name}
                </h1>
                <p className="text-2xl sm:text-3xl text-ink font-light" style={{ fontFamily: 'var(--font-body)' }}>
                  {t('egp')} {product.price.toLocaleString()}
                </p>
              </div>

              <div className="h-px bg-border/80" />

              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${product.in_stock ? 'bg-sage' : 'bg-lavender'}`} />
                <span
                  className="text-xs tracking-[0.3em] uppercase font-bold text-muted"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {product.in_stock ? t('in_stock') : t('out_of_stock')}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md w-full">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!product.in_stock}
                  className="flex-1 py-5 rounded-full bg-apricot text-petal text-xs tracking-[0.35em] uppercase font-bold hover:bg-apricot-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {added ? t('added') : t('add_to_cart')}
                </button>
                <button
                  type="button"
                  onClick={handleWishlist}
                  className="sm:w-16 py-5 rounded-full border-2 border-ink/12 flex items-center justify-center text-ink/45 hover:text-apricot hover:border-apricot/30 transition-colors min-h-[48px] min-w-[48px] shrink-0"
                  aria-pressed={inWishlist}
                  aria-label={inWishlist ? t('wishlist_remove') : t('wishlist_add')}
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" className={inWishlist ? 'text-apricot' : 'text-current'} aria-hidden>
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill={inWishlist ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 max-w-2xl">
                {availableTabs.length > 1 && (
                  <div className="flex flex-wrap gap-1 border-b border-border">
                    {availableTabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 px-3 sm:px-4 text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase font-bold transition-colors -mb-px ${
                          activeTab === tab
                            ? 'border-b-2 border-apricot text-apricot'
                            : 'text-muted hover:text-ink'
                        }`}
                        style={{ fontFamily: 'var(--font-ui)' }}
                      >
                        {t(tab)}
                      </button>
                    ))}
                  </div>
                )}
                <div className="text-ink/75 text-sm sm:text-base leading-relaxed py-2" style={{ fontFamily: 'var(--font-body)' }}>
                  {activeTab === 'description' && description}
                  {activeTab === 'ingredients' && ingredients}
                  {activeTab === 'how_to_use' && howToUse}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
