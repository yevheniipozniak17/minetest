import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import styles from './ArticleCta.module.css';

export default async function ArticleCta() {
  const t = await getTranslations('faq');

  return (
    <section className={styles.cta}>
      <Container variant="faq">
        <div className={styles.inner}>
          <div className={styles.card}>
            <div className={styles.content}>
              <h2 className={styles.title}>{t('cta.title')}</h2>

              <p className={`${styles.description} ${styles.mobileOnly}`}>{t('cta.descMobile')}</p>
              <p className={`${styles.description} ${styles.desktopOnly}`}>
                {t('cta.descDesktop')}
              </p>
            </div>

            <div className={styles.action}>
              <Link href="/contacts" className={styles.button}>
                {t('cta.contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
