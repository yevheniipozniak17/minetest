'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/app/_components/Container/Container';
import CardList from '../CardList/CardList';
import { buildBlogListHref } from '../categories';
import type { BlogArticle } from './articlesData';
import styles from './Articles.module.css';

type ArticlesClientProps = {
  articles: BlogArticle[];
  activePage: number;
  totalPages: number;
  category?: string | null;
  searchQuery?: string | null;
};

export default function ArticlesClient({
  articles,
  activePage,
  totalPages,
  category,
  searchQuery,
}: ArticlesClientProps) {
  const t = useTranslations('blog');

  const sectionTitle = category
    ? t('articles.categoryTitle', {
        category:
          articles[0]?.categoryLabel ??
          category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
      })
    : t('articles.latestTitle');

  const pageHref = (page: number) =>
    buildBlogListHref({
      page,
      category: category ?? undefined,
      searchQuery: searchQuery ?? undefined,
    });

  return (
    <Container variant="blog">
      <div className={styles.article_wrapper}>
        <h2 className={styles.title}>{sectionTitle}</h2>
      </div>

      <CardList
        articles={articles}
        pagination={
          totalPages > 1
            ? {
                activePage,
                totalPages,
                pageHref,
              }
            : undefined
        }
        paginationLabel={t('sidebar.paginationLabel')}
      />
    </Container>
  );
}
