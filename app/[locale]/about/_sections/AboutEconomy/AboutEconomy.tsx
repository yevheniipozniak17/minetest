import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import styles from './AboutEconomy.module.css';

const STATS = ['stat1', 'stat2', 'stat3'] as const;

export default async function AboutEconomy() {
  const t = await getTranslations('marketing');

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.bg_image}></div>
        <span className={styles.badge}>{t('about.economy.badge')}</span>
        <h2 className={styles.title}>{t('about.economy.title')}</h2>
        <p className={styles.description}>{t('about.economy.description')}</p>

        <ul className={styles.list}>
          {STATS.map((stat) => (
            <li key={stat} className={styles.item}>
              <p className={styles.text}>
                {t(`about.economy.${stat}Label`)}
                <span className={styles.accent}>{t(`about.economy.${stat}Value`)}</span>
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
