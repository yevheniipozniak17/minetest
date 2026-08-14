import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import { Badge } from '@/app/_components/Badge/Badge';
import { FAQ_TOTAL_COUNT } from '@/app/[locale]/faq/_data/faqArticles';
import styles from './Hero.module.css';
import { Breadcrumbs } from '@/app/_components/Breadcrumbs/Breadcrumbs';
import HeroTopics from './HeroTopics';
import HeroSearch from './HeroSearch';

const BREADCRUMB_LINKS = ['/', '/faq'];

export default async function Hero() {
  const t = await getTranslations('faq');

  const STATS = [
    { value: String(FAQ_TOTAL_COUNT), label: t('hero.questions') },
    { value: '8', label: t('hero.categories') },
    { value: '< 4h', label: t('hero.avgReply') },
  ] as const;

  return (
    <section className={styles.hero}>
      <Container variant="faq">
        <div className={styles.content}>
          <Breadcrumbs
            items={[t('breadcrumb.home'), t('breadcrumb.support'), t('breadcrumb.faq')]}
            links={BREADCRUMB_LINKS}
          />

          <div className={styles.head}>
            <Badge className={styles.badge}>{t('hero.badge')}</Badge>
            <h1 className={styles.title}>{t('hero.title')}</h1>
            <p className={`${styles.description} ${styles.descriptionMobile}`}>
              {t('hero.descMobile')}
            </p>
            <p className={`${styles.description} ${styles.descriptionDesktop}`}>
              {t('hero.descDesktop')}
            </p>
          </div>

          <HeroSearch />

          <div className={styles.stats}>
            {STATS.map(stat => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>

          <HeroTopics />
        </div>
      </Container>
    </section>
  );
}
