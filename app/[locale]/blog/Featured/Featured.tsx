import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import styles from './Featured.module.css';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
export default async function Featured() {
  const t = await getTranslations('blog');

  return (
    <section className={styles.featured}>
      <Container variant="blog">
        <div className={styles.main_wrapper}>
          <div className={styles.image_wrapper}>
            <Image
              className={styles.image}
              src="/blog/blog-featured.webp"
              alt={t('featured.tagFeatured')}
              width={1440}
              height={836}
              sizes="(min-width: 1280px) 720px, 335px"
            />
          </div>
          <div className={styles.wrapper}>
            <ul className={styles.tags}>
              <li>
                <p className={styles.tag}>{t('featured.tagFeatured')}</p>
              </li>
              <li>
                <p className={styles.tag}>{t('featured.tagUpdates')}</p>
              </li>
            </ul>

            <h2 className={styles.title}>{t('featured.title')}</h2>

            <p className={styles.description}>{t('featured.description')}</p>

            <div className={styles.meta}>
              <span className={styles.date}>{t('featured.date')}</span>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.readTime}>{t('featured.readTime')}</span>
            </div>

            <ul className={styles.button_list}>
              <li>
                <Link
                  href="/blog/updates"
                  aria-label={t('featured.readArticleAriaLabel')}
                  className={styles.first_button}
                >
                  {t('featured.readArticle')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
