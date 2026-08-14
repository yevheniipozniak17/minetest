import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/app/_components/Container/Container';
import styles from './Hero.module.css';

export default async function Hero() {
  const t = await getTranslations('servers');

  return (
    <div className={styles.hero}>
      <Image
        src="/servers/images/bg.webp"
        alt=""
        fill
        sizes="100vw"
        preload
        className={styles.bg}
        style={{ objectFit: 'cover', objectPosition: '45% 50%' }}
      />
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.badgeFirst}>
            <Image
              src="/icons/icons/ellipse.svg"
              alt=""
              width={7}
              height={7}
              className={styles.badgeFirstDot}
            />
            {t('hero.badge')}
          </div>

          <h1 className={styles.title}>{t('hero.title')}</h1>

          <p className={styles.description}>
            <span className={styles.descriptionDesktopLine}>
              {t('hero.descriptionDesktop')}
            </span>
            {t('hero.description')}
          </p>

          <div className={styles.badgeSecond}>
            <Image
              src="/servers/icons/ellipse.svg"
              alt=""
              width={8}
              height={8}
              className={styles.badgeSecondDot}
            />
            {t('hero.statusBadge')}
          </div>
        </div>
      </Container>
    </div>
  );
}
