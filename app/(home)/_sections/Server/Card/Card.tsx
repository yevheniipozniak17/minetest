'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useServerOnline } from '@/lib/client/useServerOnline';
import type { GameServerKey } from '@/lib/server/gameServers';
import styles from './Card.module.css';

export type Difficulty = 'easy' | 'normal' | 'hard';

export type CardProps = {
  serverId: GameServerKey;
  title: string;
  text: string;
  description: string;
  icon: string;
  version: string;
  connectAddress: string;
  difficulty: Difficulty;
};

export function Card({
  serverId,
  title,
  text,
  description,
  icon,
  version,
  connectAddress,
  difficulty,
}: CardProps) {
  const t = useTranslations('home');
  const { status } = useServerOnline(serverId);
  const isOffline = status === 'offline';
  const [copied, setCopied] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, []);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(connectAddress).then(() => {
      setCopied(true);
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
      noticeTimer.current = setTimeout(() => setCopied(false), 3000);
    });
  }, [connectAddress]);

  return (
    <div className={styles.card}>
      <span className={styles.versionBadge}>
        <Image
          className={styles.versionIcon}
          src="/how-to-start/icons/game.svg"
          alt=""
          width={16}
          height={16}
          aria-hidden
        />
        <span className={styles.versionLabel}>{version}</span>
      </span>
      <Image
        className={styles.icon}
        src={icon}
        alt={title}
        width={203}
        height={191}
        sizes="(max-width: 1279px) 254px, 203px"
        loading="lazy"
      />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
      <p className={styles.description}>{description}</p>

      <ul className={styles.list}>
        <li className={styles.item}>
          {t('server.cardStatus')}
          <div className={styles.status}>
            <span
              className={`${styles.statusDot} ${isOffline ? styles.statusDotOffline : ''}`}
              aria-hidden="true"
            />
            {isOffline ? t('server.cardOffline') : t('server.cardOnline')}
          </div>
        </li>
        <li className={styles.item}>
          {t('server.cardDifficulty')}
          <div className={styles.status} data-difficulty={difficulty}>
            <span className={styles.difficultyDot} aria-hidden="true" />
            {t(`server.difficulty.${difficulty}`)}
          </div>
        </li>
        <li className={`${styles.item} ${styles.itemIp}`}>
          {t('server.cardServerIp')}
          <div className={styles.status}>{connectAddress}</div>
        </li>
      </ul>

      <button
        type="button"
        className={`${styles.linkButton} ${copied ? styles.linkButtonCopied : ''}`}
        onClick={handleCopy}
        aria-live={copied ? 'polite' : undefined}
      >
        {!copied && (
          <Image src="/icons/icons/arrow-up.svg" alt="" width={24} height={24} />
        )}
        <span className={styles.linkButtonText}>
          {copied ? t('server.cardCopyNotice') : t('server.cardJoin', { title })}
        </span>
      </button>
    </div>
  );
}
