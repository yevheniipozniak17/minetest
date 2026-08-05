import type { Metadata } from 'next';
import AboutActivities from './_sections/AboutActivities/AboutActivities';
import AboutEconomy from './_sections/AboutEconomy/AboutEconomy';
import AboutMission from './_sections/AboutMission/AboutMission';
import AboutServers from './_sections/AboutServers/AboutServers';
import { getRefreshToken } from '@/lib/server/authCookies';
import { buildMetadata } from '@/lib/seo/meta';
import { JsonLd } from '@/app/_components/JsonLd/JsonLd';
import { breadcrumbSchema } from '@/lib/seo/schema';

import Hero from './_sections/Hero/Hero';

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description:
    'Learn about our Minecraft project — three servers, a fair no pay-to-win economy, rankings, tournaments, and an active community.',
  path: '/about',
});

const About = async () => {
  const isAuthed = Boolean(await getRefreshToken());

  return (
    <div style={{ backgroundColor: '#001812' }}>
      <JsonLd
        id="about-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />
      <Hero isAuthed={isAuthed} />
      <AboutServers />
      <AboutEconomy />
      <AboutActivities />
      <AboutMission />
    </div>
  );
};

export default About;
