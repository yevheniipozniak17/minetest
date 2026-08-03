'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { DashboardServer } from '@/lib/data/dashboardServers';
import { useServerOnline } from '@/lib/client/useServerOnline';
import styles from './ServerDetail.module.css';

type ServerDetailProps = {
  server: DashboardServer;
};

export default function ServerDetail({ server }: ServerDetailProps) {
  const t = useTranslations('serversData');
  const [copied, setCopied] = useState(false);
  const live = useServerOnline(server.id);
  const isOnline = live.status === 'online';
  const isLoading = live.status === 'loading';
  const statusLabel = isLoading ? t('ui.checking') : isOnline ? t('ui.online') : t('ui.offline');
  const difficultyLabel = t(`ui.difficulty.${server.difficulty}`);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(server.ip).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }, [server.ip]);

  return (
    <section className={styles.root}>
      <div className={styles.inner}>
      <nav className={styles.crumb} aria-label="Breadcrumb">
        <Link href="/dashboard/servers" className={styles.crumbLink}>
          <span className={styles.crumbArrow} aria-hidden>
            ←
          </span>
          <span>{t('ui.allServers')}</span>
        </Link>
        <span className={styles.crumbSep} aria-hidden>
          /
        </span>
        <span className={styles.crumbCurrent}>{server.breadcrumbLabel}</span>
      </nav>

      <div className={styles.heroRow}>
        <div className={styles.heroMedia}>
          <Image
            src={server.image}
            alt=""
            width={734}
            height={451}
            className={styles.heroImg}
            priority
            aria-hidden
          />
        </div>

        <div className={styles.heroInfo}>
          <div className={styles.badges}>
            <span
              className={`${styles.status} ${isOnline ? styles.statusOnline : styles.statusOffline}`}
            >
              <span className={styles.statusDot} aria-hidden />
              {statusLabel}
            </span>
            <span className={styles.category}>{t(`${server.id}.category`)}</span>
          </div>

          <h1 className={styles.title}>{server.detailTitle}</h1>

          <p className={styles.leadMobile}>{t(`${server.id}.detailDescription`)}</p>
          <p className={styles.leadDesktop}>{t(`${server.id}.detailDescriptionDesktop`)}</p>

          <dl className={styles.stats}>
            <div className={styles.stat}>
              <dt className={styles.statValue} data-difficulty={server.difficulty}>
                {difficultyLabel}
              </dt>
              <dd className={styles.statLabel}>{t('ui.difficultyLabel')}</dd>
            </div>
            <div className={styles.stat}>
              <dt className={styles.statValue}>{isOnline ? server.latency : t('ui.offlineLabel')}</dt>
              <dd className={styles.statLabel}>{t('ui.latencyLabel')}</dd>
            </div>
            <div className={styles.stat}>
              <dt className={styles.statValue}>{server.uptime}</dt>
              <dd className={styles.statLabel}>{t('ui.uptimeLabel')}</dd>
            </div>
          </dl>

          <div className={styles.ipBox}>
            <div className={styles.ipTop}>
              <span className={styles.ipLabel}>{t('ui.serverIp')}</span>
              <span className={styles.ipVersion}>{server.version}</span>
            </div>
            <div className={styles.ipRow}>
              <p className={styles.ipAddress}>{server.ip}</p>
            </div>
          </div>

          <button type="button" className={styles.join} onClick={handleCopy}>
            {copied ? t('ui.copied') : t('ui.copyIp')}
          </button>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>{t('ui.aboutServer')}</h2>
      <div className={styles.about}>
        <p className={styles.aboutTextMobile}>{t(`${server.id}.aboutText`)}</p>
        <p className={styles.aboutTextDesktop}>{t(`${server.id}.aboutTextDesktop`)}</p>
        <p className={styles.featuresHeading}>{t('ui.keyFeatures')}</p>
        <ul className={styles.featureListMobile}>
          {Array.from({ length: server.featureCount }, (_, i) => (
            <li key={i} className={styles.featureItem}>
              <span className={styles.featureDot} aria-hidden />
              {t(`${server.id}.feature${i}`)}
            </li>
          ))}
        </ul>
        <ul className={styles.featureListDesktop}>
          {Array.from({ length: server.featureCountDesktop }, (_, i) => (
            <li key={i} className={styles.featureItem}>
              <span className={styles.featureDot} aria-hidden />
              {t(`${server.id}.featureD${i}`)}
            </li>
          ))}
        </ul>
      </div>

      </div>
    </section>
  );
}
