import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import './globals.css';
import { SITE_URL } from '@/lib/seo/meta';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '800'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'Segoe UI', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={montserrat.variable}>{children}</body>
    </html>
  );
}
