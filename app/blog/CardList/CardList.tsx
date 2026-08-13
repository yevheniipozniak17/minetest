'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { buildPageNumbers } from '@/lib/pagination/buildPageNumbers';
import Card, { ArticleCardProps } from './Card/Card';
import styles from './CardList.module.css';

type CardListPagination = {
  activePage: number;
  totalPages: number;
  pageHref: (page: number) => string;
};

export default function CardList({
  articles,
  pagination,
  paginationLabel = 'Articles pagination',
}: {
  articles: ArticleCardProps[];
  pagination?: CardListPagination;
  paginationLabel?: string;
}) {
  const t = useTranslations('blog.pagination');
  const pageNumbers = pagination
    ? buildPageNumbers(pagination.totalPages, pagination.activePage)
    : [];

  return (
    <>
      <ul className={styles.list}>
        {articles.map(article => (
          <Card key={article.slug ?? article.title} {...article} />
        ))}
      </ul>

      {pagination ? (
        <nav className={styles.pagination} aria-label={paginationLabel}>
          <div className={styles.pagRow}>
            {pagination.activePage > 1 ? (
              <Link
                href={pagination.pageHref(pagination.activePage - 1)}
                className={styles.pagArrow}
                aria-label={t('prevAriaLabel')}
                rel="prev"
              >
                ←
              </Link>
            ) : (
              <span className={`${styles.pagArrow} ${styles.pagArrowDisabled}`} aria-hidden="true">
                ←
              </span>
            )}

            {pageNumbers.map((page, index) => {
              if (page === '…') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className={styles.pagEllipsis}
                    aria-hidden="true"
                  >
                    …
                  </span>
                );
              }

              const isActive = page === pagination.activePage;

              return (
                <Link
                  key={page}
                  href={pagination.pageHref(page)}
                  className={`${styles.pagNumber} ${isActive ? styles.pagNumberActive : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {page}
                </Link>
              );
            })}

            {pagination.activePage < pagination.totalPages ? (
              <Link
                href={pagination.pageHref(pagination.activePage + 1)}
                className={`${styles.pagArrow} ${styles.pagArrowNext}`}
                aria-label={t('nextAriaLabel')}
                rel="next"
              >
                →
              </Link>
            ) : (
              <span
                className={`${styles.pagArrow} ${styles.pagArrowNext} ${styles.pagArrowDisabled}`}
                aria-hidden="true"
              >
                →
              </span>
            )}
          </div>
        </nav>
      ) : null}
    </>
  );
}
