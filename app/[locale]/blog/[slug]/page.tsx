import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { redirect } from '@/i18n/navigation';
import { DEFAULT_LOCALE } from '@/lib/i18n/config';
import { getBlogArticle, getBlogArticleList, getBlogCategories } from '@/lib/server/blog';
import { sanitizeArticleHtml } from '@/lib/server/sanitizeArticleHtml';
import { adaptCardArticle, adaptFullArticle, buildCategoryMap } from '../_adapter';
import ArticlePage from '../_article/ArticlePage';
import { buildMetadata, localeFromParams } from '@/lib/seo/meta';
import { JsonLd } from '@/app/_components/JsonLd/JsonLd';
import { articleSchema, breadcrumbSchema, toIsoDate } from '@/lib/seo/schema';

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Сторінка рендериться на кожен запит. Тіло статті кешується через
// revalidate на fetch-у до бекенду, тож бекенду це не додає навантаження.
// generateStaticParams не використовуємо: next-intl.getTranslations читає
// cookie (dynamic API), а це несумісне зі static generation.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== DEFAULT_LOCALE) redirect({ href: '/blog', locale: DEFAULT_LOCALE });
  const article = await getBlogArticle(slug).catch(() => null);

  if (!article) {
    return { title: 'Article not found', robots: { index: false, follow: false } };
  }

  return buildMetadata({ locale: localeFromParams(locale), title: article.meta_title || article.title,
    description: article.meta_description || article.short_description,
    path: `/blog/${slug}`,
    image: `/api/blog/image/${slug}`,
    ogType: 'article',
    noindex: true,
    article: {
      publishedTime: toIsoDate(article.publish_date),
    },
  });
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (locale !== DEFAULT_LOCALE) redirect({ href: '/blog', locale: DEFAULT_LOCALE });

  const [article, categories] = await Promise.all([
    getBlogArticle(slug).catch(() => null),
    getBlogCategories().catch(() => []),
  ]);

  if (!article) {
    notFound();
  }

  const categoryMap = buildCategoryMap(categories);
  const post = adaptFullArticle(article, categoryMap);
  const sanitizedHtml = sanitizeArticleHtml(post.htmlWithAnchors);

  // Спочатку тягнемо статті з тієї ж категорії. Якщо їх немає (або тільки
  // поточна), падбекап — свіжі статті будь-якої категорії, щоб секція
  // "Keep reading" не була пуста.
  const sameCategoryResponse = await getBlogArticleList({
    category: article.category_slug,
    page_size: 6,
  }).catch(() => ({ results: [], count: 0, next: null, previous: null }));

  let relatedRaw = sameCategoryResponse.results.filter(item => item.slug !== slug);

  if (relatedRaw.length < 3) {
    const fallback = await getBlogArticleList({ page_size: 6 }).catch(() => ({
      results: [],
      count: 0,
      next: null,
      previous: null,
    }));
    const seen = new Set([slug, ...relatedRaw.map(item => item.slug)]);
    const extra = fallback.results.filter(item => !seen.has(item.slug));
    relatedRaw = [...relatedRaw, ...extra];
  }

  const relatedArticles = relatedRaw
    .slice(0, 3)
    .map(item => adaptCardArticle(item, categoryMap));

  return (
    <main style={{ backgroundColor: '#001812' }}>
      <JsonLd
        id="article-schema"
        data={articleSchema({
          title: post.title,
          description: article.meta_description || article.short_description,
          path: `/blog/${slug}`,
          image: post.image,
          datePublished: toIsoDate(article.publish_date),
        })}
      />
      <JsonLd
        id="article-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.categoryLabel, path: `/blog?category=${article.category_slug}` },
          { name: post.title, path: `/blog/${slug}` },
        ])}
      />
      <ArticlePage post={post} sanitizedHtml={sanitizedHtml} relatedArticles={relatedArticles} />
    </main>
  );
}
