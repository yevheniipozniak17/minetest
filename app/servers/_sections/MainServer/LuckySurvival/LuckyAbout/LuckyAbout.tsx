import styles from './LuckyAbout.module.css';

export default function LuckyAbout() {
  return (
    <section className={styles.card}>
      <p className={styles.eyebrow}>About the Server</p>
      <h3 className={styles.title}>Classic Survival with Modern Twist</h3>
      <p className={styles.description}>
        LuckySurvival offers a classic Minecraft survival experience with fair
        PvP, a balanced in-game economy, and an active community. Built for both
        casual and competitive players
        <span className={styles.descriptionDesktop}>
          {' '}— find your place in the world
        </span>
        .
      </p>
      <p className={styles.target}>
        <span className={styles.targetMobile}>
          Target: Balanced / chill players, active gameplay
        </span>
        <span className={styles.targetDesktop}>
          Target audience: Balanced / chill players who enjoy active gameplay,
          fair competition and economic strategy.
        </span>
      </p>
    </section>
  );
}
