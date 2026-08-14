import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './CalmSkyHeader.module.css';

export default function CalmSkyHeader() {
  const t = useTranslations('servers');

  return (
    <div className={styles.banner}>
      <Image
        src="/servers/images/CalmSky.webp"
        alt=""
        fill
        preload
        sizes="(min-width: 768px) 1240px, 100vw"
        className={styles.image}
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.tag}>
          {t('calmsky.headerTag')}
        </span>
        <h2 className={styles.title}>CalmSky</h2>
        <p className={styles.description}>
          {t('calmsky.headerDescStart')}
          <span className={styles.descriptionDesktop}>{t('calmsky.headerDescDesktopSuffix')}</span>.
        </p>
      </div>
    </div>
  );
}
