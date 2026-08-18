// Blog API (deprod.top) — окремий сервер від нашого основного бекенду.
// Basic auth, ходимо тільки з сервера (RSC / route handlers). Токен ніколи
// не виїжджає в браузер.

import { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from '@/lib/i18n/config';

export const BLOG_API_URL = process.env.BLOG_API_URL ?? 'https://deprod.top/api/v1';

// Basic auth заголовок збираємо один раз на процес.
export const BLOG_AUTH_HEADER = (() => {
  const user = process.env.BLOG_API_USER;
  const pass = process.env.BLOG_API_PASSWORD;
  if (!user || !pass) return null;
  const encoded = Buffer.from(`${user}:${pass}`).toString('base64');
  return `Basic ${encoded}`;
})();

// Бекенд віддає контент блогу всіма мовами застосунку під тими самими slug'ами:
// /blog/{lang}/article/{slug}/ — slug спільний, перекладаються лише тексти.
export const BLOG_LANGS = LOCALES;
export type BlogLang = Locale;
export const DEFAULT_BLOG_LANG: BlogLang = DEFAULT_LOCALE;

// Нормалізує довільний locale із URL до мови блогу. Невідоме падає на en,
// щоб жоден запит до бекенду не пішов з битим сегментом.
export function toBlogLang(locale: string | undefined | null): BlogLang {
  return isLocale(locale) ? locale : DEFAULT_BLOG_LANG;
}
