import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  const locale = await getLocale();
  const other = locale === 'en' ? 'ar' : 'en';

  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] bg-petal flex flex-col items-center justify-center px-4 pt-32 sm:pt-36 pb-20 text-center max-w-lg mx-auto">
        <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-apricot mb-2" style={{ fontFamily: 'var(--font-ui)' }}>
          {t('kicker')}
        </p>
        <h1
          className="text-3xl sm:text-4xl font-light italic text-ink mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t('title')}
        </h1>
        <p className="text-ink/70 mb-8" style={{ fontFamily: 'var(--font-body)' }}>
          {t('body')}
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
          <Link
            href={`/${locale}`}
            className="inline-flex justify-center px-8 py-3.5 rounded-full bg-ink text-petal text-[10px] tracking-[0.3em] uppercase font-bold"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {t('cta_home')}
          </Link>
          <Link
            href={`/${locale}/shop`}
            className="inline-flex justify-center px-8 py-3.5 rounded-full border-2 border-ink/15 text-ink/80 text-[10px] tracking-[0.3em] uppercase font-bold"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {t('cta_shop')}
          </Link>
          <Link
            href={`/${other}`}
            className="inline-flex justify-center px-8 py-3.5 rounded-full border-2 border-apricot/30 text-ink/70 text-[10px] tracking-[0.3em] uppercase font-bold"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {t('switch_lang', { lang: other === 'ar' ? 'عربي' : 'English' })}
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
