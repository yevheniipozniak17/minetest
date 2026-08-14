'use client';

import { useTranslations } from 'next-intl';
import { useServerOnline } from '@/lib/client/useServerOnline';
import { GAME_SERVERS } from '@/lib/server/gameServers';
import styles from './MineWarsStatus.module.css';

const DIFFICULTY = GAME_SERVERS.minewars.difficulty;

export default function MineWarsStatus() {
  const t = useTranslations('servers');
  const { status } = useServerOnline('minewars');
  const isOffline = status === 'offline';

  const STATS = [
    { value: '24/7', labelMobile: t('shared.availabilityLabel'), labelDesktop: t('shared.availabilityLabel') },
    {
      value: t(`shared.difficulty.${DIFFICULTY}`),
      labelMobile: t('shared.difficultyLabel'),
      labelDesktop: t('shared.difficultyLabel'),
    },
  ];

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <span
          className={[styles.dot, isOffline && styles.dotOffline].filter(Boolean).join(' ')}
          aria-hidden="true"
        />
        <h3 className={styles.title}>
          <span className={styles.titleMobile}>{t('shared.liveStatusMobile')}</span>
          <span className={styles.titleDesktop}>{t('shared.liveServerStatus')}</span>
        </h3>
        <span className={isOffline ? styles.offline : styles.online}>
          {isOffline ? t('shared.offline') : t('shared.online')}
        </span>
      </div>

      <ul className={styles.stats}>
        {STATS.map((stat) => (
          <li key={stat.labelDesktop} className={styles.stat}>
            <p className={styles.value}>{stat.value}</p>
            <p className={styles.label}>
              <span className={styles.labelMobile}>{stat.labelMobile}</span>
              <span className={styles.labelDesktop}>{stat.labelDesktop}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
