import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import styles from './Support.module.css';

export default async function Support() {
  const t = await getTranslations('faq');

  return (
    <section id="contacts" className={styles.support}>
      <Container variant="faq">
        <div className={styles.content}>
          <div className={styles.card}>
            <h2 className={styles.title}>{t('support.title')}</h2>
            <p className={styles.description}>{t('support.desc')}</p>
            <Link href="/contacts" className={styles.primaryButton}>
              {t('cta.contactUs')}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
