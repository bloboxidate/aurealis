import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';
import { getAllProducts } from '@/lib/data';
import { WishlistView, WishlistFooterCta } from './WishlistView';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const t = await getTranslations('wishlist');
  const products = await getAllProducts();

  return (
    <ContentPageLayout title={t('title')} kicker={t('kicker')}>
      <p className="text-sm text-muted mb-8" style={{ fontFamily: 'var(--font-body)' }}>
        {t('intro')}
      </p>
      <div className="min-h-[120px]">
        <WishlistView products={products} />
      </div>
      <WishlistFooterCta />
    </ContentPageLayout>
  );
}
