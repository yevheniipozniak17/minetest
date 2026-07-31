'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { getOrders } from '@/lib/api/orders';
import { getCurrencies, getProducts } from '@/lib/api/shop';
import type { OrderListItem } from '@/lib/api/types';
import {
  buildProductMeta,
  formatActivityTitle,
  formatOrderAmount,
  type ProductMeta,
} from '@/lib/client/orderDisplay';
import { useServerOnline } from '@/lib/client/useServerOnline';
import { resolvePlayingAsNickname, resolveWelcomeName } from '@/lib/client/profileDisplay';
import { hasPurchaseSuccessPending, clearPurchaseSuccess } from '@/lib/client/purchaseNotification';
import { useProfile } from '@/app/_components/ProfileProvider/ProfileProvider';
import { crystalPackPrice } from '@/lib/pricing';
import {
  CURRENCY_CHANGE_EVENT,
  DEFAULT_CURRENCY,
  getStoredCurrency,
} from '@/lib/client/currency';
import styles from './Dashboard.module.css';

const nf = new Intl.NumberFormat('en-US');

// Real servers (keys from lib/server/gameServers.ts). Soft cap is visual-only.
const SERVERS = [
  { key: 'luckysurvival', name: 'LuckySurvival', meta: 'Java 1.12–1.19', difficulty: 'normal' },
  { key: 'minewars', name: 'MineWars', meta: 'Java 1.12–1.19', difficulty: 'hard' },
  { key: 'calmsky', name: 'CalmSky', meta: 'Java 1.12–1.19', difficulty: 'easy' },
] as const;

type ActivityItem = {
  title: string;
  time: string;
  body?: string;
  amount?: string;
  tone?: 'pos' | 'neg';
  img?: string;
  icon?: string;
  desktopOnly?: boolean;
};

const ACTIVITY_IMAGES = [
  '/profile/activity/act-1.png',
  '/profile/activity/act-2.png',
  '/profile/activity/act-5.png',
  '/profile/img.png',
];

const PACK_AMOUNTS = [500, 1500, 5000];

export default function Dashboard() {
  const locale = useLocale();
  const t = useTranslations('dashboard');
  const { profile } = useProfile();
  const welcomeName = useMemo(() => resolveWelcomeName(profile), [profile]);
  const playingAs = useMemo(
    () => resolvePlayingAsNickname(profile, welcomeName),
    [profile, welcomeName],
  );

  function getRelativeTime(iso: string | undefined): string {
    if (!iso) return t('time.recently');
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return t('time.recently');
    const mins = Math.round((Date.now() - then) / 60_000);
    if (mins < 1) return t('time.justNow');
    if (mins < 60) return t('time.minutesAgo', { mins });
    const hours = Math.round(mins / 60);
    if (hours < 24) return t('time.hoursAgo', { hours });
    const days = Math.round(hours / 24);
    if (days === 1) return t('time.yesterday');
    if (days < 30) return t('time.daysAgo', { days });
    const months = Math.round(days / 30);
    return t('time.monthsAgo', { months });
  }

  function formatNameList(names: string[]): string {
    const and = t('listConnector');
    if (names.length <= 1) return names[0] ?? '';
    if (names.length === 2) return `${names[0]} ${and} ${names[1]}`;
    return `${names.slice(0, -1).join(', ')}, ${and} ${names[names.length - 1]}`;
  }

  function orderToActivity(
    order: OrderListItem,
    meta: Map<string, ProductMeta>,
    index: number,
  ): ActivityItem {
    const items = order.order_item ?? [];
    const first = items[0];
    const currency = first?.currency ?? 'EUR';
    return {
      title: formatActivityTitle(order, meta),
      time: getRelativeTime(first?.created),
      amount: `-${formatOrderAmount(order.total_price, currency)}`,
      tone: 'neg',
      img: ACTIVITY_IMAGES[index % ACTIVITY_IMAGES.length],
    };
  }

  const [rawOrders, setRawOrders] = useState<OrderListItem[]>([]);
  const [productMeta, setProductMeta] = useState<Map<string, ProductMeta>>(new Map());
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const activityReady = productsLoaded && ordersLoaded;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const activity = useMemo(
    () => rawOrders.map((order, index) => orderToActivity(order, productMeta, index)),
    [rawOrders, productMeta],
  );
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [purchaseNotif, setPurchaseNotif] = useState<ActivityItem | null>(null);
  // Currency is read after mount (localStorage) to avoid SSR/CSR mismatch.
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [pricePerCrystal, setPricePerCrystal] = useState<number | null>(null);

  // Live player count for each server (fixed hook call order — correct).
  const lucky = useServerOnline('luckysurvival');
  const mine = useServerOnline('minewars');
  const calm = useServerOnline('calmsky');
  const liveByKey: Record<string, ReturnType<typeof useServerOnline>> = {
    luckysurvival: lucky,
    minewars: mine,
    calmsky: calm,
  };

  const onlineNames = SERVERS.filter(s => liveByKey[s.key].status === 'online').map(s => s.name);
  const activeCount = onlineNames.length;
  const activeHint =
    activeCount > 0
      ? t('stats.onlineHint', { names: onlineNames.join(', ') })
      : t('stats.checkingStatus');

  const offlineNames = SERVERS.filter(s => liveByKey[s.key].status === 'offline').map(s => s.name);
  const allResolved = SERVERS.every(s => liveByKey[s.key].status !== 'loading');
  const offlineKey = allResolved ? offlineNames.join('|') : '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const offlineNotifications = useMemo<ActivityItem[]>(() => {
    if (offlineKey === '') return [];
    const names = offlineKey.split('|');
    const and = t('listConnector');

    function fmtNames(ns: string[]): string {
      if (ns.length <= 1) return ns[0] ?? '';
      if (ns.length === 2) return `${ns[0]} ${and} ${ns[1]}`;
      return `${ns.slice(0, -1).join(', ')}, ${and} ${ns[ns.length - 1]}`;
    }

    let title: string;
    let body: string;
    if (names.length === SERVERS.length) {
      title = t('offline.allTitle');
      body = t('offline.allBody');
    } else if (names.length === 1) {
      title = t('offline.oneTitle', { name: names[0] });
      body = t('offline.oneBody');
    } else {
      title = t('offline.multipleTitle', { count: names.length });
      body = t('offline.multipleBody', { servers: fmtNames(names) });
    }

    return [{ title, body, time: t('time.live'), tone: 'neg' }];
  }, [offlineKey]);

  const notifications = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [...offlineNotifications];
    if (purchaseNotif) items.unshift(purchaseNotif);
    return items;
  }, [offlineNotifications, purchaseNotif]);

  const notifFingerprint = useMemo(() => {
    const parts: string[] = [];
    if (purchaseNotif) parts.push(`purchase:${purchaseNotif.title}:${purchaseNotif.body}`);
    if (offlineKey) parts.push(`offline:${offlineKey}`);
    return parts.join('|');
  }, [purchaseNotif, offlineKey]);

  const [acknowledgedFingerprint, setAcknowledgedFingerprint] = useState('');
  const showNotifDot =
    notifFingerprint !== '' && notifFingerprint !== acknowledgedFingerprint;

  const hasAlert = notifications.some(item => item.tone === 'neg');
  const hasSuccess = notifications.some(item => item.tone === 'pos');
  const notifAriaLabel = showNotifDot
    ? hasAlert
      ? t('notifications.ariaLabelAlert')
      : hasSuccess
        ? t('notifications.ariaLabelSuccess')
        : t('notifications.ariaLabel')
    : t('notifications.ariaLabel');

  useEffect(() => {
    let active = true;

    function resolveCurrency() {
      getCurrencies()
        .then(list => {
          if (!active) return;
          if (list.length === 0) {
            setCurrency(getStoredCurrency());
            return;
          }
          const stored = getStoredCurrency();
          const preferred =
            list.find(c => c.abbr === stored) ||
            list.find(c => c.abbr === DEFAULT_CURRENCY) ||
            list[0];
          setCurrency(preferred.abbr);
        })
        .catch(() => {
          if (active) setCurrency(getStoredCurrency());
        });
    }

    resolveCurrency();
    window.addEventListener(CURRENCY_CHANGE_EVENT, resolveCurrency);
    window.addEventListener('storage', resolveCurrency);

    return () => {
      active = false;
      window.removeEventListener(CURRENCY_CHANGE_EVENT, resolveCurrency);
      window.removeEventListener('storage', resolveCurrency);
    };
  }, []);

  useEffect(() => {
    let active = true;
    setPricePerCrystal(null);
    getProducts({ priced: true, page_size: 100, currency, lang: locale })
      .then(data => {
        if (!active) return;
        const crystal = data.results.find(p => p.category_slug === 'crystals');
        const parsed = crystal?.price != null ? Number(crystal.price) : NaN;
        if (Number.isFinite(parsed) && parsed > 0) setPricePerCrystal(parsed);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [currency, locale]);

  useEffect(() => {
    let active = true;
    getProducts({ page_size: 100, lang: locale })
      .then(data => {
        if (!active) return;
        setProductMeta(buildProductMeta(data.results));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setProductsLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [locale]);

  useEffect(() => {
    let active = true;
    getOrders(1, 50)
      .then(data => {
        if (!active) return;
        setRawOrders(data.results.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setOrdersLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!activityReady || !hasPurchaseSuccessPending()) return;

    const latest = rawOrders[0];
    if (latest) {
      setPurchaseNotif({
        title: t('purchase.completeTitle'),
        body: t('purchase.completeBodyItem', { item: formatActivityTitle(latest, productMeta) }),
        time: t('time.justNow'),
        tone: 'pos',
      });
      return;
    }

    setPurchaseNotif({
      title: t('purchase.completeTitle'),
      body: t('purchase.completeBodyGeneric'),
      time: t('time.justNow'),
      tone: 'pos',
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityReady, rawOrders, productMeta]);

  useEffect(() => {
    if (!notifOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (notifRef.current?.contains(event.target as Node)) return;
      setNotifOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNotifOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [notifOpen]);

  return (
    <div className={styles.shell}>
    <section className={styles.root}>
      <div className={styles.header}>
        <div className={styles.welcome}>
          <span className={styles.eyebrow}>{t('eyebrow')}</span>
          <h1 className={styles.title}>{t('welcomeBack', { name: welcomeName })}</h1>
          {playingAs ? (
            <p className={styles.playingAs}>{t('playingAs', { nick: playingAs })}</p>
          ) : null}
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.notifWrap} ref={notifRef}>
            <button
              type="button"
              className={styles.notif}
              aria-label={notifAriaLabel}
              aria-haspopup="true"
              aria-expanded={notifOpen}
              onClick={() => {
                setNotifOpen(open => {
                  const next = !open;
                  if (next && notifFingerprint) {
                    setAcknowledgedFingerprint(notifFingerprint);
                    clearPurchaseSuccess();
                  }
                  return next;
                });
              }}
            >
              <span
                className={styles.notifIcon}
                style={{
                  maskImage: 'url("/icons/dashboard/notification-2-line.svg")',
                  WebkitMaskImage: 'url("/icons/dashboard/notification-2-line.svg")',
                }}
                aria-hidden="true"
              />
              {showNotifDot && hasAlert && <span className={styles.notifDot} aria-hidden="true" />}
              {showNotifDot && !hasAlert && hasSuccess && (
                <span className={`${styles.notifDot} ${styles.notifDotSuccess}`} aria-hidden="true" />
              )}
            </button>

            {notifOpen && (
              <div className={styles.notifPanel} role="region" aria-label={t('notifications.panelTitle')}>
                <p className={styles.notifPanelTitle}>{t('notifications.panelTitle')}</p>
                {notifications.length === 0 ? (
                  <p className={styles.notifEmpty}>{t('notifications.empty')}</p>
                ) : (
                  <ul className={styles.notifList}>
                    {notifications.map((item, index) => (
                      <li
                        key={`${item.title}-${index}`}
                        className={`${styles.notifItem} ${
                          item.tone === 'neg'
                            ? styles.notifItemAlert
                            : item.tone === 'pos'
                              ? styles.notifItemSuccess
                              : ''
                        }`}
                      >
                        <span className={styles.notifItemTitle}>{item.title}</span>
                        {item.body && (
                          <span className={styles.notifItemBody}>{item.body}</span>
                        )}
                        <span className={styles.notifItemTime}>{item.time}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <Link href="/dashboard/shop" className={styles.topUp}>
            {t('topUp')}
          </Link>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t('stats.activeServers')}</span>
          <span className={styles.statValue}>
            {activeCount} / {SERVERS.length}
          </span>
          <span className={styles.statHint}>{activeHint}</span>
        </div>
        <Image
          src="/profile/1.webp"
          alt=""
          width={200}
          height={200}
          className={styles.statsMascot}
          aria-hidden="true"
        />
      </div>

      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{t('serverStatus.title')}</h2>
        <Link href="/dashboard/servers" className={styles.seeAll}>
          <span>{t('serverStatus.seeAll')}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className={styles.servers}>
        {SERVERS.map(server => {
          const live = liveByKey[server.key];
          const isOnline = live.status === 'online';

          return (
            <article key={server.key} className={styles.server}>
              <div className={styles.serverTop}>
                <div className={styles.serverName}>
                  <span
                    className={`${styles.dot} ${isOnline ? '' : styles.dotOffline}`}
                    aria-hidden="true"
                  />
                  <span>{server.name}</span>
                </div>
                <span
                  className={`${styles.statusBadge} ${isOnline ? '' : styles.statusBadgeOffline}`}
                >
                  {isOnline ? t('serverStatus.online') : t('serverStatus.offline')}
                </span>
              </div>

              <p className={styles.serverDesc}>
                {t(`servers.${server.key}.description`)}
              </p>

              <div className={styles.playersRow}>
                <span className={styles.playersLabel}>{t('serverStatus.difficulty')}</span>
                <span
                  className={`${styles.playersValue} ${
                    styles[
                      `difficulty${server.difficulty.charAt(0).toUpperCase()}${server.difficulty.slice(1)}`
                    ]
                  }`}
                >
                  {t(`serverStatus.difficultyLevels.${server.difficulty}`)}
                </span>
              </div>

              <div className={styles.serverFoot}>
                <span className={styles.serverMeta}>{server.meta}</span>
                <Link href="/dashboard/servers" className={styles.joinButton}>
                  <span>{t('serverStatus.join')}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.bottom}>
        <div className={styles.activity}>
          <div className={styles.activityHead}>
            <h2 className={styles.activityTitle}>{t('activity.title')}</h2>
            <Link href="/dashboard/history" className={styles.viewAll}>
              {t('activity.viewAll')}
            </Link>
          </div>

          {!activityReady && (
            <p className={styles.activityEmpty}>{t('activity.loading')}</p>
          )}

          {activityReady && activity.length === 0 && (
            <p className={styles.activityEmpty}>
              {t('activity.empty')}
            </p>
          )}

          {activityReady &&
            activity.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className={`${styles.activityRow} ${item.desktopOnly ? styles.desktopOnly : ''}`}
            >
              <span className={styles.activityIcon}>
                {item.img ? (
                  <Image src={item.img} alt="" width={28} height={28} className={styles.activityImg} />
                ) : (
                  <span
                    className={styles.activityMask}
                    style={{
                      maskImage: `url("/icons/dashboard/${item.icon}.svg")`,
                      WebkitMaskImage: `url("/icons/dashboard/${item.icon}.svg")`,
                    }}
                    aria-hidden="true"
                  />
                )}
              </span>
              <span className={styles.activityText}>
                <span className={styles.activityRowTitle}>{item.title}</span>
                <span className={styles.activityTime}>{item.time}</span>
              </span>
              {item.amount && (
                <span
                  className={`${styles.activityAmount} ${
                    item.tone === 'neg' ? styles.amountNeg : styles.amountPos
                  }`}
                >
                  {item.amount}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className={styles.crystals}>
          <span className={styles.crystalsLabel}>{t('crystals.label')}</span>
          <h2 className={styles.crystalsTitle}>{t('crystals.title')}</h2>
          <p className={styles.crystalsText}>
            {t('crystals.text')}
          </p>

          <div className={styles.packs}>
            {PACK_AMOUNTS.map(amount => (
              <div key={amount} className={styles.pack}>
                <span className={styles.packLeft}>
                  <Image src="/profile/img.png" alt="" width={16} height={20} className={styles.packIcon} />
                  <span className={styles.packAmount}>{nf.format(amount)}</span>
                </span>
                <span className={styles.packPrice}>
                  {formatOrderAmount(crystalPackPrice(amount, pricePerCrystal, currency), currency)}
                </span>
              </div>
            ))}
          </div>

          <Link href="/dashboard/shop" className={styles.openShop}>
            {t('crystals.openShop')}
          </Link>
        </div>
      </div>
    </section>
    </div>
  );
}
