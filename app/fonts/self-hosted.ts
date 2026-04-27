import localFont from 'next/font/local';

export const fontCormorant = localFont({
  src: [
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff2', weight: '300', style: 'italic' },
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2', weight: '400', style: 'italic' },
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2', weight: '500', style: 'italic' },
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-italic.woff2', weight: '600', style: 'italic' },
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: '../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-700-italic.woff2', weight: '700', style: 'italic' },
  ],
  variable: '--font-cormorant',
  display: 'swap',
});

export const fontSyne = localFont({
  src: [
    { path: '../../node_modules/@fontsource/syne/files/syne-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../node_modules/@fontsource/syne/files/syne-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../node_modules/@fontsource/syne/files/syne-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../../node_modules/@fontsource/syne/files/syne-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-syne',
  display: 'swap',
});
