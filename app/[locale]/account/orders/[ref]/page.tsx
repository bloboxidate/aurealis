import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';
import { OrderDetailClient } from './OrderDetailClient';

export default async function OrderDetailPage({ params }: { params: Promise<{ locale: string; ref: string }> }) {
  const { ref } = await params;
  const t = await getTranslations('orderDetail');

  return (
    <ContentPageLayout title={t('title')} kicker={t('kicker')}>
      <OrderDetailClient refParam={ref} />
    </ContentPageLayout>
  );
}
