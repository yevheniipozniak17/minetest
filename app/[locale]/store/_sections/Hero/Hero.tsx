import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import styles from './Hero.module.css';
import { Container } from '@/app/_components/Container/Container';

export default async function Hero() {
  const t = await getTranslations('store');

  return (
    <section className={styles.hero}>
      <Image
        src="/store/images/bg.webp"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className={styles.bgImage}
        aria-hidden
      />
      <div className={styles.overlay} aria-hidden />
      <Container className={styles.content}>
        <h1 className={styles.title}>
          {t('hero_titleMain')}
          <span>{t('hero_titleAccent')}</span>
        </h1>
        <p className={styles.description}>{t('hero_description')}</p>

        <ul className={styles.buttonWrapper}>
          <li>
            <button type="button" className={styles.button}>
              <Image src="/icons/icons/crown.svg" alt="" width={24} height={24} aria-hidden />
              {t('hero_onetime')}
            </button>
          </li>
          <li>
            <button type="button" className={styles.button}>
              <Image src="/icons/icons/dollar.svg" alt="" width={24} height={24} aria-hidden />
              {t('hero_lifetime')}
            </button>
          </li>
        </ul>
      </Container>
    </section>
  );
}
