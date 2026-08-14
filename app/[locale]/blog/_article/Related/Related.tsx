import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import Card, { type ArticleCardProps } from '@/app/[locale]/blog/CardList/Card/Card';
import styles from './Related.module.css';

type RelatedProps = {
  articles: ArticleCardProps[];
  desktopArticles?: ArticleCardProps[];
};

export default async function Related({ articles, desktopArticles }: RelatedProps) {
  const t = await getTranslations('blog');
  const desktopList = desktopArticles ?? articles;

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
              {t('articleCta')}
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <ul className={`${styles.list} ${styles.listMobile}`}>
            {articles.map(article => (
              <Card key={article.title} {...article} />
            ))}
          </ul>

          <ul className={`${styles.list} ${styles.listDesktop}`}>
            {desktopList.map(article => (
              <Card key={article.title} {...article} />
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
