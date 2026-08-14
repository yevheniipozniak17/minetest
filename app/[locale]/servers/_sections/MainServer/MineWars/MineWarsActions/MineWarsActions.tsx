import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { getPlayNowHref } from '@/lib/data/servers';
import { TWITCH_URL } from '@/lib/data/social';
import styles from './MineWarsActions.module.css';

export default function MineWarsActions({ isAuthed = false }: { isAuthed?: boolean }) {
  const t = useTranslations('servers');
  const playHref = getPlayNowHref('minewars', isAuthed);

  return (
    <section className={styles.card}>
      <h3 className={styles.eyebrow}>{t('shared.quickActions')}</h3>

      <Link href={playHref} className={`${styles.button} ${styles.primary}`}>
        {t('shared.playNow')}
      </Link>

      <a
        href={TWITCH_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.button} ${styles.secondary}`}
      >
        <Image
          src="/icons/social/twitch.svg"
          alt=""
          width={24}
          height={24}
          className={styles.discordIcon}
        />
        {t('shared.joinTwitch')}
      </a>
    </section>
  );
}
