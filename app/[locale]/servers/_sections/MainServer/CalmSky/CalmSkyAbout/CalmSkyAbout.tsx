import { useTranslations } from 'next-intl';
import styles from './CalmSkyAbout.module.css';

export default function CalmSkyAbout() {
  const t = useTranslations('servers');

  return (
    <section className={styles.card}>
      <p className={styles.eyebrow}>{t('shared.aboutEyebrow')}</p>
      <h3 className={styles.title}>{t('calmsky.aboutTitle')}</h3>

      <p className={`${styles.description} ${styles.descriptionMobile}`}>
        {t('calmsky.aboutDescMobile')}
      </p>

      <div className={styles.descriptionDesktop}>
        <p className={styles.description}>
          {t('calmsky.aboutDescDesktop1')}
        </p>
        <p className={styles.description}>
          {t('calmsky.aboutDescDesktop2')}
        </p>
      </div>

      <p className={styles.target}>
        <span className={styles.targetMobile}>
          {t('calmsky.aboutTargetMobile')}
        </span>
        <span className={styles.targetDesktop}>
          {t('calmsky.aboutTargetDesktop')}
        </span>
      </p>
    </section>
  );
}
