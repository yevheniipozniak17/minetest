import Image from 'next/image';
import styles from './Hero.module.css';
import { Container } from '@/app/_components/Container/Container';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} aria-hidden />
      <Container className={styles.content}>
        <h1 className={styles.title}>
          Privilege and Resource <span>Store</span>
        </h1>
        <p className={styles.description}>
          Enhance your gameplay, gain unique opportunities, and support the server&apos;s
          development. All upgrades are permanently linked to your account.
        </p>

        <ul className={styles.buttonWrapper}>
          <li>
            <button type="button" className={styles.button}>
              <Image src="/icons/icons/crown.svg" alt="" width={24} height={24} aria-hidden />
              One-time purchase
            </button>
          </li>
          <li>
            <button type="button" className={styles.button}>
              <Image src="/icons/icons/dollar.svg" alt="" width={24} height={24} aria-hidden />
              Lifetime access
            </button>
          </li>
        </ul>
      </Container>
    </section>
  );
}
