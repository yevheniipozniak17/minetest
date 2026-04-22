import styles from './Features.module.css';
import { Container } from '../Container/Container';
import { Divider } from '../Divider/Divider';
import FeaturesList from './FeaturesList/FeaturesList';

export default function Features() {
  return (
    <>
      <section className={styles.features}>
        <Container>
          <h2 className={styles.title}>Game Features</h2>
          <FeaturesList />
        </Container>
      </section>

      <Divider />
    </>
  );
}
