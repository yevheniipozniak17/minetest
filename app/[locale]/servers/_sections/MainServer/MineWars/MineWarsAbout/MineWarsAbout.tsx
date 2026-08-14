import { useTranslations } from 'next-intl';
import styles from './MineWarsAbout.module.css';

export default function MineWarsAbout() {
  const t = useTranslations('servers');

  return (
    <section className={styles.card}>
      <p className={styles.eyebrow}>{t('shared.aboutEyebrow')}</p>
      <h3 className={styles.title}>{t('minewars.aboutTitle')}</h3>

      <p className={`${styles.description} ${styles.descriptionMobile}`}>
        {t('minewars.aboutDescMobile')}
      </p>

      <div className={styles.descriptionDesktop}>
        <p className={styles.description}>
          {t('minewars.aboutDescDesktop1')}
        </p>
        <p className={styles.description}>
          {t('minewars.aboutDescDesktop2')}
        </p>
      </div>

      <p className={styles.target}>
        <span className={styles.targetMobile}>
          {t('minewars.aboutTargetMobile')}
        </span>
        <span className={styles.targetDesktop}>
          {t('minewars.aboutTargetDesktop')}
        </span>
      </p>
    </section>
  );
}
