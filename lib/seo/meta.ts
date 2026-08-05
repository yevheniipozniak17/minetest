import type { Metadata } from 'next';

export const SITE_URL = 'https://minecraftsgame.com';
export const SITE_NAME = 'Minecraft Game';
export const SITE_TWITTER = '@minecrafts_game';
export const DEFAULT_OG_IMAGE = '/og/og-default.png';

export const DEFAULT_TITLE = 'Minecraft Game — Three Next-Generation Servers';
export const DEFAULT_DESCRIPTION =
  'Three unique Minecraft servers, an in-game economy, rankings, and tournaments. Play survival, PvP, or peaceful building the way you like.';

type OgType = 'website' | 'article';

export type BuildMetadataInput = {
  title?: string;
  description?: string;
  /** Absolute path beginning with "/" used for the canonical URL. */
  path: string;
  /** Public path to a representative image (defaults to the shared OG banner). */
  image?: string;
  ogType?: OgType;
  noindex?: boolean;
  /** Extra OpenGraph article fields (publishedTime, authors, tags). */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
};

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Builds a consistent Metadata object (canonical + OpenGraph + Twitter) for a page.
 * Keep `path` in sync with the route so canonical URLs stay correct.
 */
export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
  article,
}: BuildMetadataInput): Metadata {
  const resolvedTitle = title ?? DEFAULT_TITLE;
  const canonical = path === '/' ? '/' : path;
  const imageUrl = absoluteUrl(image);

  return {
    title: title ?? { absolute: DEFAULT_TITLE },
    description,
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: ogType,
      siteName: SITE_NAME,
      locale: 'en_US',
      url: absoluteUrl(canonical),
      title: resolvedTitle,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: resolvedTitle }],
      ...(article ?? {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE_TWITTER,
      title: resolvedTitle,
      description,
      images: [imageUrl],
    },
  };
}
