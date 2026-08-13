import type { Metadata } from 'next';
import Articles from './Articles/Articles';
import Hero from './Hero/Hero';
import Related from './Related/Releted';
import { buildMetadata } from '@/lib/seo/meta';

export const metadata: Metadata = buildMetadata({
  title: 'Server Updates & Patch Notes',
  description:
    'Latest patch notes, seasonal events, and feature releases across LuckySurvival, MineWars, and CalmSky.',
  path: '/blog/updates',
  // Демо-стаття зі статичним текстом, лишилась від старого дизайну. Решта
  // блогу під noindex до апруву SEO — ця сторінка була єдиною відкритою.
  noindex: true,
});

export default function Updates() {
  return (
    <>
      <Hero />
      <Articles />
      <Related />
    </>
  );
}
