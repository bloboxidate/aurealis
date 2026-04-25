import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';
import Link from 'next/link';

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('account');

  return (
    <ContentPageLayout title={t('title')} kicker={t('kicker')}>
      <p className="text-ink/75 leading-relaxed mb-8" style={{ fontFamily: 'var(--font-body)' }}>
        {t('body')}
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/${locale}/shop`}
          className="inline-block px-6 py-3 rounded-full bg-apricot text-petal text-[10px] tracking-[0.3em] uppercase font-bold"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {t('cta_shop')}
        </Link>
        <Link
          href={`/${locale}/contact`}
          className="inline-block px-6 py-3 rounded-full border-2 border-ink/15 text-ink/70 text-[10px] tracking-[0.3em] uppercase font-bold"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {t('cta_contact')}
        </Link>
      </div>
    </ContentPageLayout>
  );
}
