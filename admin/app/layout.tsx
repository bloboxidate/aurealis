import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Auréalis — Admin',
  description: 'Internal dashboard',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>{children}</body>
    </html>
  );
}
