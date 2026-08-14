import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getDashboardPlayHref } from '@/lib/data/servers';
import styles from './StartAdventure.module.css';
import { Container } from '@/app/_components/Container/Container';

export default async function StartAdventure({ isAuthed = false }: { isAuthed?: boolean }) {
  const t = await getTranslations('home');
  const playHref = getDashboardPlayHref(isAuthed);

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.content}>
          <div className={styles.wrapper}>
            <h2 className={styles.title}>{t('startAdventure.title')}</h2>
            <p className={styles.description}>{t('startAdventure.description')}</p>
            <Link href={playHref} className={styles.btn}>
              {t('startAdventure.playNow')}
            </Link>
          </div>
        </div>
      </Container>

      {/* Decorative video — anchored to 1440 column (desktop only) */}
      <div className={styles.frame}>
        <div className={styles.videoBox}>
          <video
            src="/video/big_cat.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className={styles.video}
          />
          <Image
            src="/icons/illustrations/effect.png"
            alt=""
            fill
            sizes="(min-width: 1280px) 463px, 0px"
            loading="lazy"
            className={styles.effect}
          />
        </div>
      </div>
    </section>
  );
}
