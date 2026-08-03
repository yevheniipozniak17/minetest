'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CSSProperties, Fragment, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './ComingSoon.module.css';

const CYCLE_DAYS = 30;
const CYCLE_MS = CYCLE_DAYS * 86_400_000;

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/** Next 30-day cycle boundary — rolls forward automatically after each countdown ends. */
function getNextLaunchAt(anchorMs: number, now: number): Date {
  if (now < anchorMs) return new Date(anchorMs);

  const cycleIndex = Math.floor((now - anchorMs) / CYCLE_MS) + 1;
  return new Date(anchorMs + cycleIndex * CYCLE_MS);
}

function getCountdown(anchorMs: number, now: number): Countdown {
  const diff = Math.max(0, getNextLaunchAt(anchorMs, now).getTime() - now);

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

const COUNTDOWN_UNITS = [
  { key: 'days', mobileKey: 'daysMobile', desktopKey: 'daysDesktop' },
  { key: 'hours', mobileKey: 'hoursMobile', desktopKey: 'hoursDesktop' },
  { key: 'minutes', mobileKey: 'minutesMobile', desktopKey: 'minutesDesktop' },
  { key: 'seconds', mobileKey: 'secondsMobile', desktopKey: 'secondsDesktop' },
] as const;

const FEATURE_KEYS = ['f0', 'f1', 'f2'] as const;

const ZERO: Countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export type ComingSoonProps = {
  /** Key prefix inside the `account` namespace, e.g. "tournaments". */
  prefix: string;
  /** Anchor of the first launch window; later cycles roll forward from it. */
  launchAnchor: string;
  heroImage: string;
  backgroundMobile: string;
  backgroundDesktop: string;
  featureIcons: readonly [string, string, string];
};

export default function ComingSoon({
  prefix,
  launchAnchor,
  heroImage,
  backgroundMobile,
  backgroundDesktop,
  featureIcons,
}: ComingSoonProps) {
  const t = useTranslations('account');
  const key = (name: string) => `${prefix}.${name}` as Parameters<typeof t>[0];

  // Countdown starts after mount so server and client markup always match.
  const [countdown, setCountdown] = useState<Countdown>(ZERO);

  useEffect(() => {
    const anchorMs = Date.parse(launchAnchor);
    const tick = () => setCountdown(getCountdown(anchorMs, Date.now()));

    tick();
    const timer = window.setInterval(tick, 1_000);

    return () => window.clearInterval(timer);
  }, [launchAnchor]);

  const shellStyle = {
    '--cs-bg-mobile': `url('${backgroundMobile}')`,
    '--cs-bg-desktop': `url('${backgroundDesktop}')`,
  } as CSSProperties;

  return (
    <div className={styles.shell} style={shellStyle}>
      <div className={styles.root}>
        <div className={styles.hero}>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span>{t(key('comingSoon'))}</span>
          </div>

          <div className={styles.heroImageWrap}>
            <Image
              src={heroImage}
              alt=""
              width={186}
              height={186}
              className={styles.heroImage}
              sizes="186px"
              priority
            />
          </div>

          <h1 className={styles.title}>{t(key('title'))}</h1>

          <p className={styles.descriptionMobile}>{t(key('descMobile'))}</p>

          <p className={styles.descriptionDesktop}>{t(key('descDesktop'))}</p>
        </div>

        <div className={styles.countdown} aria-label={t('comingSoon.countdownLabel')}>
          {COUNTDOWN_UNITS.map((unit, index) => (
            <Fragment key={unit.key}>
              {index > 0 && (
                <span className={styles.countdownSep} aria-hidden="true">
                  :
                </span>
              )}
              <div className={styles.countdownUnit}>
                <span className={styles.countdownValue}>
                  {unit.key === 'days' ? countdown.days : pad(countdown[unit.key])}
                </span>
                <span className={styles.countdownLabelMobile}>
                  {t(`comingSoon.countdown.${unit.mobileKey}` as Parameters<typeof t>[0])}
                </span>
                <span className={styles.countdownLabelDesktop}>
                  {t(`comingSoon.countdown.${unit.desktopKey}` as Parameters<typeof t>[0])}
                </span>
              </div>
            </Fragment>
          ))}
        </div>

        <section className={styles.featureCards} aria-label={t(key('featuresLabel'))}>
          {FEATURE_KEYS.map((featureKey, i) => (
            <article key={featureKey} className={styles.featureCard}>
              <span className={styles.featureIcon} aria-hidden="true">
                {featureIcons[i]}
              </span>
              <h2 className={styles.featureTitle}>{t(key(`${featureKey}.title`))}</h2>
              <p className={styles.featureText}>{t(key(`${featureKey}.desc`))}</p>
            </article>
          ))}
        </section>

        <p className={styles.blogNote}>
          {t.rich(key('blogNote'), {
            link: chunks => (
              <Link href="/blog" className={styles.blogLink}>
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
