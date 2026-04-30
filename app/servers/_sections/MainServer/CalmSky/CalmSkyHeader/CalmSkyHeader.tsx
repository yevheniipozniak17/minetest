import Image from 'next/image';
import styles from './CalmSkyHeader.module.css';

export default function CalmSkyHeader() {
  return (
    <div className={styles.banner}>
      <Image
        src="/servers/images/CalmSky.png"
        alt=""
        fill
        priority
        sizes="(min-width: 768px) 1240px, 100vw"
        className={styles.image}
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.tag}>
          PEACEFUL&nbsp;&nbsp;•&nbsp;&nbsp;BUILDING&nbsp;&nbsp;•&nbsp;&nbsp;CREATIVE
        </span>
        <h2 className={styles.title}>CalmSky</h2>
        <p className={styles.description}>
          A relaxed, peaceful server for building, exploring and enjoying
          Minecraft<span className={styles.descriptionDesktop}>
            {' '}at your own pace
          </span>.
        </p>
      </div>
    </div>
  );
}
