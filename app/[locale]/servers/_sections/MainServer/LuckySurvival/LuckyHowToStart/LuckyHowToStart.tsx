import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import styles from './LuckyHowToStart.module.css';

export default function LuckyHowToStart() {
  const t = useTranslations('servers');

  const STEPS = [
    t('lucky.step1'),
    t('lucky.step2'),
    t('lucky.step3'),
    t('lucky.step4'),
  ];

  return (
    <section className={styles.card}>
      <h3 className={styles.title}>{t('shared.howToStartTitle')}</h3>

      <ol className={styles.steps}>
        {STEPS.map((step) => (
          <li key={step} className={styles.step}>
            <span className={styles.bullet} aria-hidden="true" />
            <span className={styles.stepText}>{step}</span>
          </li>
        ))}
      </ol>

      <Link href="/how-to-start" className={styles.cta}>
        <span aria-hidden="true">📖</span>
        {t('shared.viewFullInstructions')}
      </Link>
    </section>
  );
}
