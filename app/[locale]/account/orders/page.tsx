import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';
import { OrdersClient } from './OrdersClient';
import Link from 'next/link';

export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('orders');

  return (
    <ContentPageLayout title={t('title')} kicker={t('kicker')}>
      <p className="text-sm text-muted mb-6" style={{ fontFamily: 'var(--font-body)' }}>
        {t('intro')}
      </p>
      <OrdersClient />
      <div className="mt-10 pt-8 border-t border-border/50">
        <Link
          href={`/${locale}/shop`}
          className="text-[10px] tracking-[0.25em] uppercase font-bold text-apricot hover:underline"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {t('shop_cta')}
        </Link>
      </div>
    </ContentPageLayout>
  );
}
