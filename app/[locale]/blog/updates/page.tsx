import type { Metadata } from 'next';
import Articles from './Articles/Articles';
import Hero from './Hero/Hero';
import Related from './Related/Releted';
import { redirect } from '@/i18n/navigation';
import { DEFAULT_LOCALE } from '@/lib/i18n/config';
import { buildMetadata, localeFromParams } from '@/lib/seo/meta';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== DEFAULT_LOCALE) redirect({ href: '/blog', locale: DEFAULT_LOCALE });
  return buildMetadata({
    locale: localeFromParams(locale),
    title: 'Server Updates & Patch Notes',
    description:
      'Latest patch notes, seasonal events, and feature releases across LuckySurvival, MineWars, and CalmSky.',
    path: '/blog/updates',
    // Демо-стаття зі статичним текстом, лишилась від старого дизайну. Решта
    // блогу під noindex до апруву SEO — ця сторінка була єдиною відкритою.
    noindex: true,
  });
}

export default async function Updates({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== DEFAULT_LOCALE) redirect({ href: '/blog', locale: DEFAULT_LOCALE });

  return (
    <>
      <Hero />
      <Articles />
      <Related />
    </>
  );
}
