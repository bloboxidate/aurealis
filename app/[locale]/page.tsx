import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import BrandWordmark from '@/components/BrandWordmark';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import NewsletterForm from '@/components/NewsletterForm';
import LuxuryReveal from '@/components/LuxuryReveal';
import { getAllProducts } from '@/lib/data';

function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M10 0l1.18 8.82L20 10l-8.82 1.18L10 20l-1.18-8.82L0 10l8.82-1.18Z" />
    </svg>
  );
}

const TICKER = [
  'Confident',
  'Radiant',
  'Minimal',
  'Modern',
];

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const t = await getTranslations('home');
  const locale = await getLocale();
  const isRtl = locale === 'ar';
  const products = await getAllProducts();
  const featured = products.filter((p) => p.featured);
  const hero = featured[0];
  const restFeatured = featured.slice(1);

  return (
    <>
      <Navbar />

      <section
        className={`relative min-h-[100dvh] mesh-hero mesh-hero--ambient grain flex flex-col lg:flex-row overflow-hidden ${isRtl ? 'lg:flex-row-reverse' : ''}`}
      >
        <div className="lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 lg:pl-14 lg:pr-6 pt-36 pb-16 lg:py-0 lg:min-h-[100dvh]">
          <div className="reveal-children max-w-xl space-y-8">
            <p
              className="text-[10px] sm:text-xs tracking-[0.45em] uppercase font-bold text-apricot"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {locale === 'ar' ? 'القاهرة' : 'Cairo · Est. 2024'}
            </p>
            <h1
              className="font-light italic text-ink leading-[var(--text-hero-tight)] tracking-[-0.02em] max-w-[20ch]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-hero)',
              }}
            >
              {t('hero_tagline')}
            </h1>
            <p
              className="text-sm sm:text-base text-muted leading-relaxed max-w-md"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t('hero_sub')}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="./shop"
                className="btn-hero-cta inline-flex items-center justify-center px-9 py-4 bg-apricot text-petal rounded-full text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-apricot-deep"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {t('hero_cta_primary')}
              </Link>
              <Link
                href="./about"
                className="inline-flex items-center justify-center px-7 py-4 border-2 border-ink/15 text-ink/70 rounded-full text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-semibold hover:border-apricot hover:text-apricot transition-colors"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {t('hero_cta_secondary')}
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex items-center justify-center relative px-4 sm:px-8 pb-20 pt-4 lg:pb-0 lg:pt-0 min-h-[52vh] sm:min-h-[48vh] lg:min-h-0 w-full max-w-2xl mx-auto lg:max-w-none">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute w-[min(100%,520px)] aspect-square -right-1/4 top-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[100px]"
              style={{ background: 'radial-gradient(circle, #f7d595, #bfb5e8)' }}
            />
          </div>
          <div className="relative flex w-full max-w-2xl flex-col items-center justify-center gap-7 sm:gap-8 animate-float-logo">
            <BrandWordmark
              width={560}
              height={168}
              src="/logo-black.png"
              blend="none"
              boxClassName="w-full max-w-[min(560px,92vw)] sm:max-w-[min(600px,88vw)]"
              className="[filter:sepia(0.45)_saturate(1.2)_brightness(0.9)_contrast(1.05)_hue-rotate(6deg)] opacity-[0.94] drop-shadow-[0_8px_28px_rgba(165,191,151,0.12)] sm:drop-shadow-[0_12px_40px_rgba(165,191,151,0.16)]"
              priority
              sizes="(max-width: 1024px) 92vw, 600px"
            />
            <div className="flex gap-2 opacity-80">
              <Sparkle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-apricot animate-sparkle-float" />
              <Sparkle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-honey animate-sparkle-float-delayed" />
              <Sparkle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-lavender animate-sparkle-drift" />
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 z-[2]"
          aria-hidden
        >
          <div className="w-px h-12 bg-gradient-to-b from-apricot/60 to-transparent scroll-hint-line" />
        </div>
      </section>

      <div className="relative -mt-2 mb-2 py-1 overflow-hidden bg-ink-abyss ticker-skew">
        <div className="ticker-unskew py-3 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee select-none">
            {[...TICKER, ...TICKER, ...TICKER].map((item, i) => {
              const band = ['#f8ae7f', '#f7d595', '#a5bf97', '#bfb5e8', '#fff9f3'] as const;
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-4 sm:gap-6 px-6 sm:px-8 text-[9px] sm:text-[10px] tracking-[0.35em] uppercase font-bold"
                  style={{ fontFamily: 'var(--font-ui)', color: band[i % 5] }}
                >
                  {item}
                  <Sparkle className="w-1.5 h-1.5 opacity-40 text-petal shrink-0" />
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <LuxuryReveal className="relative z-10">
        <section className="bg-petal px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 lg:mb-20">
            <div>
              <p
                className="text-[10px] tracking-[0.5em] uppercase font-bold text-apricot mb-3"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {locale === 'ar' ? 'استكشفي' : 'Explore'}
              </p>
              <h2
                className="text-[clamp(2.2rem,5vw,4rem)] font-light italic text-ink leading-[1.05]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('categories_title')}
              </h2>
            </div>
            <div className="hidden lg:flex gap-2 text-apricot/80 text-2xl" aria-hidden>
              ✦
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 lg:gap-4 auto-rows-[minmax(180px,auto)]">
            <Link
              href="./shop?category=skincare"
              className="md:col-span-2 lg:col-span-7 lg:row-span-2 group relative z-0 min-h-[280px] lg:min-h-[420px] rounded-[2rem] overflow-hidden ring-1 ring-ink/5 shadow-xl"
            >
              <div
                className="absolute inset-0 z-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                style={{
                  background: 'linear-gradient(145deg, #fff9f3 0%, #f7d595 40%, #f8ae7f 100%)',
                }}
              />
              <div className="bento-sheen-layer z-[1]" aria-hidden />
              <div className="absolute inset-0 z-[2] flex flex-col justify-between p-8 lg:p-12">
                <span
                  className="text-xs tracking-[0.45em] uppercase font-bold text-ink/25"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  01
                </span>
                <div className="space-y-3">
                  <h3
                    className="text-4xl sm:text-5xl lg:text-6xl font-light italic text-ink"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {t('categories_skincare')}
                  </h3>
                  <p className="text-ink/55 max-w-sm text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    {t('categories_skincare_desc')}
                  </p>
                </div>
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-ink/50 group-hover:text-apricot transition-colors" style={{ fontFamily: 'var(--font-ui)' }}>
                  {locale === 'ar' ? 'تسوقي →' : 'Shop →'}
                </span>
              </div>
            </Link>

            {(
              [
                { key: 'makeup' as const, n: '02', g: 'linear-gradient(160deg, color-mix(in srgb, #fff9f3 20%, #f8ae7f 80%) 0%, #f8ae7f 100%)' },
                { key: 'fragrance' as const, n: '03', g: 'linear-gradient(160deg, color-mix(in srgb, #fff9f3 15%, #bfb5e8 85%) 0%, #a5bf97 100%)' },
              ] as const
            ).map(({ key, n, g }) => {
              const title = key === 'makeup' ? t('categories_makeup') : t('categories_fragrance');
              const blurb = key === 'makeup' ? t('categories_makeup_desc') : t('categories_fragrance_desc');
              return (
              <Link
                key={key}
                href={`./shop?category=${key}`}
                className="lg:col-span-5 min-h-[220px] rounded-[1.75rem] overflow-hidden group relative z-0 ring-1 ring-ink/5 shadow-lg"
              >
                <div
                  className="absolute inset-0 z-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  style={{ background: g }}
                />
                <div className="bento-sheen-layer z-[1]" aria-hidden />
                <div className="absolute inset-0 z-[2] flex flex-col justify-between p-7 lg:p-9">
                  <span className="text-xs tracking-[0.45em] uppercase font-bold text-ink/25" style={{ fontFamily: 'var(--font-ui)' }}>
                    {n}
                  </span>
                  <div>
                    <h3
                      className="text-3xl lg:text-4xl font-light italic text-ink mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {title}
                    </h3>
                    <p className="text-ink/50 text-sm leading-snug line-clamp-2" style={{ fontFamily: 'var(--font-body)' }}>
                      {blurb}
                    </p>
                  </div>
                </div>
              </Link>
            );})}
          </div>
        </div>
        </section>
      </LuxuryReveal>

      <LuxuryReveal y={20} durationMs={1100} className="block">
        <section className="bg-[color-mix(in_srgb,#fff9f3_70%,#f7d595_30%)] py-20 lg:py-28">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16">
            <div>
              <p
                className="text-[10px] tracking-[0.5em] uppercase font-bold text-apricot mb-2"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {t('featured_subtitle')}
              </p>
              <h2
                className="text-[clamp(2.2rem,4.5vw,3.75rem)] font-light italic text-ink"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('featured_title')}
              </h2>
            </div>
            <Link
              href="./shop"
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-bold text-ink/50 hover:text-apricot border-b-2 border-ink/10 pb-1 hover:border-apricot self-start transition-colors"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {locale === 'ar' ? 'كل المنتجات' : 'View all'}
              <span aria-hidden>↗</span>
            </Link>
          </div>

          {hero && (
            <div className="mb-6 lg:mb-10 max-w-4xl mx-auto lg:max-w-none">
              <div className="text-center text-[10px] tracking-[0.4em] uppercase font-bold text-apricot/90 mb-4" style={{ fontFamily: 'var(--font-ui)' }}>
                {locale === 'ar' ? 'مختار' : 'Spotlight'}
              </div>
              <ProductCard product={hero} size="showcase" />
            </div>
          )}
          {restFeatured.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {restFeatured.map((p, i) => (
                <LuxuryReveal key={p.id} y={32} durationMs={900} staggerMs={i * 90}>
                  <ProductCard product={p} />
                </LuxuryReveal>
              ))}
            </div>
          )}
        </div>
        </section>
      </LuxuryReveal>

      <LuxuryReveal y={24} durationMs={1200} className="block">
        <section className="relative py-24 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, #a5bf97 35%, #bfb5e8 65%) 0%, #f7d595 50%, #fff9f3 100%)',
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,720px)] opacity-[0.08] pointer-events-none"
          aria-hidden
        >
          <Image src="/submark.png" alt="" width={600} height={600} className="w-full h-auto" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-8">
          <h2
            className="text-[clamp(2rem,4vw,3.25rem)] font-light italic text-ink"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('story_title')}
          </h2>
          <p className="text-ink/70 text-base sm:text-lg leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
            {t('story_body')}
          </p>
          <div className="h-1 w-24 mx-auto brand-gradient rounded-full" />
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="./shop"
              className="px-8 py-3.5 bg-ink text-petal rounded-full text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-apricot transition-colors"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {t('hero_cta_primary')}
            </Link>
            <Link
              href="./about"
              className="px-8 py-3.5 border-2 border-ink/20 text-ink rounded-full text-[10px] tracking-[0.3em] uppercase font-bold hover:border-apricot transition-colors"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {t('story_cta')}
            </Link>
          </div>
        </div>
        </section>
      </LuxuryReveal>

      <div className="flex h-2">
        {['#f8ae7f', '#f7d595', '#a5bf97', '#bfb5e8', '#fff9f3'].map((c) => (
          <div key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      <LuxuryReveal y={16} durationMs={1000} className="block">
        <section className="bg-ink-abyss text-petal py-20 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2
            className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-light italic"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('newsletter_title')}
          </h2>
          <p className="text-petal/50 text-xs tracking-[0.35em] uppercase font-bold" style={{ fontFamily: 'var(--font-ui)' }}>
            {t('newsletter_subtitle')}
          </p>
          <div className="pt-2">
            <NewsletterForm variant="dark" />
          </div>
        </div>
        </section>
      </LuxuryReveal>

      <Footer />
    </>
  );
}
