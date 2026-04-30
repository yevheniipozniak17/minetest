import { Container } from '@/app/_components/Container/Container';
import styles from './MainServer.module.css';
import LuckySurvival from './LuckySurvival/LuckySurvival';

export default function MainServer() {
  return (
    <section className={styles.section}>
      <Container>
        <ul className={styles.list}>
          <li>
            <button
              type="button"
              className={`${styles.button} ${styles.active}`}
            >
              LuckySurvival
            </button>
          </li>
          <li>
            <button type="button" className={styles.button}>
              MineWars
            </button>
          </li>
          <li>
            <button type="button" className={styles.button}>
              CalmSky
            </button>
          </li>
        </ul>

        <LuckySurvival />
      </Container>
    </section>
  );
}
