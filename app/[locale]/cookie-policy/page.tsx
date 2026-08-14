import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalPage } from '@/app/_components/LegalPage/LegalPage';
import type { LegalDocument } from '@/lib/data/legal';
import { buildMetadata, localeFromParams } from '@/lib/seo/meta';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: localeFromParams(locale),
    title: 'Cookie Policy',
    description:
      'What cookies minecraftsgame.com uses and how you can manage your cookie preferences.',
    path: '/cookie-policy',
    noindex: true,
  });
}

export default async function CookiePolicyPage() {
  const t = await getTranslations('legal');

  const document: LegalDocument = {
    badge: t('cookies.badge'),
    title: t('cookies.title'),
    lastUpdated: t('cookies.lastUpdated'),
    intro: t.raw('cookies.intro') as LegalDocument['intro'],
    sections: t.raw('cookies.sections') as LegalDocument['sections'],
  };

  return <LegalPage document={document} />;
}
