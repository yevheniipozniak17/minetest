import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import styles from './MineWarsHowToStart.module.css';

export default function MineWarsHowToStart() {
  const t = useTranslations('servers');

  const STEPS = [
    { mobile: t('minewars.step1Mobile'), desktop: t('minewars.step1Desktop') },
    { mobile: t('minewars.step2Mobile'), desktop: t('minewars.step2Desktop') },
    { mobile: t('minewars.step3Mobile'), desktop: t('minewars.step3Desktop') },
    { mobile: t('minewars.step4'), desktop: t('minewars.step4') },
  ];

  return (
    <section className={styles.card}>
      <h3 className={styles.title}>{t('shared.howToStartTitle')}</h3>

      <ol className={styles.steps}>
        {STEPS.map((step) => (
          <li key={step.desktop} className={styles.step}>
            <span className={styles.bullet} aria-hidden="true" />
            <span className={styles.stepText}>
              <span className={styles.stepMobile}>{step.mobile}</span>
              <span className={styles.stepDesktop}>{step.desktop}</span>
            </span>
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
