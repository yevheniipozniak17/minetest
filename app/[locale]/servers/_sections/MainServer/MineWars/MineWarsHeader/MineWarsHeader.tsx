import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './MineWarsHeader.module.css';

export default function MineWarsHeader() {
  const t = useTranslations('servers');

  return (
    <div className={styles.banner}>
      <Image
        src="/servers/images/MineWars.webp"
        alt=""
        fill
        preload
        sizes="(min-width: 768px) 1240px, 100vw"
        className={styles.image}
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.tag}>
          {t('minewars.headerTag')}
        </span>
        <h2 className={styles.title}>MineWars</h2>
        <p className={styles.description}>
          {t('minewars.headerDescStart')}
          <span className={styles.descriptionDesktop}>{t('minewars.headerDescDesktopExtra')}</span>
          {t('minewars.headerDescEnd')}
        </p>
      </div>
    </div>
  );
}
