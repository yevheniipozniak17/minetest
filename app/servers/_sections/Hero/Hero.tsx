import Image from 'next/image';
import { Container } from '@/app/_components/Container/Container';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <div className={styles.hero}>
      <Image
        src="/servers/images/bg.webp"
        alt=""
        fill
        sizes="100vw"
        preload
        className={styles.bg}
        style={{ objectFit: 'cover', objectPosition: '45% 50%' }}
      />
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.badgeFirst}>
            <Image
              src="/icons/icons/ellipse.svg"
              alt=""
              width={7}
              height={7}
              className={styles.badgeFirstDot}
            />
            MINECRAFT SERVERS
          </div>

          <h1 className={styles.title}>Explore Our Servers</h1>

          <p className={styles.description}>
            <span className={styles.descriptionDesktopLine}>
              Explore all Minecraft servers and their unique features.
            </span>
            Choose your playstyle — survival, PvP, or peaceful building.
          </p>

          <div className={styles.badgeSecond}>
            <Image
              src="/servers/icons/ellipse.svg"
              alt=""
              width={8}
              height={8}
              className={styles.badgeSecondDot}
            />
            All servers online&nbsp;&nbsp;•&nbsp;&nbsp;1,247 players
            <span className={styles.badgeSecondActive}>&nbsp;active</span>
          </div>
        </div>
      </Container>
    </div>
  );
}
