import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';
import Link from 'next/link';
import { getAllProducts } from '@/lib/data';

export default async function DirectoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('directory');
  const products = await getAllProducts();

  const groups: { label: string; items: { href: string; label: string }[] }[] = [
    {
      label: t('group_shop'),
      items: [
        { label: t('link_shop'), href: `/${locale}/shop` },
        { label: t('link_collections'), href: `/${locale}/collections` },
        { label: t('link_blog'), href: `/${locale}/blog` },
        { label: t('link_cart'), href: `/${locale}/cart` },
        { label: t('link_checkout'), href: `/${locale}/checkout` },
        { label: t('link_wishlist'), href: `/${locale}/wishlist` },
        { label: t('link_search'), href: `/${locale}/search` },
      ],
    },
    {
      label: t('group_account'),
      items: [
        { label: t('link_account'), href: `/${locale}/account` },
        { label: t('link_login'), href: `/${locale}/login` },
        { label: t('link_signup'), href: `/${locale}/signup` },
        { label: t('link_orders'), href: `/${locale}/account/orders` },
        { label: t('link_track'), href: `/${locale}/track-order` },
        { label: t('link_settings'), href: `/${locale}/account/settings` },
      ],
    },
    {
      label: t('group_info'),
      items: [
        { label: t('link_about'), href: `/${locale}/about` },
        { label: t('link_contact'), href: `/${locale}/contact` },
        { label: t('link_faq'), href: `/${locale}/faq` },
        { label: t('link_shipping'), href: `/${locale}/shipping` },
        { label: t('link_returns'), href: `/${locale}/returns` },
      ],
    },
    {
      label: t('group_legal'),
      items: [
        { label: t('link_privacy'), href: `/${locale}/privacy` },
        { label: t('link_terms'), href: `/${locale}/terms` },
        { label: t('link_cookies'), href: `/${locale}/cookies` },
        { label: t('link_a11y'), href: `/${locale}/accessibility` },
        { label: t('link_directory'), href: `/${locale}/directory` },
      ],
    },
  ];

  return (
    <ContentPageLayout title={t('title')} kicker={t('kicker')}>
      <p className="text-sm text-muted mb-10" style={{ fontFamily: 'var(--font-body)' }}>
        {t('intro')}
      </p>
      <div className="space-y-12">
        {groups.map((g) => (
          <section key={g.label}>
            <h2
              className="text-[10px] tracking-[0.35em] uppercase font-bold text-apricot mb-4"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {g.label}
            </h2>
            <ul className="space-y-2">
              {g.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-ink/75 hover:text-apricot transition-colors text-sm" style={{ fontFamily: 'var(--font-ui)' }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section>
          <h2
            className="text-[10px] tracking-[0.35em] uppercase font-bold text-apricot mb-4"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {t('group_products')}
          </h2>
          <ul className="space-y-2">
            {products.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/${locale}/product/${p.slug}`}
                  className="text-ink/75 hover:text-apricot transition-colors text-sm"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {locale === 'ar' ? p.name_ar : p.name_en}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ContentPageLayout>
  );
}
