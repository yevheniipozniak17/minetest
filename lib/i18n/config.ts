// Єдине джерело правди для локалей застосунку.
// Збігається з мовами контенту бекенду (/core/{language_code}/...).
export const LOCALES = ['en', 'de', 'fr', 'es', 'it', 'pl'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

// Cookie, який next-intl middleware використовує для locale detection при першому візиті.
export const LOCALE_COOKIE = 'NEXT_LOCALE';

// Підписи мов рідною мовою — для перемикача.
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pl: 'Polski',
};

// Короткі підписи для компактної кнопки перемикача.
export const LOCALE_SHORT: Record<Locale, string> = {
  en: 'EN',
  de: 'DE',
  fr: 'FR',
  es: 'ES',
  it: 'IT',
  pl: 'PL',
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
