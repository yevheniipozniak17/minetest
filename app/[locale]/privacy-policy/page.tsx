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
    title: 'Privacy Policy',
    description:
      'How Dexervil LTD collects, uses, and protects your personal data on minecraftsgame.com.',
    path: '/privacy-policy',
    noindex: true,
  });
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('legal');

  const document: LegalDocument = {
    badge: t('privacy.badge'),
    title: t('privacy.title'),
    lastUpdated: t('privacy.lastUpdated'),
    intro: t.raw('privacy.intro') as LegalDocument['intro'],
    sections: t.raw('privacy.sections') as LegalDocument['sections'],
  };

  return <LegalPage document={document} />;
}
