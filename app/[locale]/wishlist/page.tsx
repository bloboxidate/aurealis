import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';
import { WishlistView, WishlistFooterCta } from './WishlistView';

export default async function WishlistPage() {
  const t = await getTranslations('wishlist');

  return (
    <ContentPageLayout title={t('title')} kicker={t('kicker')}>
      <p className="text-sm text-muted mb-8" style={{ fontFamily: 'var(--font-body)' }}>
        {t('intro')}
      </p>
      <div className="min-h-[120px]">
        <WishlistView />
      </div>
      <WishlistFooterCta />
    </ContentPageLayout>
  );
}
