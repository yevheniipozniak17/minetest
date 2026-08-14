import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import styles from './CalmSkyHowToStart.module.css';

export default function CalmSkyHowToStart() {
  const t = useTranslations('servers');

  const STEPS = [
    { mobile: t('calmsky.step1Mobile'), desktop: t('calmsky.step1Desktop') },
    { mobile: t('calmsky.step2'), desktop: t('calmsky.step2') },
    { mobile: t('calmsky.step3'), desktop: t('calmsky.step3') },
    { mobile: t('calmsky.step4'), desktop: t('calmsky.step4') },
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
