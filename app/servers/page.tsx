import type { Metadata } from 'next';
import { getRefreshToken } from '@/lib/server/authCookies';
import { buildMetadata } from '@/lib/seo/meta';
import { JsonLd } from '@/app/_components/JsonLd/JsonLd';
import { breadcrumbSchema, itemListSchema } from '@/lib/seo/schema';
import { PROJECT_SERVERS } from '@/lib/data/servers';
import Hero from './_sections/Hero/Hero';
import MainServer from './_sections/MainServer/MainServer';

export const metadata: Metadata = buildMetadata({
  title: 'Servers',
  description:
    'Pick your world — LuckySurvival, MineWars, or CalmSky. Live status and latency for every Minecraft server.',
  path: '/servers',
});

export default async function ServersPage() {
  const isAuthed = Boolean(await getRefreshToken());

  return (
    <>
      <JsonLd
        id="servers-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Servers', path: '/servers' },
        ])}
      />
      <JsonLd
        id="servers-list"
        data={itemListSchema(
          'Minecraft servers',
          PROJECT_SERVERS.map(server => ({ name: server.name, url: '/servers' })),
        )}
      />
      <Hero />
      <MainServer isAuthed={isAuthed} />
    </>
  );
}
