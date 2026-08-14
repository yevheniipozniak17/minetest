import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import styles from './not-found.module.css';

export default async function NotFound() {
  const t = await getTranslations('system');

  return (
    <div className={styles.section}>
      <Container variant="faq">
        <div className={styles.content}>
          <span className={styles.badgeMobile}>
            <span></span>{t('notFound_badgeMobile')}
          </span>

          <span className={styles.badgeDesktop}>
            <span></span>{t('notFound_badgeDesktop')}
          </span>
          <h1 className={styles.title}>{t('notFound_title')}</h1>
          <p className={styles.textMobile}>{t('notFound_textMobile')}</p>
          <p className={styles.textDesktop}>{t('notFound_textDesktop')}</p>
          <Link href="/" className={styles.backLink}>
            <span>←</span>{t('notFound_goBack')}
          </Link>
        </div>
      </Container>
    </div>
  );
}
