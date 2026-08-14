import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { SiteChrome } from '@/app/_components/SiteChrome/SiteChrome';
import { CookieConsent } from '@/app/_components/CookieConsent/CookieConsent';
import { getRefreshToken } from '@/lib/server/authCookies';
import { getServerProfile } from '@/lib/server/profile';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_TWITTER,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
} from '@/lib/seo/meta';
import { JsonLd } from '@/app/_components/JsonLd/JsonLd';
import { DeferredManifest } from '@/app/_components/DeferredManifest/DeferredManifest';
import { organizationSchema, websiteSchema } from '@/lib/seo/schema';
import { routing } from '@/i18n/routing';
import { LOCALES } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: {
    default: DEFAULT_TITLE,
    template: '%s | Minecraft Game',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: {
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  keywords: [
    'Minecraft server',
    'Minecraft survival',
    'Minecraft PvP',
    'Minecraft economy',
    'Minecraft tournaments',
    'Java Edition',
    'Bedrock Edition',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE),
        width: 1200,
        height: 630,
        alt: DEFAULT_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE_TWITTER,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const isAuthed = Boolean(await getRefreshToken());
  const initialProfile = isAuthed ? await getServerProfile() : null;
  const messages = await getMessages();

  return (
    <>
      {/*
        Повернення з зовнішньої платіжки (кнопка «назад») інколи віддає сторінку,
        на якій React НЕ гідратується (кнопки мертві, банер «Продовжити оплату»
        не зʼявляється). Будь-який фікс усередині React не спрацює, бо клієнт «мертвий».
        Тому робимо це inline-скриптом, що виконується при парсингу HTML (до React):
        перед редіректом на оплату кошик ставить прапорець у sessionStorage — тут ми
        його бачимо й робимо ОДИН чистий reload (еквівалент ручного F5, який працює).
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var K='payment_return_reload';function cart(){return location.pathname.indexOf('/dashboard/cart')!==-1}function go(){try{if(cart()&&sessionStorage.getItem(K)==='1'){sessionStorage.removeItem(K);location.reload();return true}}catch(e){}return false}if(!go()){window.addEventListener('pageshow',function(e){try{if(e.persisted&&cart()&&sessionStorage.getItem(K)==='1'){sessionStorage.removeItem(K);location.reload()}}catch(err){}})}})();`,
        }}
      />
      <JsonLd id="org-schema" data={organizationSchema()} />
      <JsonLd id="website-schema" data={websiteSchema()} />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <DeferredManifest />
        <SiteChrome isAuthed={isAuthed} initialProfile={initialProfile}>
          {children}
        </SiteChrome>
        <CookieConsent />
      </NextIntlClientProvider>
      <Script
        src="https://static.minecraftsgame.com/script.js"
        strategy="lazyOnload"
      />
    </>
  );
}
