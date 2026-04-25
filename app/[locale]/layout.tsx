import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { fontCormorant, fontSyne } from '@/app/fonts/self-hosted';
import '../globals.css';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const isRtl = locale === 'ar';

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        lang={locale}
        className={`${fontCormorant.variable} ${fontSyne.variable} min-h-[100dvh] min-h-screen bg-petal antialiased`}
        style={{ fontFamily: 'Optima, Candara, Georgia, Times New Roman, serif' }}
      >
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
