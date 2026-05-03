'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/data';

const CATEGORIES = ['all', 'skincare', 'makeup', 'fragrance'] as const;
type Category = (typeof CATEGORIES)[number];

export default function ShopView({ products }: { products: Product[] }) {
  const t = useTranslations('shop');
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [sort, setSort] = useState('newest');

  const filtered = products
    .filter((p) => activeCategory === 'all' || p.category === activeCategory)
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      return Number(b.id) - Number(a.id);
    });

  const filterLabel = (cat: Category) => {
    const keys = {
      all: t('filter_all'),
      skincare: t('filter_skincare'),
      makeup: t('filter_makeup'),
      fragrance: t('filter_fragrance'),
    };
    return keys[cat];
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-petal">
        <section className="relative overflow-hidden border-b border-border/50">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(ellipse 60% 80% at 100% 0%, color-mix(in srgb, #f8ae7f 25%, transparent), transparent), radial-gradient(ellipse 50% 50% at 0% 100%, color-mix(in srgb, #bfb5e8 30%, transparent), transparent)',
            }}
            aria-hidden
          />
          <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-44 sm:pt-52 pb-12 lg:pt-40 lg:pb-16">
            <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16">
              <h1
                className="text-[clamp(2.5rem,7vw,5rem)] font-light italic text-ink leading-[0.95] max-w-[12ch]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('title')}
              </h1>
              <p
                className="text-muted text-sm sm:text-base max-w-sm leading-relaxed lg:mb-2"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {t('subtitle')}
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            <aside className="lg:w-56 shrink-0">
              <p
                className="text-[10px] tracking-[0.4em] uppercase font-bold text-apricot mb-4"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {locale === 'ar' ? 'تصفح' : 'Filter'}
              </p>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left px-0 py-2.5 text-xs tracking-[0.15em] uppercase font-bold border-b border-transparent transition-colors ${
                      activeCategory === cat
                        ? 'text-apricot border-apricot'
                        : 'text-ink/45 hover:text-ink'
                    }`}
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {filterLabel(cat)}
                  </button>
                ))}
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-8">
                <label className="text-[10px] tracking-[0.35em] uppercase font-bold text-muted" style={{ fontFamily: 'var(--font-ui)' }}>
                  {t('sort_label')}
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-light border border-border text-ink text-xs px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-apricot/40 cursor-pointer"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  <option value="newest">{t('sort_newest')}</option>
                  <option value="price_asc">{t('sort_price_asc')}</option>
                  <option value="price_desc">{t('sort_price_desc')}</option>
                </select>
              </div>

              {filtered.length === 0 ? (
                <div
                  className="text-center py-32 text-muted text-sm"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {t('no_products')}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
