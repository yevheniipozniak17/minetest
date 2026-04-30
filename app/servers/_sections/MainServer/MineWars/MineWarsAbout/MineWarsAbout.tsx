import styles from './MineWarsAbout.module.css';

export default function MineWarsAbout() {
  return (
    <section className={styles.card}>
      <p className={styles.eyebrow}>About the Server</p>
      <h3 className={styles.title}>Competitive PvP at Its Finest</h3>

      <p className={`${styles.description} ${styles.descriptionMobile}`}>
        MineWars is built for competitive players. Join ranked matches,
        seasonal tournaments, and team warfare. Every battle counts — prove you
        are the best.
      </p>

      <div className={styles.descriptionDesktop}>
        <p className={styles.description}>
          MineWars is built for competitive players who thrive in combat. Join
          ranked ladder matches, compete in seasonal tournaments, and rise
          through team-based warfare. Every battle counts — prove you are the
          best.
        </p>
        <p className={styles.description}>
          The economy revolves around conquest — loot your enemies, claim
          resources, dominate the leaderboard.
        </p>
      </div>

      <p className={styles.target}>
        <span className={styles.targetMobile}>
          Target: Competitive players, PvP enthusiasts
        </span>
        <span className={styles.targetDesktop}>
          Target audience: Competitive players, PvP enthusiasts,
          tournament-seekers
        </span>
      </p>
    </section>
  );
}
