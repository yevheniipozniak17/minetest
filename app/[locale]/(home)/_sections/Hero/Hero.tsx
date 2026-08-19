import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getDashboardPlayHref } from '@/lib/data/servers';
import { TWITTER_URL } from '@/lib/data/social';
import { Container } from '@/app/_components/Container/Container';
import { Divider } from '@/app/_components/Divider/Divider';
import styles from './Hero.module.css';

export async function Hero({ isAuthed = false }: { isAuthed?: boolean }) {
  const t = await getTranslations('home');
  const playHref = getDashboardPlayHref(isAuthed);

  return (
    <>
      <section className={styles.main}>
        {/* Video + overlay + cat share the same containing block (video size) */}
        <div className={styles.videoWrap}>
          <video
            className={styles.video}
            src="/video/hero-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
          <div className={styles.overlay}></div>
          <div className={styles.frame}>
            <div className={styles.cat}>
              <Image
                src="/icons/illustrations/cat.webp"
                alt={t('hero.catAlt')}
                width={488}
                height={222}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <Container className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.titleAccent}>Minecraft:</span>
            {'\n'}{t('hero.titleSuffix')}
          </h1>

          <p className={styles.description}>{t('hero.description')}</p>

          <div className={styles.buttons}>
            <Link href={playHref} className={styles.btnPrimary}>
              {t('hero.playNow')}
            </Link>
            <a
              href={TWITTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              <Image src="/icons/social/prime_twitter.svg" alt="" width={24} height={24} />
              <span>{t('hero.joinTwitter')}</span>
            </a>
          </div>
        </Container>
      </section>

      <Divider />
    </>
  );
}
