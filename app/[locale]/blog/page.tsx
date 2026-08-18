import type { Metadata } from 'next';
import Articles from './Articles/Articles';
import Featured from './Featured/Featured';
import Hero from './Hero/Hero';
import { localizedPath } from '@/lib/i18n/paths';
import { buildMetadata, localeFromParams } from '@/lib/seo/meta';
import { JsonLd } from '@/app/_components/JsonLd/JsonLd';
import { breadcrumbSchema } from '@/lib/seo/schema';
import { getBlogArticleList } from '@/lib/server/blog';
import { toBlogLang } from '@/lib/server/blogBackend';
import { itemListSchema } from '@/lib/seo/schema';
import { parseCategoryParam } from './categories';
import { BLOG_ARTICLES_PER_PAGE } from './Articles/articlesData';

type LocalePageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: localeFromParams(locale),
    title: 'Blog — Guides, PvP & Updates',
    description:
      'Survival guides, PvP loadouts, redstone tutorials, player spotlights, and server updates from the Minecraft Game team.',
    path: '/blog',
    noindex: true,
  });
}

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    page?: string;
    search_query?: string;
  }>;
};

export default async function BlogPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const lang = toBlogLang(locale);

  const query = await searchParams;
  const category = parseCategoryParam(query.category);
  const searchQuery = query.search_query?.trim() || null;
  const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);

  const list = await getBlogArticleList(
    {
      page,
      page_size: BLOG_ARTICLES_PER_PAGE,
      category: category ?? undefined,
      search_query: searchQuery ?? undefined,
    },
    lang
  ).catch(() => ({ results: [], count: 0, next: null, previous: null, pages: 0 }));

  return (
    <main style={{ backgroundColor: '#001812' }}>
      <JsonLd
        id="blog-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Home', path: localizedPath('/', lang) },
          { name: 'Blog', path: localizedPath('/blog', lang) },
        ])}
      />
      <JsonLd
        id="blog-list"
        data={itemListSchema(
          'Minecraft Game blog articles',
          list.results.map(article => ({
            name: article.title,
            url: localizedPath(`/blog/${article.slug}`, lang),
          }))
        )}
      />
      <Hero />
      <Featured />
      <Articles category={category} page={page} searchQuery={searchQuery} />
    </main>
  );
}
