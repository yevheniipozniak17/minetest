import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import styles from './AboutMission.module.css';
import { Container } from '@/app/_components/Container/Container';

export default async function AboutMission() {
  const t = await getTranslations('marketing');

  return (
    <section className={styles.section}>
      <Container>
        <span className={styles.badge}>{t('about.mission.badge')}</span>
        <h2 className={styles.title}>{t('about.mission.title')}</h2>
        <p className={styles.description}>{t('about.mission.description1')}</p>

        <p className={styles.description}>{t('about.mission.description2')}</p>

        <ul className={styles.iconList}>
          <li className={styles.iconItem}>
            <Image
              className={styles.icon}
              src="/about/images/icon1.webp"
              alt=""
              width={70}
              height={72}
            />
          </li>
          <li className={styles.iconItem}>
            <Image
              className={styles.icon}
              src="/about/images/icon2.webp"
              alt=""
              width={70}
              height={72}
            />
          </li>
          <li className={styles.iconItem}>
            <Image
              className={styles.icon}
              src="/about/images/icon3.webp"
              alt=""
              width={70}
              height={72}
            />
          </li>
          <li className={styles.iconItem}>
            <Image
              className={styles.icon}
              src="/about/images/icon4.webp"
              alt=""
              width={70}
              height={72}
            />
          </li>
        </ul>
      </Container>
    </section>
  );
}
