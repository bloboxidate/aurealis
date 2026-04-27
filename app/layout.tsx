import './globals.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { InitialLoadOverlay } from '@/components/InitialLoadOverlay';

export const metadata: Metadata = {
  title: 'Auréalis',
  description: 'Beauty Inspired by the Golden Light',
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
