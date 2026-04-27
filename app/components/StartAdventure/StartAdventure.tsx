import Image from 'next/image';
import Link from 'next/link';
import styles from './StartAdventure.module.css';
import { Container } from '../Container/Container';

export default function StartAdventure() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.content}>
          <div className={styles.wrapper}>
            <h2 className={styles.title}>Ready to start your adventure?</h2>
            <p className={styles.description}>Join the world of unique Minecraft servers.</p>
            <Link href="/play" className={styles.btn}>
              Play Now
            </Link>
          </div>

          <div className={styles.videoBox}>
            <video
              src="/video/big_cat.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className={styles.video}
            />
            <Image
              src="/icons/illustrations/effect.png"
              alt=""
              fill
              priority
              className={styles.effect}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
