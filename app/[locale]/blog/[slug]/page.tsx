import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { localizedPath } from '@/lib/i18n/paths';
import { getBlogArticle, getBlogArticleList, getBlogCategories } from '@/lib/server/blog';
import { toBlogLang } from '@/lib/server/blogBackend';
import { sanitizeArticleHtml } from '@/lib/server/sanitizeArticleHtml';
import { adaptCardArticle, adaptFullArticle, blogImagePath, buildCategoryMap } from '../_adapter';
import ArticlePage from '../_article/ArticlePage';
import { buildMetadata, localeFromParams } from '@/lib/seo/meta';
import { JsonLd } from '@/app/_components/JsonLd/JsonLd';
import { articleSchema, breadcrumbSchema, toIsoDate } from '@/lib/seo/schema';

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Сторінка рендериться на кожен запит. Тіло статті кешується через
// revalidate на fetch-у до бекенду, тож бекенду це не додає навантаження.
// generateStaticParams не використовуємо свідомо: статей ~1300 на кожну з
// 6 мов, пререндер усього цього роздув би білд у рази без виграшу.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getBlogArticle(slug, toBlogLang(locale)).catch(() => null);

  if (!article) {
    return { title: 'Article not found', robots: { index: false, follow: false } };
  }

  return buildMetadata({ locale: localeFromParams(locale), title: article.meta_title || article.title,
    description: article.meta_description || article.short_description,
    path: `/blog/${slug}`,
    image: blogImagePath(slug),
    ogType: 'article',
    noindex: true,
    article: {
      publishedTime: toIsoDate(article.publish_date),
    },
  });
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const lang = toBlogLang(locale);

  const [article, categories] = await Promise.all([
    getBlogArticle(slug, lang).catch(() => null),
    getBlogCategories(lang).catch(() => []),
  ]);

  if (!article) {
    notFound();
  }

  const categoryMap = buildCategoryMap(categories);
  const post = adaptFullArticle(article, categoryMap, lang);
  const sanitizedHtml = sanitizeArticleHtml(post.htmlWithAnchors);

  // Спочатку тягнемо статті з тієї ж категорії. Якщо їх немає (або тільки
  // поточна), падбекап — свіжі статті будь-якої категорії, щоб секція
  // "Keep reading" не була пуста.
  const sameCategoryResponse = await getBlogArticleList(
    {
      category: article.category_slug,
      page_size: 6,
    },
    lang
  ).catch(() => ({ results: [], count: 0, next: null, previous: null }));

  let relatedRaw = sameCategoryResponse.results.filter(item => item.slug !== slug);

  if (relatedRaw.length < 3) {
    const fallback = await getBlogArticleList({ page_size: 6 }, lang).catch(() => ({
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
    .map(item => adaptCardArticle(item, categoryMap, lang));

  return (
    <main style={{ backgroundColor: '#001812' }}>
      <JsonLd
        id="article-schema"
        data={articleSchema({
          title: post.title,
          description: article.meta_description || article.short_description,
          path: localizedPath(`/blog/${slug}`, lang),
          image: post.image,
          datePublished: toIsoDate(article.publish_date),
        })}
      />
      <JsonLd
        id="article-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Home', path: localizedPath('/', lang) },
          { name: 'Blog', path: localizedPath('/blog', lang) },
          {
            name: post.categoryLabel,
            path: `${localizedPath('/blog', lang)}?category=${article.category_slug}`,
          },
          { name: post.title, path: localizedPath(`/blog/${slug}`, lang) },
        ])}
      />
      <ArticlePage post={post} sanitizedHtml={sanitizedHtml} relatedArticles={relatedArticles} />
    </main>
  );
}
