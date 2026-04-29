import Image from 'next/image';
import { Container } from '../../../_components/Container/Container';
import styles from './CommunityTrust.module.css';
import { Divider } from '../../../_components/Divider/Divider';
import Strip from './Strip/Strip';

export default function CommunityTrust() {
  return (
    <>
      <section className={styles.section}>
        <Container>
          <h2 className={styles.title}>Players talk about us. Trusted by the community.</h2>
          <p className={styles.description}>
            Discover what players and gaming platforms say about our servers. Featured on trusted
            Minecraft directories and community platforms.
          </p>

          <ul className={styles.cards}>
            <div className={styles.firstCard}>
              <h3 className={styles.titleFirst}>Community Awards</h3>
              <p className={styles.descriptionFirst}>
                Chosen by players. Recognized by the community.
              </p>
              <Image
                className={styles.image}
                src="/icons/illustrations/award.png"
                alt="Award"
                width={118}
                height={128}
              />
            </div>
            <div className={styles.secondCard}>
              <h3 className={styles.titleSecond}>Platform Mentions</h3>
              <p className={styles.descriptionSecond}>Featured on trusted Minecraft platforms.</p>
              <Strip />
            </div>
          </ul>
        </Container>
      </section>
      <Divider />
    </>
  );
}
