import { useTranslations } from 'next-intl';
import styles from './LuckyGamesModes.module.css';

export default function LuckyGamesModes() {
  const t = useTranslations('servers');

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>{t('shared.gameModes')}</h3>
      <ul className={styles.list}>
        <li className={styles.badgeActive}>
          ⚔️ PvP<span className={styles.badgeActiveText}>{t('shared.on')}</span>
        </li>
        <li className={styles.badgeNoActive}>
          💣 TNT <span className={styles.badgeNoActiveText}>{t('shared.off')}</span>
        </li>
        <li className={styles.badgeNoActive}>
          🏗️ {t('shared.creative')} <span className={styles.badgeNoActiveText}>{t('shared.off')}</span>
        </li>
        <li className={styles.badgeActive}>
          🌿 {t('shared.survival')} <span className={styles.badgeActiveText}>{t('shared.on')}</span>
        </li>
      </ul>
    </div>
  );
}
