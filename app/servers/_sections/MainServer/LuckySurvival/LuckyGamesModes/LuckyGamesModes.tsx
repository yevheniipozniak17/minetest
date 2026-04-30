import styles from './LuckyGamesModes.module.css';

export default function LuckyGamesModes() {
  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Game Modes</h3>
      <ul className={styles.list}>
        <li className={styles.badgeActive}>
          ⚔️ PvP<span className={styles.badgeActiveText}>ON</span>
        </li>
        <li className={styles.badgeNoActive}>
          💣 TNT <span className={styles.badgeNoActiveText}>OFF</span>
        </li>
        <li className={styles.badgeNoActive}>
          🏗️ Creative <span className={styles.badgeNoActiveText}>OFF</span>
        </li>
        <li className={styles.badgeActive}>
          🌿 Survival <span className={styles.badgeActiveText}>ON</span>
        </li>
      </ul>
    </div>
  );
}
