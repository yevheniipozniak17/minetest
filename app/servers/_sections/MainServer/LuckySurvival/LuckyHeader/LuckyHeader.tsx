import Image from 'next/image';
import styles from './LuckyHeader.module.css';

export default function LuckyHeader() {
  return (
    <div className={styles.banner}>
      <Image
        src="/servers/images/LuckySurvival.png"
        alt=""
        fill
        priority
        sizes="(min-width: 768px) 1240px, 100vw"
        className={styles.image}
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.tag}>SURVIVAL&nbsp;&nbsp;•&nbsp;&nbsp;ECONOMY&nbsp;&nbsp;•&nbsp;&nbsp;PvP</span>
        <h2 className={styles.title}>LuckySurvival</h2>
        <p className={styles.description}>
          Classic survival with fair PvP, balanced economy and active community.
        </p>
      </div>
    </div>
  );
}
