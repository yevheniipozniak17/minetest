import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './LuckyHeader.module.css';

export default function LuckyHeader() {
  const t = useTranslations('servers');

  return (
    <div className={styles.banner}>
      <Image
        src="/servers/images/LuckySurvival.webp"
        alt=""
        fill
        preload
        sizes="(min-width: 768px) 1240px, 100vw"
        className={styles.image}
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.tag}>
          {t('lucky.headerTag')}
        </span>
        <h2 className={styles.title}>LuckySurvival</h2>
        <p className={styles.description}>
          {t('lucky.headerDescription')}
        </p>
      </div>
    </div>
  );
}
