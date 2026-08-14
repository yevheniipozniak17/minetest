import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import Card from '@/app/blog/CardList/Card/Card';
import { adaptCardArticle, buildCategoryMap } from '@/app/blog/_adapter';
import { getBlogArticleList, getBlogCategories } from '@/lib/server/blog';
import styles from './Releted.module.css';

export default async function Related() {
  const t = await getTranslations('blog');

  const [listResponse, categories] = await Promise.all([
    getBlogArticleList({ page_size: 3 }).catch(() => ({
      results: [],
      count: 0,
      next: null,
      previous: null,
    })),
    getBlogCategories().catch(() => []),
  ]);

  const categoryMap = buildCategoryMap(categories);
  const related = listResponse.results.map(item => adaptCardArticle(item, categoryMap));

  if (related.length === 0) return null;

  return (
    <section className={styles.related}>
      <Container variant="blog">
        <div className={styles.inner}>
          <div className={styles.head}>
            <div className={styles.headLeft}>
              <span className={styles.badge}>{t('related.badge')}</span>
              <h2 className={styles.title}>{t('related.title')}</h2>
            </div>

            <Link href="/blog" className={`${styles.button} ${styles.buttonDesktop}`}>
              {t('related.allArticles')}
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <ul className={`${styles.list} ${styles.listMobile}`}>
            {related.map(article => (
              <Card key={article.slug} {...article} />
            ))}
          </ul>

          <ul className={`${styles.list} ${styles.listDesktop}`}>
            {related.map(article => (
              <Card key={article.slug} {...article} />
            ))}
          </ul>

          <Link href="/blog" className={`${styles.button} ${styles.buttonMobile}`}>
            {t('related.allArticles')}
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
