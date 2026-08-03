import { absoluteUrl, SITE_NAME, SITE_URL } from './meta';
import { TWITCH_URL } from '@/lib/data/social';

type Faq = { question: string; answer: string };

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** Organization node — referenced by other schemas via @id. */
export function organizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/favicon/android-chrome-512x512.png'),
    sameAs: [TWITCH_URL],
  };
}

/** WebSite node with a SearchAction so Google can show a sitelinks search box. */
export function websiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/faq?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** VideoGame node describing the Minecraft ecosystem as a whole. */
export function videoGameSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: SITE_NAME,
    url: SITE_URL,
    image: absoluteUrl('/og/og-default.png'),
    description:
      'A modern Minecraft ecosystem with three servers — LuckySurvival, MineWars, and CalmSky — featuring a fair economy, rankings, and tournaments.',
    publisher: { '@id': ORG_ID },
    gamePlatform: ['PC', 'Java Edition', 'Bedrock Edition'],
    applicationCategory: 'Game',
    genre: ['Survival', 'PvP', 'Sandbox'],
    playMode: 'MultiPlayer',
  };
}

export function faqPageSchema(items: Faq[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  image: string;
  datePublished?: string;
  author?: string;
  tags?: readonly string[];
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    image: absoluteUrl(input.image),
    url: absoluteUrl(input.path),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(input.path) },
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    author: input.author
      ? { '@type': 'Person', name: input.author }
      : { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@id': ORG_ID },
    ...(input.tags && input.tags.length ? { keywords: input.tags.join(', ') } : {}),
  };
}

/** Generic ordered ItemList (servers, articles, etc.). */
export function itemListSchema(
  name: string,
  items: { name: string; url?: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { url: absoluteUrl(item.url) } : {}),
    })),
  };
}

export function productSchema(input: {
  name: string;
  description: string;
  image?: string;
  path: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    url: absoluteUrl(input.path),
    brand: { '@type': 'Brand', name: SITE_NAME },
  };
}

/** Converts free-form dates like "Apr 22, 2026" to an ISO date string. */
export function toIsoDate(value: string | Date): string | undefined {
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}
