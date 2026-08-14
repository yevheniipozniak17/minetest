import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Hero } from './_sections/Hero/Hero';
import Server from './_sections/Server/Server';
import { HOME_FAQ } from './_sections/Questions/Questions';
import { getRefreshToken } from '@/lib/server/authCookies';
import { buildMetadata, localeFromParams } from '@/lib/seo/meta';
import { JsonLd } from '@/app/_components/JsonLd/JsonLd';
import { faqPageSchema, itemListSchema, videoGameSchema } from '@/lib/seo/schema';
import { PROJECT_SERVERS } from '@/lib/data/servers';

const HomeBelowFold = dynamic(() => import('./HomeBelowFold'));

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({ locale: localeFromParams(locale), path: '/' });
}

export default async function Home() {
  const isAuthed = Boolean(await getRefreshToken());
  return (
    <>
      <JsonLd id="home-videogame" data={videoGameSchema()} />
      <JsonLd
        id="home-servers"
        data={itemListSchema(
          'Minecraft servers',
          PROJECT_SERVERS.map(server => ({ name: server.name, url: '/servers' }))
        )}
      />
      <JsonLd
        id="home-faq"
        data={faqPageSchema(
          HOME_FAQ.map(item => ({ question: item.question, answer: item.answer }))
        )}
      />
      <Hero isAuthed={isAuthed} />
      <Server />
      <HomeBelowFold isAuthed={isAuthed} />
    </>
  );
}
