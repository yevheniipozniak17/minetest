import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/i18n/config';

/** Локалізований шлях без домену: EN на корені, інші з префіксом /de/… */
export function localizedPath(path: string, locale: Locale): string {
  const normalized = path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return normalized;
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}

/** hreflang alternates для маркетингових сторінок (блог — окремий випадок). */
export function hreflangAlternates(path: string): Record<string, string> {
  const languages = Object.fromEntries(
    LOCALES.map(locale => [locale, localizedPath(path, locale)]),
  ) as Record<string, string>;

  languages['x-default'] = localizedPath(path, DEFAULT_LOCALE);
  return languages;
}
