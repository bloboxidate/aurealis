'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCartStore } from '@/lib/store';

export default function CartPage() {
  const t = useTranslations('cart');
  const tProduct = useTranslations('product');
  const locale = useLocale();
  const { items, removeItem, updateQuantity, total } = useCartStore();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-petal">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 pt-44 sm:pt-52">
          <h1
            className="text-[clamp(2rem,5vw,3rem)] font-light italic text-ink mb-10 sm:mb-14"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-24 sm:py-32 space-y-8 rounded-[2rem] border border-dashed border-border/80 bg-light/50">
              <svg className="w-16 h-16 mx-auto text-ink/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" x2="21" y1="6" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="text-muted" style={{ fontFamily: 'var(--font-body)' }}>
                {t('empty')}
              </p>
              <Link
                href={`/${locale}/shop`}
                className="inline-flex px-10 py-4 bg-apricot text-petal text-[10px] tracking-[0.3em] uppercase font-bold rounded-full hover:bg-apricot-deep transition-colors"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {t('empty_cta')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
              <div className="lg:col-span-2 space-y-0 divide-y divide-border rounded-2xl overflow-hidden ring-1 ring-ink/5 bg-petal shadow-sm">
                {items.map(({ product, quantity }) => {
                  const name = locale === 'ar' ? product.name_ar : product.name_en;
                  return (
                    <div key={product.id} className="flex gap-4 sm:gap-6 p-5 sm:p-6">
                      <div className="w-20 h-28 sm:w-24 sm:h-32 bg-light flex-shrink-0 flex items-center justify-center text-apricot rounded-xl">
                        <svg viewBox="0 0 60 60" className="w-10 h-10 opacity-25" fill="none" aria-hidden>
                          <circle cx="30" cy="30" r="18" stroke="currentColor" strokeWidth="1" />
                          <path
                            d="M30 12 L32 28 L48 30 L32 32 L30 48 L28 32 L12 30 L28 28Z"
                            fill="currentColor"
                            fillOpacity="0.5"
                          />
                        </svg>
                      </div>

                      <div className="flex-1 space-y-3 min-w-0">
                        <h3 className="text-ink font-medium leading-snug" style={{ fontFamily: 'var(--font-body)' }}>
                          {name}
                        </h3>
                        <p className="text-muted text-sm">
                          {tProduct('egp')} {product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-muted tracking-[0.2em] uppercase font-bold" style={{ fontFamily: 'var(--font-ui)' }}>
                            {t('qty')}
                          </span>
                          <div className="inline-flex items-center border border-border rounded-full overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="min-w-11 min-h-11 w-11 h-11 flex items-center justify-center text-ink hover:bg-light transition-colors text-lg touch-manipulation"
                            >
                              −
                            </button>
                            <span className="min-w-9 text-center text-sm font-medium tabular-nums">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="min-w-11 min-h-11 w-11 h-11 flex items-center justify-center text-ink hover:bg-light transition-colors text-lg touch-manipulation"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-2 flex-shrink-0">
                        <p className="text-ink font-semibold" style={{ fontFamily: 'var(--font-body)' }}>
                          {tProduct('egp')} {(product.price * quantity).toLocaleString()}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="text-[10px] tracking-[0.2em] uppercase font-bold text-muted hover:text-apricot transition-colors"
                          style={{ fontFamily: 'var(--font-ui)' }}
                        >
                          {t('remove')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-ink-abyss text-petal p-6 sm:p-8 rounded-[1.75rem] space-y-6 sticky top-28 shadow-xl">
                  <h2 className="text-sm tracking-[0.25em] uppercase font-bold text-petal/90" style={{ fontFamily: 'var(--font-ui)' }}>
                    {t('order_summary')}
                  </h2>

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-petal/50">{t('subtotal')}</span>
                      <span className="text-petal">{tProduct('egp')} {total().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-4 items-start">
                      <span className="text-petal/50">{t('shipping')}</span>
                      <span className="text-petal/70 text-right text-xs max-w-[12rem]">{t('shipping_note')}</span>
                    </div>
                    <div className="border-t border-petal/15 pt-4 flex justify-between font-semibold text-base">
                      <span>{t('total')}</span>
                      <span>{tProduct('egp')} {total().toLocaleString()}</span>
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/checkout`}
                    className="flex w-full items-center justify-center py-4 rounded-full bg-apricot text-petal text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-apricot-deep transition-colors"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {t('checkout')}
                  </Link>

                  <Link
                    href={`/${locale}/shop`}
                    className="block text-center text-[10px] tracking-[0.3em] uppercase font-bold text-petal/45 hover:text-apricot transition-colors"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {t('continue_shopping')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
