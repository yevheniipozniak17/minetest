import Link from 'next/link';
import styles from './StartAdventure.module.css';
import { Container } from '../Container/Container';

export default function StartAdventure() {
  return (
    <section className={styles.section}>
      <Container>
        <h2 className={styles.title}>Ready to start your adventure?</h2>
        <p className={styles.description}>Join the world of unique Minecraft servers.</p>
        <Link href="/play" className={styles.btn}>
          Play Now
        </Link>
      </Container>
    </section>
  );
}
