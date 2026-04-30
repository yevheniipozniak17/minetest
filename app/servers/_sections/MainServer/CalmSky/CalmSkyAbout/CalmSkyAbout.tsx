import styles from './CalmSkyAbout.module.css';

export default function CalmSkyAbout() {
  return (
    <section className={styles.card}>
      <p className={styles.eyebrow}>About the Server</p>
      <h3 className={styles.title}>Build, Explore &amp; Relax</h3>

      <p className={`${styles.description} ${styles.descriptionMobile}`}>
        CalmSky is a peaceful haven for builders. No PvP, no griefing — just
        creativity and collaboration. Join friendly build contests and share
        your creations.
      </p>

      <div className={styles.descriptionDesktop}>
        <p className={styles.description}>
          CalmSky is a peaceful haven for players who want to focus on
          building, exploring, and community without the stress of combat. No
          PvP zones, no griefing — just creativity and collaboration.
        </p>
        <p className={styles.description}>
          Join friendly build contests, explore vast landscapes and share your
          creations with a supportive community.
        </p>
      </div>

      <p className={styles.target}>
        <span className={styles.targetMobile}>
          Target: Casual players, builders, families
        </span>
        <span className={styles.targetDesktop}>
          Target audience: Casual players, builders, families, new Minecraft
          players
        </span>
      </p>
    </section>
  );
}
