import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ArticleBody from '../_sections/ArticleBody/ArticleBody';
import ArticleCta from '../_sections/ArticleCta/ArticleCta';
import Hero from '../_sections/ArticleHero/Hero';
import Related from '../_sections/Related/Related';
import { getAllFaqSlugs, getFaqArticleBySlug } from '../_data/faqArticles';
import { getFaqRelatedItems } from '../_data/faqRelatedItems';
import { buildMetadata } from '@/lib/seo/meta';
import { localeFromParams } from '@/lib/seo/meta';
import { JsonLd } from '@/app/_components/JsonLd/JsonLd';
import { breadcrumbSchema, faqPageSchema } from '@/lib/seo/schema';

type FaqArticlePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return getAllFaqSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: FaqArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getFaqArticleBySlug(slug);

  if (!article) {
    return { title: 'FAQ article not found' };
  }

  return buildMetadata({ locale: localeFromParams(locale), title: article.question,
    description: article.excerpt,
    path: `/faq/${slug}`,
    ogType: 'article',
  });
}

export default async function FaqArticlePage({ params }: FaqArticlePageProps) {
  const { slug } = await params;
  const article = getFaqArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedItems = getFaqRelatedItems(slug);

  return (
    <main style={{ backgroundColor: '#001812' }}>
      <JsonLd
        id="faq-article-schema"
        data={faqPageSchema([
          { question: article.question, answer: article.quickAnswer },
        ])}
      />
      <JsonLd
        id="faq-article-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: '/faq' },
          { name: article.breadcrumbCategory, path: `/faq?category=${article.categoryId}` },
          { name: article.breadcrumbShort, path: `/faq/${slug}` },
        ])}
      />
      <Hero article={article} />
      <ArticleBody slug={slug} />
      <Related items={relatedItems} categoryLabel={article.categoryLabel} />
      <ArticleCta />
    </main>
  );
}
