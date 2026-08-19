import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { getPlayNowHref } from '@/lib/data/servers';
import { TWITTER_URL } from '@/lib/data/social';
import styles from './LuckyActions.module.css';

export default function LuckyActions({ isAuthed = false }: { isAuthed?: boolean }) {
  const t = useTranslations('servers');
  const playHref = getPlayNowHref('luckysurvival', isAuthed);

  return (
    <section className={styles.card}>
      <h3 className={styles.eyebrow}>{t('shared.quickActions')}</h3>

      <Link href={playHref} className={`${styles.button} ${styles.primary}`}>
        {t('shared.playNow')}
      </Link>

      <a
        href={TWITTER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.button} ${styles.secondary}`}
      >
        <Image
          src="/icons/social/prime_twitter.svg"
          alt=""
          width={24}
          height={24}
          className={styles.discordIcon}
        />
        {t('shared.joinTwitter')}
      </a>
    </section>
  );
}
