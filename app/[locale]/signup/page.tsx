import { getTranslations } from 'next-intl/server';
import { ContentPageLayout } from '@/components/ContentPageLayout';
import { SignupForm } from './SignupForm';

export default async function SignupPage() {
  const t = await getTranslations('auth');

  return (
    <ContentPageLayout title={t('signup_title')} kicker={t('kicker')}>
      <p className="text-sm text-muted mb-8" style={{ fontFamily: 'var(--font-body)' }}>
        {t('signup_intro')}
      </p>
      <SignupForm />
    </ContentPageLayout>
  );
}
