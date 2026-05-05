import { Container } from '@/app/_components/Container/Container';
import styles from './Category.module.css';
import Tabs from '@/app/_components/Tabs/Tabs';
import PrivilegesCards from '@/app/_components/PrivilegesCards/PrivilegesCards';

export default function Category() {
  return (
    <>
      <section className={styles.section}>
        <Container>
          <h2 className={styles.title}>Category</h2>
          <Tabs />
          <PrivilegesCards />
        </Container>
      </section>
    </>
  );
}
