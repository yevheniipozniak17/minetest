import { getRequestConfig } from 'next-intl/server';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';

// Простори імен повідомлень. Кожен — окремий файл messages/{locale}/{namespace}.json.
// Розбиття на файли дозволяє редагувати області незалежно одна від одної.
const NAMESPACES = [
  'common',
  'auth',
  'home',
  'store',
  'servers',
  'serversData',
  'dashboard',
  'cart',
  'settings',
  'account',
  'faq',
  'legal',
  'blog',
  'marketing',
  'system',
] as const;

async function loadNamespace(locale: string, namespace: string): Promise<Record<string, unknown>> {
  try {
    return (await import(`../messages/${locale}/${namespace}.json`)).default;
  } catch {
    // Файл ще не створено або відсутній для цієї локалі — повертаємо порожній об'єкт,
    // щоб застосунок не падав, а ключі відображались як fallback.
    return {};
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;

  const entries = await Promise.all(
    NAMESPACES.map(async namespace => [namespace, await loadNamespace(locale, namespace)] as const),
  );

  return {
    locale,
    messages: Object.fromEntries(entries),
  };
});
