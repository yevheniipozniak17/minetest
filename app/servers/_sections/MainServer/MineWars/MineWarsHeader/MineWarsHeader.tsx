import Image from 'next/image';
import styles from './MineWarsHeader.module.css';

export default function MineWarsHeader() {
  return (
    <div className={styles.banner}>
      <Image
        src="/servers/images/MineWars.webp"
        alt=""
        fill
        preload
        sizes="(min-width: 768px) 1240px, 100vw"
        className={styles.image}
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.tag}>
          PvP&nbsp;&nbsp;•&nbsp;&nbsp;COMPETITIVE&nbsp;&nbsp;•&nbsp;&nbsp;TOURNAMENTS
        </span>
        <h2 className={styles.title}>MineWars</h2>
        <p className={styles.description}>
          High-intensity PvP combat, ranked matches
          <span className={styles.descriptionDesktop}>, team battles</span> and seasonal
          tournaments.
        </p>
      </div>
    </div>
  );
}
