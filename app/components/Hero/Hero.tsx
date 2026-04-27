import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../Container/Container';
import { Divider } from '../Divider/Divider';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <>
      <section className={styles.main}>
        <div className={styles.overlay}></div>
        <video
          className={styles.video}
          src="/video/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />

        {/* Content */}
        <Container className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.titleAccent}>Minecraft:</span>
            {'\n'}A Next-Generation Ecosystem
          </h1>

          <p className={styles.description}>
            Three unique servers, an in-game economy, rankings, and tournaments. Play the way you
            like—PvP, survival, or casual building.
          </p>

          <div className={styles.buttons}>
            <Link href="/play" className={styles.btnPrimary}>
              Play Now
            </Link>
            <a
              href="https://discord.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              <Image src="/icons/social/ic_outline-discord.svg" alt="" width={24} height={24} />
              <span>Join Discord</span>
            </a>
          </div>
        </Container>

        <div className={styles.cat}>
          <Image src="/icons/illustrations/cat.svg" alt="Minecraft cat" width={488} height={222} />
        </div>
      </section>

      <Divider />
    </>
  );
}
