import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/meta';
import { getAllFaqSlugs } from './faq/_data/faqArticles';

type Entry = MetadataRoute.Sitemap[number];

// Блог тимчасово вилучено з сайтмапа й закрито від індексації (noindex у
// метаданих сторінок) на час рев'ю контенту SEO-командою. Після апруву
// повертаємо /blog і додаємо /blog/[slug] через getBlogSlugs() з бекенду.
const staticRoutes: { path: string; priority: number; changeFrequency: Entry['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/servers', priority: 0.9, changeFrequency: 'daily' },
  { path: '/store', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/how-to-start', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/contacts', priority: 0.5, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(route => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const faqEntries: MetadataRoute.Sitemap = getAllFaqSlugs().map(slug => ({
    url: `${SITE_URL}/faq/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticEntries, ...faqEntries];
}
