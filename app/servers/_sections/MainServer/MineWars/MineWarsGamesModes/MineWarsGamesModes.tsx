import styles from './MineWarsGamesModes.module.css';

export default function MineWarsGamesModes() {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Game Modes</h3>
      <ul className={styles.list}>
        <li className={styles.badgeActive}>
          ⚔️ PvP <span className={styles.badgeActiveText}>ON</span>
        </li>
        <li className={styles.badgeActive}>
          💣 TNT <span className={styles.badgeActiveText}>ON</span>
        </li>
        <li className={styles.badgeActive}>
          🏆 Ranked <span className={styles.badgeActiveText}>ON</span>
        </li>
        <li className={styles.badgeNoActive}>
          🌿 Survival <span className={styles.badgeNoActiveText}>OFF</span>
        </li>
      </ul>
    </section>
  );
}
