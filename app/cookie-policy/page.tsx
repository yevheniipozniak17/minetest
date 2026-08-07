import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalPage } from '@/app/_components/LegalPage/LegalPage';
import type { LegalDocument } from '@/lib/data/legal';
import { buildMetadata } from '@/lib/seo/meta';

export const metadata: Metadata = buildMetadata({
  title: 'Cookie Policy',
  description:
    'What cookies minecraftsgame.com uses and how you can manage your cookie preferences.',
  path: '/cookie-policy',
  noindex: true,
});

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
