import { Container } from '@/app/_components/Container/Container';
import styles from './Hero.module.css';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className={styles.hero}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.badgeFirst}>
            <Image src="/icons/icons/ellipse.svg" alt="" width={6} height={6} />
            MINECRAFT SERVERS
          </div>
          <h1 className={styles.title}>Explore Our Servers</h1>
          <p className={styles.description}>
            Choose your playstyle — survival, PvP, or peaceful building.
          </p>
          <div className={styles.badgeSecond}>
            <Image src="/servers/icons/ellipse.svg" alt="" width={6} height={6} />
            All servers online • 1,247 players
          </div>
        </div>
      </Container>
    </div>
  );
}
