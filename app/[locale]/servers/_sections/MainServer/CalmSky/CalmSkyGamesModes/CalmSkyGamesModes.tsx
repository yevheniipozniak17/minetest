import { useTranslations } from 'next-intl';
import styles from './CalmSkyGamesModes.module.css';

export default function CalmSkyGamesModes() {
  const t = useTranslations('servers');

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>{t('shared.gameModes')}</h3>
      <ul className={styles.list}>
        <li className={styles.badgeActive}>
          🌿 {t('shared.survival')} <span className={styles.badgeActiveText}>{t('shared.on')}</span>
        </li>
        <li className={styles.badgeActive}>
          🏗️ {t('shared.creative')} <span className={styles.badgeActiveText}>{t('shared.on')}</span>
        </li>
        <li className={styles.badgeNoActive}>
          ⚔️ PvP <span className={styles.badgeNoActiveText}>{t('shared.off')}</span>
        </li>
        <li className={styles.badgeNoActive}>
          💣 TNT <span className={styles.badgeNoActiveText}>{t('shared.off')}</span>
        </li>
      </ul>
    </section>
  );
}
