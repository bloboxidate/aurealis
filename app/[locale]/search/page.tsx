'use client';

import { useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/data';

function SearchResults() {
  const t = useTranslations('search');
  const locale = useLocale();
  const sp = useSearchParams();
  const raw = sp.get('q')?.trim() ?? '';
  const q = raw.toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return products;
    return products.filter((p) => {
      const blob = (p.name_en + p.name_ar + p.slug + p.name_en).toLowerCase();
      return blob.includes(q);
    });
  }, [q]);

  return (
    <div className="min-h-screen bg-petal">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-28 sm:pt-32">
        <h1
          className="text-[clamp(1.75rem,4vw,2.5rem)] font-light italic text-ink mb-8"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t('title')}
        </h1>
        <form action={`/${locale}/search`} method="get" className="flex flex-col sm:flex-row gap-3 mb-10 max-w-xl">
          <input
            name="q"
            defaultValue={raw}
            type="search"
            placeholder={t('placeholder')}
            className="flex-1 px-4 py-3 rounded-full border border-border bg-petal text-ink text-sm focus:outline-none focus:ring-2 focus:ring-apricot/30"
            style={{ fontFamily: 'var(--font-body)' }}
            autoComplete="off"
          />
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-ink text-petal text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-apricot transition-colors"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {t('submit')}
          </button>
        </form>
        {q ? (
          <p className="text-sm text-muted mb-6" style={{ fontFamily: 'var(--font-ui)' }}>
            {t('results_for', { query: raw })}
          </p>
        ) : null}
        {filtered.length === 0 ? (
          <p className="text-muted text-center py-16" style={{ fontFamily: 'var(--font-body)' }}>
            {t('no_results')}
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
        {q && filtered.length === 0 && (
          <p className="text-center mt-6">
            <Link href={`/${locale}/shop`} className="text-apricot text-sm font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-ui)' }}>
              {t('browse_all')}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center bg-petal text-muted">…</div>
        }
      >
        <SearchResults />
      </Suspense>
      <Footer />
    </>
  );
}
