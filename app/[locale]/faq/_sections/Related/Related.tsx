import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import type { FaqRelatedItem } from '@/app/[locale]/faq/_data/faqRelatedItems';
import styles from './Related.module.css';

type RelatedProps = {
  items: FaqRelatedItem[];
  categoryLabel?: string;
};

export default async function Related({ items, categoryLabel = '' }: RelatedProps) {
  const t = await getTranslations('faq');

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.related}>
      <Container variant="faq">
        <div className={styles.inner}>
          <div className={styles.head}>
            <div className={styles.headText}>
              <span className={`${styles.badge} ${styles.mobileOnly}`}>{t('related.badgeMobile')}</span>
              <span className={`${styles.badge} ${styles.desktopOnly}`}>
                {t('related.badgeDesktop', { category: categoryLabel })}
              </span>
              <h2 className={`${styles.title} ${styles.mobileOnly}`}>{t('related.titleMobile')}</h2>
              <h2 className={`${styles.title} ${styles.desktopOnly}`}>{t('related.titleDesktop')}</h2>
            </div>

            <Link href="/faq" className={`${styles.allLink} ${styles.desktopOnly}`}>
              <span>{t('related.allFaq')}</span>
              <span className={styles.allLinkArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <ul className={styles.list}>
            {items.map(item => (
              <li key={item.slug}>
                <article className={styles.card}>
                  <span className={styles.category}>
                    {t(`categoryMeta.${item.categoryId}.listLabel` as Parameters<typeof t>[0])}
                  </span>
                  <h3 className={styles.question}>
                    {t(`articles.${item.slug}.question` as Parameters<typeof t>[0])}
                  </h3>
                  <p className={styles.excerpt}>
                    {t(`articles.${item.slug}.excerpt` as Parameters<typeof t>[0])}
                  </p>
                  <div className={styles.footer}>
                    <span className={styles.readTime}>
                      {t('article.minRead', { min: item.readMinutes })}
                    </span>
                    <Link href={item.href} className={styles.readLink}>
                      <span className={styles.mobileOnly}>
                        {t('related.readMobile')} <span aria-hidden="true">→</span>
                      </span>
                      <span className={styles.desktopOnly}>
                        {t('related.readDesktop')} <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
