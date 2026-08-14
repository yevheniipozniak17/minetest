import type { Metadata } from 'next';
import { Divider } from '@/app/_components/Divider/Divider';
import { getRefreshToken } from '@/lib/server/authCookies';
import { buildMetadata, localeFromParams } from '@/lib/seo/meta';
import { JsonLd } from '@/app/_components/JsonLd/JsonLd';
import { breadcrumbSchema, productSchema } from '@/lib/seo/schema';
import Category from './_sections/Category/Category';
import Currency from './_sections/Currency/Currency';
import Hero from './_sections/Hero/Hero';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: localeFromParams(locale),
    title: 'Store — Crystals & Privileges',
    description:
      'Top up crystals and upgrade your account with cosmetic privileges. Fair, no pay-to-win — only style and convenience.',
    path: '/store',
  });
}

export default async function StorePage() {
  const isAuthed = Boolean(await getRefreshToken());

  return (
    <>
      <JsonLd
        id="store-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Store', path: '/store' },
        ])}
      />
      <JsonLd
        id="store-product"
        data={productSchema({
          name: 'Crystals',
          description:
            'In-game currency to trade, buy upgrades, and progress across all Minecraft Game servers.',
          path: '/store',
        })}
      />
      <Hero />
      <Category isAuthed={isAuthed} />
      <Divider />
      <Currency />
    </>
  );
}
