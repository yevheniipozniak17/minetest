import type { Metadata } from 'next';
import Hero from './_sections/Hero/Hero';
import { getRefreshToken } from '@/lib/server/authCookies';
import { buildMetadata, localeFromParams } from '@/lib/seo/meta';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: localeFromParams(locale),
    title: 'How to Start Playing',
    description:
      'New here? Create an account, pick a server, copy the IP, and connect in Minecraft. A step-by-step guide for Java and Bedrock players.',
    path: '/how-to-start',
  });
}

export default async function HowToStartPage() {
  const isAuthed = Boolean(await getRefreshToken());

  return <Hero isAuthed={isAuthed} />;
}
