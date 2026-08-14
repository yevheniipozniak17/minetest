import { useTranslations } from 'next-intl';
import styles from './MineWarsGamesModes.module.css';

export default function MineWarsGamesModes() {
  const t = useTranslations('servers');

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>{t('shared.gameModes')}</h3>
      <ul className={styles.list}>
        <li className={styles.badgeActive}>
          ⚔️ PvP <span className={styles.badgeActiveText}>{t('shared.on')}</span>
        </li>
        <li className={styles.badgeActive}>
          💣 TNT <span className={styles.badgeActiveText}>{t('shared.on')}</span>
        </li>
        <li className={styles.badgeActive}>
          🏆 {t('shared.ranked')} <span className={styles.badgeActiveText}>{t('shared.on')}</span>
        </li>
        <li className={styles.badgeNoActive}>
          🌿 {t('shared.survival')} <span className={styles.badgeNoActiveText}>{t('shared.off')}</span>
        </li>
      </ul>
    </section>
  );
}
