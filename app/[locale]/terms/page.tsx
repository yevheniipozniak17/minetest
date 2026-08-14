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
    title: 'Terms and Conditions',
    description:
      'The terms that govern your use of the minecraftsgame.com website, game servers, and digital purchases.',
    path: '/terms',
    noindex: true,
  });
}

export default async function TermsPage() {
  const t = await getTranslations('legal');

  const document: LegalDocument = {
    badge: t('terms.badge'),
    title: t('terms.title'),
    lastUpdated: t('terms.lastUpdated'),
    intro: t.raw('terms.intro') as LegalDocument['intro'],
    sections: t.raw('terms.sections') as LegalDocument['sections'],
  };

  return <LegalPage document={document} />;
}
