import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import styles from './Hero.module.css';
import { Badge } from '@/app/_components/Badge/Badge';
import HeroTags from './HeroTags';

export default async function Hero() {
  const t = await getTranslations('blog');

  return (
    <section className={styles.hero}>
      <Container variant="blog" className={styles.content}>
        <div className={styles.head}>
          <Badge className={styles.badge}>{t('hero.badge')}</Badge>
          <h1 className={styles.title}>{t('hero.title')}</h1>
          <p className={styles.description}>{t('hero.description')}</p>
        </div>

        <form className={styles.search} action="/blog" method="GET" role="search">
          <span className={styles.searchIcon} aria-hidden="true">
            ⌕
          </span>
          <input
            className={styles.input}
            type="search"
            name="search_query"
            placeholder={t('hero.searchPlaceholder')}
          />
          <button type="submit" className={styles.searchButton}>
            {t('hero.searchButton')}
          </button>
        </form>

        <Suspense fallback={null}>
          <HeroTags />
        </Suspense>
      </Container>
    </section>
  );
}
