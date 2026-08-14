import { useTranslations } from 'next-intl';
import styles from './LuckyAbout.module.css';

export default function LuckyAbout() {
  const t = useTranslations('servers');

  return (
    <section className={styles.card}>
      <p className={styles.eyebrow}>{t('shared.aboutEyebrow')}</p>
      <h3 className={styles.title}>{t('lucky.aboutTitle')}</h3>
      <p className={styles.description}>
        {t('lucky.aboutDescription')}
        <span className={styles.descriptionDesktop}>
          {t('lucky.aboutDescriptionDesktopSuffix')}
        </span>
        .
      </p>
      <p className={styles.target}>
        <span className={styles.targetMobile}>
          {t('lucky.aboutTargetMobile')}
        </span>
        <span className={styles.targetDesktop}>
          {t('lucky.aboutTargetDesktop')}
        </span>
      </p>
    </section>
  );
}
