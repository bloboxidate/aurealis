import './globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { InitialLoadOverlay } from '@/components/InitialLoadOverlay';
import { getMetadataBaseUrl } from '@/lib/env';

export const metadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
  title: { default: 'Auréalis', template: '%s | Auréalis' },
  description: 'Beauty Inspired by the Golden Light',
  applicationName: 'Auréalis',
  openGraph: {
    type: 'website',
    siteName: 'Auréalis',
    title: 'Auréalis',
    description: 'Beauty Inspired by the Golden Light',
    locale: 'en',
    alternateLocale: ['ar'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auréalis',
    description: 'Beauty Inspired by the Golden Light',
  },
  robots: { index: true, follow: true },
  referrer: 'strict-origin-when-cross-origin',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#fff9f3',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className="relative">
        <Script id="aurealis-ethereum-stub" strategy="beforeInteractive">
          {`(function(){try{if(typeof window!=='undefined'&&window.ethereum==null)window.ethereum={selectedAddress:null}}catch(_){}})();`}
        </Script>
        <InitialLoadOverlay />
        {children}
      </body>
    </html>
  );
}
