import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/i18n/config';
import { hreflangAlternates } from '@/lib/i18n/paths';
import { absoluteUrl, SITE_URL } from '@/lib/seo/meta';
import { getAllFaqSlugs } from './[locale]/faq/_data/faqArticles';

type Entry = MetadataRoute.Sitemap[number];

// Блог тимчасово вилучено з сайтмапа й закрито від індексації (noindex у
// метаданих сторінок) на час рев'ю контенту SEO-командою. Після апруву
// повертаємо /blog і додаємо /blog/[slug] через getBlogSlugs() з бекенду —
// слаги однакові для всіх мов, тож список тягнеться один раз і розгортається
// по локалях через entriesForPath.
const staticRoutes: { path: string; priority: number; changeFrequency: Entry['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/servers', priority: 0.9, changeFrequency: 'daily' },
  { path: '/store', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/how-to-start', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/contacts', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/delivery-policy', priority: 0.3, changeFrequency: 'yearly' },
];

function localizedAlternates(path: string): NonNullable<Entry['alternates']>['languages'] {
  return Object.fromEntries(
    Object.entries(hreflangAlternates(path)).map(([lang, hrefPath]) => [
      lang,
      absoluteUrl(hrefPath),
    ]),
  );
}

function entriesForPath(
  path: string,
  priority: number,
  changeFrequency: Entry['changeFrequency'],
  now: Date,
): MetadataRoute.Sitemap {
  return LOCALES.map(locale => {
    const localized =
      locale === 'en'
        ? path
        : path === '/'
          ? `/${locale}`
          : `/${locale}${path}`;

    return {
      url: `${SITE_URL}${localized}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: localizedAlternates(path),
      },
    };
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = staticRoutes.flatMap(route =>
    entriesForPath(route.path, route.priority, route.changeFrequency, now),
  );

  const faqEntries = getAllFaqSlugs().flatMap(slug =>
    entriesForPath(`/faq/${slug}`, 0.5, 'monthly', now),
  );

  return [...staticEntries, ...faqEntries];
}
