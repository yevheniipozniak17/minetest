import { getBlogArticleList, getBlogCategories } from '@/lib/server/blog';
import { adaptCardArticle, buildCategoryMap } from '../_adapter';
import { BLOG_ARTICLES_PER_PAGE } from './articlesData';
import ArticlesClient from './ArticlesClient';
import styles from './Articles.module.css';

type ArticlesProps = {
  category?: string | null;
  page?: number;
  searchQuery?: string | null;
};

export default async function Articles({
  category,
  page = 1,
  searchQuery,
}: ArticlesProps) {
  const [{ results, pages, count }, categories] = await Promise.all([
    getBlogArticleList({
      page,
      page_size: BLOG_ARTICLES_PER_PAGE,
      category: category ?? undefined,
      search_query: searchQuery ?? undefined,
    }).catch(() => ({ results: [], pages: 0, count: 0, next: null, previous: null })),
    getBlogCategories().catch(() => []),
  ]);

  const categoryMap = buildCategoryMap(categories);
  const articles = results.map(item => adaptCardArticle(item, categoryMap));
  const totalPages = Math.max(1, pages ?? Math.ceil(count / BLOG_ARTICLES_PER_PAGE));

  return (
    <section className={styles.articles}>
      <ArticlesClient
        articles={articles}
        activePage={page}
        totalPages={totalPages}
        category={category}
        searchQuery={searchQuery}
      />
    </section>
  );
}
