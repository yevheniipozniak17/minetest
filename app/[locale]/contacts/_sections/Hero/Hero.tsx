import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import { Badge } from '@/app/_components/Badge/Badge';
import { Breadcrumbs } from '@/app/_components/Breadcrumbs/Breadcrumbs';
import { CONTACT_STATS, SUPPORT_EMAIL } from '@/lib/data/contacts';
import { TWITTER_URL } from '@/lib/data/social';
import styles from './Hero.module.css';

const BREADCRUMB_LINKS = ['/', '/faq'];

export default async function Hero() {
  const t = await getTranslations('marketing');

  const breadcrumbItems = [
    t('contacts.hero.breadcrumbHome'),
    t('contacts.hero.breadcrumbFaq'),
    t('contacts.hero.breadcrumbContacts'),
  ];

  return (
    <section className={styles.hero}>
      <div className={styles.overlay} aria-hidden="true" />

      <Container variant="faq" className={styles.content}>
        <Breadcrumbs items={breadcrumbItems} links={BREADCRUMB_LINKS} />

        <div className={styles.head}>
          <Badge className={styles.badge}>{t('contacts.hero.badge')}</Badge>
          <h1 className={styles.title}>{t('contacts.hero.title')}</h1>
          <p className={`${styles.description} ${styles.descriptionMobile}`}>
            {t('contacts.hero.descriptionMobile')}
          </p>
          <p className={`${styles.description} ${styles.descriptionDesktop}`}>
            {t('contacts.hero.descriptionDesktop')}
          </p>
        </div>

        <div className={styles.stats}>
          {CONTACT_STATS.map(stat => (
            <div key={stat.id} className={styles.stat}>
              <span className={styles.statValue}>
                {t(`contacts.data.stat.${stat.id}.value` as const)}
              </span>
              <span className={styles.statLabel}>
                <span className={styles.statLabelMobile}>
                  {t(`contacts.data.stat.${stat.id}.label` as const)}
                </span>
                <span className={styles.statLabelDesktop}>
                  {t(`contacts.data.stat.${stat.id}.labelDesktop` as const)}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <a href={`mailto:${SUPPORT_EMAIL}`} className={styles.actionPrimary}>
            {t('contacts.hero.emailUs')}
          </a>
          <a
            href={TWITTER_URL}
            className={styles.actionSecondary}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('contacts.hero.joinTwitter')}
          </a>
          <Link href="/faq" className={styles.actionSecondary}>
            {t('contacts.hero.browseFaq')}
          </Link>
        </div>
      </Container>
    </section>
  );
}
