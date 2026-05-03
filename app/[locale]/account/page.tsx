import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';
import Link from 'next/link';
import { getCustomer } from '@/lib/auth/customer';
import { getUserDisplayName } from '@/lib/auth/user-display-name';

const LINKS: { hrefKey: 'orders' | 'wishlist' | 'track' | 'settings' | 'shop' | 'contact'; style: 'primary' | 'ghost' }[] = [
  { hrefKey: 'orders', style: 'primary' },
  { hrefKey: 'wishlist', style: 'primary' },
  { hrefKey: 'track', style: 'ghost' },
  { hrefKey: 'settings', style: 'ghost' },
  { hrefKey: 'shop', style: 'ghost' },
  { hrefKey: 'contact', style: 'ghost' },
];

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('account');
  const { user } = await getCustomer();
  const paths: Record<(typeof LINKS)[number]['hrefKey'], string> = {
    orders: `/${locale}/account/orders`,
    wishlist: `/${locale}/wishlist`,
    track: `/${locale}/track-order`,
    settings: `/${locale}/account/settings`,
    shop: `/${locale}/shop`,
    contact: `/${locale}/contact`,
  };

  return (
    <ContentPageLayout title={t('title')} kicker={t('kicker')}>
      {user && (
        <p className="text-ink/90 text-lg font-light italic mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          {t('welcome', { name: getUserDisplayName(user) })}
        </p>
      )}
      <p className="text-ink/75 leading-relaxed mb-10" style={{ fontFamily: 'var(--font-body)' }}>
        {t('body')}
      </p>
      <ul className="grid gap-3 sm:grid-cols-2 max-w-2xl">
        {LINKS.map(({ hrefKey, style }) => (
          <li key={hrefKey}>
            <Link
              href={paths[hrefKey]}
              className={`flex items-center justify-between gap-2 rounded-2xl border px-5 py-4 text-[10px] tracking-[0.2em] uppercase font-bold transition-colors ${
                style === 'primary'
                  ? 'border-apricot/50 bg-light/30 text-ink hover:bg-apricot/10'
                  : 'border-border/70 text-ink/65 hover:text-apricot hover:border-apricot/30'
              }`}
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {t(`link_${hrefKey}`)}
              <span className="text-apricot opacity-70" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </ContentPageLayout>
  );
}
