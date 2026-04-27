import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  const t = await getTranslations('auth');

  return (
    <ContentPageLayout title={t('login_title')} kicker={t('kicker')}>
      <p className="text-sm text-muted mb-8" style={{ fontFamily: 'var(--font-body)' }}>
        {t('login_intro')}
      </p>
      <Suspense fallback={<div className="h-64 rounded-2xl bg-light/30 animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </ContentPageLayout>
  );
}
