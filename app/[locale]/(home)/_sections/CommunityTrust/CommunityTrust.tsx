import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import styles from './CommunityTrust.module.css';
import { Divider } from '@/app/_components/Divider/Divider';
import Strip from './Strip/Strip';

export default async function CommunityTrust() {
  const t = await getTranslations('home');

  return (
    <>
      <section className={styles.section}>
        <Container>
          <h2 className={styles.title}>{t('communityTrust.title')}</h2>
          <p className={styles.description}>{t('communityTrust.description')}</p>

          <ul className={styles.cards}>
            <div className={styles.firstCard}>
              <h3 className={styles.titleFirst}>{t('communityTrust.awardsTitle')}</h3>
              <p className={styles.descriptionFirst}>{t('communityTrust.awardsDescription')}</p>
              <Image
                className={styles.image}
                src="/icons/illustrations/award.png"
                alt={t('communityTrust.awardAlt')}
                width={118}
                height={128}
              />
            </div>
            <div className={styles.secondCard}>
              <h3 className={styles.titleSecond}>{t('communityTrust.platformsTitle')}</h3>
              <p className={styles.descriptionSecond}>{t('communityTrust.platformsDescription')}</p>
              <Strip ariaLabel={t('communityTrust.featuredOnAriaLabel')} />
            </div>
          </ul>
        </Container>
      </section>
      <Divider />
    </>
  );
}
