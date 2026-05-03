import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchCollections } from '@/lib/sariee/collections';

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  const locale = await getLocale();
  const t = await getTranslations('collections');
  const collections = await fetchCollections();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-petal pt-28 sm:pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-muted mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
              {t('kicker')}
            </p>
            <h1 className="text-[clamp(2rem,5vw,3rem)] font-light italic text-ink" style={{ fontFamily: 'var(--font-display)' }}>
              {t('title')}
            </h1>
          </div>

          {collections.length === 0 ? (
            <p className="text-muted" style={{ fontFamily: 'var(--font-body)' }}>{t('empty')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((col) => {
                const name = locale === 'ar' ? col.name_ar || col.name : col.name;
                const desc = locale === 'ar' ? col.description_ar || col.description : col.description;
                return (
                  <Link
                    key={String(col.id)}
                    href={`/${locale}/collections/${col.slug}`}
                    className="group rounded-2xl overflow-hidden border border-border/60 bg-light/30 hover:border-apricot/40 transition-colors"
                  >
                    {col.image ? (
                      <div className="aspect-[4/3] overflow-hidden bg-light">
                        <img
                          src={col.image}
                          alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-gradient-to-br from-apricot/10 to-apricot/5 flex items-center justify-center">
                        <span className="text-4xl text-apricot/30" aria-hidden>✦</span>
                      </div>
                    )}
                    <div className="p-5">
                      <h2 className="font-medium text-ink mb-1" style={{ fontFamily: 'var(--font-body)' }}>{name}</h2>
                      {desc && (
                        <p className="text-sm text-muted line-clamp-2" style={{ fontFamily: 'var(--font-body)' }}>{desc}</p>
                      )}
                      {col.products_count > 0 && (
                        <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-apricot mt-2" style={{ fontFamily: 'var(--font-ui)' }}>
                          {col.products_count} {t('products_count')}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
