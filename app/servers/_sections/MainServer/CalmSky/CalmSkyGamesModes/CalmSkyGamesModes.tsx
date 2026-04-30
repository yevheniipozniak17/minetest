import styles from './CalmSkyGamesModes.module.css';

export default function CalmSkyGamesModes() {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Game Modes</h3>
      <ul className={styles.list}>
        <li className={styles.badgeActive}>
          🌿 Survival <span className={styles.badgeActiveText}>ON</span>
        </li>
        <li className={styles.badgeActive}>
          🏗️ Creative <span className={styles.badgeActiveText}>ON</span>
        </li>
        <li className={styles.badgeNoActive}>
          ⚔️ PvP <span className={styles.badgeNoActiveText}>OFF</span>
        </li>
        <li className={styles.badgeNoActive}>
          💣 TNT <span className={styles.badgeNoActiveText}>OFF</span>
        </li>
      </ul>
    </section>
  );
}
