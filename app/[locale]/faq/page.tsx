import type { Metadata } from 'next';
import Hero from './_sections/Hero/Hero';
import FaqBody from './_sections/FaqBody/FaqBody';
import { FaqPageProvider } from './_sections/FaqPageContext';
import Support from './_sections/Support/Support';
import Suggest from './_sections/Suggest/Suggest';
import { buildMetadata, localeFromParams } from '@/lib/seo/meta';
import { JsonLd } from '@/app/_components/JsonLd/JsonLd';
import { breadcrumbSchema, faqPageSchema } from '@/lib/seo/schema';
import { FAQ_ARTICLES } from './_data/faqArticles';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: localeFromParams(locale),
    title: 'FAQ — Help Center',
    description:
      'Answers about joining, accounts, payments, servers, privileges, gameplay, and rules. Find help fast in our Minecraft knowledge base.',
    path: '/faq',
  });
}

export default function FAQ() {
  return (
    <FaqPageProvider>
      <main style={{ backgroundColor: '#001812' }}>
        <JsonLd
          id="faq-breadcrumb"
          data={breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'FAQ', path: '/faq' },
          ])}
        />
        <JsonLd
          id="faq-schema"
          data={faqPageSchema(
            FAQ_ARTICLES.slice(0, 12).map(article => ({
              question: article.question,
              answer: article.quickAnswer,
            })),
          )}
        />
        <Hero />
        <FaqBody />
        <Support />
        <Suggest />
      </main>
    </FaqPageProvider>
  );
}
