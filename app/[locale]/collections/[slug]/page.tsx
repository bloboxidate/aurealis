import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { fetchSingleCollection, fetchCollectionProducts } from '@/lib/sariee/collections';

export const dynamic = 'force-dynamic';

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations('collections');

  const [collection, products] = await Promise.all([
    fetchSingleCollection(slug),
    fetchCollectionProducts(slug),
  ]);

  if (!collection && products.length === 0) notFound();

  const name = locale === 'ar'
    ? collection?.name_ar || collection?.name || slug
    : collection?.name || slug;
  const desc = locale === 'ar'
    ? collection?.description_ar || collection?.description
    : collection?.description;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-petal pt-44 sm:pt-52 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-sm text-muted mb-6">
            <Link href={`/${locale}/collections`} className="text-apricot hover:underline">
              ← {t('back')}
            </Link>
          </p>

          <div className="mb-10 border-b border-border/60 pb-8">
            <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-muted mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
              {t('kicker')}
            </p>
            <h1 className="text-[clamp(2rem,5vw,3rem)] font-light italic text-ink mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              {name}
            </h1>
            {desc && (
              <p className="text-ink/70 max-w-2xl" style={{ fontFamily: 'var(--font-body)' }}>{desc}</p>
            )}
          </div>

          {products.length === 0 ? (
            <p className="text-muted" style={{ fontFamily: 'var(--font-body)' }}>{t('empty_products')}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
