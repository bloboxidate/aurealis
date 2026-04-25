import './globals.css';
import type { Metadata, Viewport } from 'next';
import { InitialLoadOverlay } from '@/components/InitialLoadOverlay';

export const metadata: Metadata = {
  title: 'Auréalis',
  description: 'Beauty Inspired by the Golden Light',
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }],
  },
};

/** width=device-width, safe areas for notches, user zoom allowed (accessibility). */
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
        <InitialLoadOverlay />
        {children}
      </body>
    </html>
  );
}
