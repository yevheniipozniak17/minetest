'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  getOrders,
  downloadOrderBill,
  openOrderBill,
  orderHasBill,
  mapOrderStatus,
  type OrderPaymentStatus,
} from '@/lib/api/orders';
import { getProducts } from '@/lib/api/shop';
import type { OrderListItem } from '@/lib/api/types';
import {
  buildProductMeta,
  formatOrderAmount,
  formatOrderLineItem,
  type ProductMeta,
} from '@/lib/client/orderDisplay';
import { buildPageNumbers } from '@/lib/pagination/buildPageNumbers';
import styles from './PurchaseHistory.module.css';

const ORDERS_PER_PAGE = 10;

function OpenReceiptIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="13"
      height="14"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden
    >
      <path
        d="M4.5 1.5H11.5V8.5M11.5 1.5L1.5 11.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Order = {
  id: string;
  date: string;
  player: string;
  server: string;
  total: string;
  status: OrderPaymentStatus;
  items: string[];
  hasBill: boolean;
};

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
});

const nf = new Intl.NumberFormat('en-US');

function mapOrder(order: OrderListItem, meta: Map<string, ProductMeta>): Order {
  const first = order.order_item?.[0];
  const created = first?.created ? new Date(first.created) : null;
  const currency = first?.currency ?? 'EUR';

  return {
    id: order.id,
    date: created ? dateFmt.format(created).replace(',', '') : '—',
    player: order.user_nickname ?? '—',
    server: order.server ?? '—',
    total: formatOrderAmount(order.total_price, currency),
    status: mapOrderStatus(order),
    items: (order.order_item ?? []).map(oi =>
      formatOrderLineItem(oi.product_id, oi.image_name, oi.amount, meta),
    ),
    hasBill: orderHasBill(order),
  };
}

const PERIOD_KEYS = ['last90', 'last30', 'last7', 'allTime'] as const;
type PeriodKey = (typeof PERIOD_KEYS)[number];

const PERIOD_DAYS: Record<Exclude<PeriodKey, 'allTime'>, number> = {
  last7: 7,
  last30: 30,
  last90: 90,
};

function getOrderTimestamp(order: OrderListItem): number {
  const times = (order.order_item ?? [])
    .map(item => new Date(item.created).getTime())
    .filter(time => !Number.isNaN(time));
  return times.length ? Math.max(...times) : 0;
}

function orderMatchesPeriod(order: OrderListItem, period: PeriodKey): boolean {
  if (period === 'allTime') return true;
  const ts = getOrderTimestamp(order);
  if (!ts) return false;
  const cutoff = Date.now() - PERIOD_DAYS[period] * 24 * 60 * 60 * 1000;
  return ts >= cutoff;
}

function splitDate(date: string) {
  const parts = date.split(' ');
  if (parts.length >= 3) {
    return { month: parts[0], dayYear: `${parts[1]} ${parts[2]}` };
  }
  return { month: date, dayYear: '' };
}

export default function PurchaseHistory() {
  const locale = useLocale();
  const t = useTranslations('account');
  const [period, setPeriod] = useState<PeriodKey>('last90');
  const [periodOpen, setPeriodOpen] = useState(false);
  const [rawOrders, setRawOrders] = useState<OrderListItem[]>([]);
  const [productMeta, setProductMeta] = useState<Map<string, ProductMeta>>(new Map());
  const [loaded, setLoaded] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const periodLabels: Record<PeriodKey, string> = {
    last90: t('ph.period.last90'),
    last30: t('ph.period.last30'),
    last7: t('ph.period.last7'),
    allTime: t('ph.period.allTime'),
  };

  const statusLabels: Record<OrderPaymentStatus, string> = {
    paid: t('ph.status.paid'),
    refund: t('ph.status.refund'),
    failed: t('ph.status.failed'),
  };
  const statusTableLabels: Record<OrderPaymentStatus, string> = {
    paid: t('ph.statusShort.paid'),
    refund: t('ph.statusShort.refund'),
    failed: t('ph.statusShort.failed'),
  };

  async function handleOpenReceipt(orderId: string) {
    setOpeningId(orderId);
    setDownloadError(null);
    try {
      await openOrderBill(orderId);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : t('ph.error.openFallback'));
    } finally {
      setOpeningId(null);
    }
  }

  async function handleDownloadReceipt(orderId: string) {
    setDownloadingId(orderId);
    setDownloadError(null);
    try {
      await downloadOrderBill(orderId);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : t('ph.error.downloadFallback'));
    } finally {
      setDownloadingId(null);
    }
  }

  useEffect(() => {
    let active = true;
    getOrders(1, 50)
      .then(data => {
        if (!active) return;
        setRawOrders(data.results);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  // Каталог товарів: даємо позиціям реальну назву та визначаємо кристали за категорією.
  useEffect(() => {
    let active = true;
    getProducts({ page_size: 100, lang: locale })
      .then(data => {
        if (!active) return;
        setProductMeta(buildProductMeta(data.results));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [locale]);

  const filteredOrders = useMemo(
    () => rawOrders.filter(order => orderMatchesPeriod(order, period)),
    [rawOrders, period],
  );

  const orders = useMemo(
    () => filteredOrders.map(order => mapOrder(order, productMeta)),
    [filteredOrders, productMeta],
  );

  const totalPages = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE));
  const activePage = Math.min(page, totalPages);
  const showPagination = orders.length > ORDERS_PER_PAGE;
  const pageNumbers = buildPageNumbers(totalPages, activePage);
  const paginatedOrders = useMemo(() => {
    const start = (activePage - 1) * ORDERS_PER_PAGE;
    return orders.slice(start, start + ORDERS_PER_PAGE);
  }, [orders, activePage]);

  useEffect(() => {
    setPage(1);
  }, [period]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    document.querySelector(`.${styles.root}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Статистика рахується з відфільтрованих замовлень за обраний період.
  const stats = useMemo(() => {
    let spent = 0;
    let crystals = 0;
    let privileges = 0;
    let currency = 'EUR';

    for (const order of filteredOrders) {
      // Лише успішні оплачені замовлення; refund і failed не враховуємо у витратах та товарах.
      if (mapOrderStatus(order) !== 'paid') continue;
      spent += Number(order.total_price) || 0;
      for (const item of order.order_item ?? []) {
        if (item.currency) currency = item.currency;
        // Кристали визначаємо за категорією товару (image_name з бекенду — null).
        if (productMeta.get(item.product_id)?.isCrystal) {
          crystals += item.amount;
        } else {
          privileges += 1;
        }
      }
    }

    const spentFmt = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    });

    return [
      {
        labelMobile: t('ph.stat.ordersMobile'),
        labelDesktop: t('ph.stat.ordersDesktop'),
        value: nf.format(filteredOrders.length),
        icon: '/profile/purchase_history/1.svg',
      },
      {
        labelMobile: t('ph.stat.spentMobile'),
        labelDesktop: t('ph.stat.spentDesktop'),
        value: spentFmt.format(spent),
        icon: '/profile/purchase_history/2.svg',
      },
      {
        labelMobile: t('ph.stat.crystalsMobile'),
        labelDesktop: t('ph.stat.crystalsDesktop'),
        value: nf.format(crystals),
        icon: '/profile/purchase_history/3.svg',
      },
      {
        labelMobile: t('ph.stat.privilegesMobile'),
        labelDesktop: t('ph.stat.privilegesDesktop'),
        value: nf.format(privileges),
        icon: '/profile/purchase_history/4.svg',
      },
    ];
  }, [filteredOrders, productMeta, t]);

  const hasNoOrders = loaded && rawOrders.length === 0;
  const hasNoOrdersInPeriod = loaded && rawOrders.length > 0 && orders.length === 0;

  const periodControl = (
    <div className={styles.periodWrap}>
      <button
        type="button"
        className={styles.periodBtn}
        onClick={() => setPeriodOpen(open => !open)}
        aria-expanded={periodOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.periodLabel}>
          <span className={styles.periodPrefix}>{t('ph.periodPrefix')}</span>
          <span className={styles.periodValue}>{periodLabels[period]}</span>
        </span>
        <span className={styles.periodCaret} aria-hidden>
          ▾
        </span>
      </button>
      {periodOpen && (
        <ul className={styles.periodMenu} role="listbox" aria-label={t('ph.periodMenuLabel')}>
          {PERIOD_KEYS.map(key => (
            <li key={key} role="option" aria-selected={period === key}>
              <button
                type="button"
                className={styles.periodOption}
                onClick={() => {
                  setPeriod(key);
                  setPeriodOpen(false);
                }}
              >
                {periodLabels[key]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className={styles.shell}>
      <div className={styles.root}>
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.eyebrow}>{t('ph.eyebrow')}</span>
            <h1 className={styles.title}>{t('ph.title')}</h1>
            <p className={styles.subtitle}>{t('ph.subtitle')}</p>
          </div>
          <div className={styles.toolbar}>
            {periodControl}
          </div>
        </header>

        <div className={styles.periodMobile}>{periodControl}</div>

        {downloadError ? <p className={styles.stateNote}>{downloadError}</p> : null}

        <div className={styles.stats}>
          {stats.map(stat => (
            <div key={stat.labelDesktop} className={styles.statCard}>
              <div className={styles.statIconWrap}>
                <Image
                  src={stat.icon}
                  alt=""
                  width={24}
                  height={24}
                  className={styles.statIcon}
                  aria-hidden
                />
              </div>
              <div className={styles.statCopy}>
                <span className={styles.statLabelMobile}>{stat.labelMobile}</span>
                <span className={styles.statLabelDesktop}>{stat.labelDesktop}</span>
                <span className={styles.statValueMobile}>{stat.value}</span>
                <span className={styles.statValueDesktop}>{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {!loaded ? (
          <p className={styles.stateNote}>{t('ph.loading')}</p>
        ) : hasNoOrders ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>{t('ph.empty.title')}</p>
            <p className={styles.emptyText}>{t('ph.empty.text')}</p>
            <Link href="/dashboard/shop" className={styles.emptyCta}>
              {t('ph.empty.cta')}
            </Link>
          </div>
        ) : hasNoOrdersInPeriod ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>{t('ph.emptyPeriod.title')}</p>
            <p className={styles.emptyText}>{t('ph.emptyPeriod.text')}</p>
          </div>
        ) : (
          <>
            <ul className={styles.orderList}>
              {paginatedOrders.map(order => (
                <li key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHead}>
                    <div className={styles.orderMeta}>
                      <p className={styles.orderDate}>{order.date}</p>
                      <p className={styles.orderContext}>
                        {order.player} • {order.server}
                      </p>
                    </div>
                    <div className={styles.orderTotal}>
                      <p className={styles.orderPrice}>{order.total}</p>
                      <span className={`${styles.statusBadge} ${styles[`status_${order.status}`]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                  </div>

                  <ul className={styles.itemList}>
                    {order.items.map(item => (
                      <li key={item} className={styles.itemRow}>
                        <span className={styles.itemDot} aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.orderActions}>
                    <button
                      type="button"
                      className={`${styles.openBtn}${openingId === order.id ? ` ${styles.openBtnLoading}` : ''}`}
                      aria-label={
                        openingId === order.id ? t('ph.btn.opening') : t('ph.btn.openAriaLabel')
                      }
                      disabled={!order.hasBill || openingId === order.id || downloadingId === order.id}
                      onClick={() => handleOpenReceipt(order.id)}
                    >
                      {openingId !== order.id ? (
                        <OpenReceiptIcon className={styles.openBtnIcon} />
                      ) : null}
                      <span className={styles.openBtnLabel}>
                        {openingId === order.id ? t('ph.btn.opening') : t('ph.btn.open')}
                      </span>
                    </button>
                    <button
                      type="button"
                      className={styles.receiptBtn}
                      disabled={!order.hasBill || downloadingId === order.id || openingId === order.id}
                      onClick={() => handleDownloadReceipt(order.id)}
                    >
                      <span>{downloadingId === order.id ? t('ph.btn.downloading') : t('ph.btn.receipt')}</span>
                      <Image
                        src="/profile/purchase_history/5.svg"
                        alt=""
                        width={13}
                        height={14}
                        className={styles.receiptIcon}
                        aria-hidden
                      />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.table} role="table" aria-label={t('ph.table.ariaLabel')}>
              <div className={styles.tableHead} role="row">
                <span className={styles.colDate} role="columnheader">
                  {t('ph.col.date')}
                </span>
                <span className={styles.colItems} role="columnheader">
                  {t('ph.col.items')}
                </span>
                <span className={styles.colServer} role="columnheader">
                  {t('ph.col.server')}
                </span>
                <span className={styles.colNickname} role="columnheader">
                  {t('ph.col.nickname')}
                </span>
                <span className={styles.colAmount} role="columnheader">
                  {t('ph.col.amount')}
                </span>
                <span className={styles.colStatus} role="columnheader">
                  {t('ph.col.status')}
                </span>
                <span className={styles.colReceipt} role="columnheader">
                  {t('ph.col.receipt')}
                </span>
              </div>

              {paginatedOrders.map(order => {
                const { month, dayYear } = splitDate(order.date);

                return (
                  <div key={order.id} className={styles.tableRow} role="row">
                    <div className={styles.colDate} role="cell">
                      <p className={styles.tableDateMonth}>{month}</p>
                      <p className={styles.tableDateDay}>{dayYear}</p>
                    </div>
                    <div className={styles.colItems} role="cell">
                      <ul className={styles.tableItemList}>
                        {order.items.map(item => (
                          <li key={item} className={styles.tableItemRow}>
                            <span className={styles.itemDot} aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.colServer} role="cell">
                      <span className={styles.serverBadge}>{order.server}</span>
                    </div>
                    <div className={styles.colNickname} role="cell">
                      <span className={styles.tableNickname}>{order.player}</span>
                    </div>
                    <div className={styles.colAmount} role="cell">
                      <span className={styles.tableAmount}>{order.total}</span>
                    </div>
                    <div className={styles.colStatus} role="cell">
                      <span
                        className={`${styles.statusBadge} ${styles.statusBadgeDot} ${styles[`status_${order.status}`]}`}
                        title={statusLabels[order.status]}
                      >
                        <span className={styles.statusDot} aria-hidden />
                        {statusTableLabels[order.status]}
                      </span>
                    </div>
                    <div className={styles.colReceipt} role="cell">
                      <div className={styles.tableActions}>
                        <button
                          type="button"
                          className={styles.tableOpenBtn}
                          disabled={!order.hasBill || openingId === order.id || downloadingId === order.id}
                          onClick={() => handleOpenReceipt(order.id)}
                        >
                          {openingId === order.id ? t('ph.btn.opening') : t('ph.btn.open')}
                        </button>
                        <button
                          type="button"
                          className={styles.tableReceiptBtn}
                          aria-label={t('ph.btn.downloadAriaLabel')}
                          disabled={!order.hasBill || downloadingId === order.id || openingId === order.id}
                          onClick={() => handleDownloadReceipt(order.id)}
                        >
                          <Image
                            src="/profile/purchase_history/5.svg"
                            alt=""
                            width={13}
                            height={14}
                            className={styles.receiptIcon}
                            aria-hidden
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {showPagination ? (
              <nav className={styles.pagination} aria-label={t('ph.pagination.ariaLabel')}>
                <div className={styles.pagRow}>
                  <button
                    type="button"
                    className={styles.pagArrow}
                    aria-label={t('ph.pagination.prevAriaLabel')}
                    disabled={activePage === 1}
                    onClick={() => handlePageChange(activePage - 1)}
                  >
                    ←
                  </button>

                  {pageNumbers.map((pageNumber, index) => {
                    if (pageNumber === '…') {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className={styles.pagEllipsis}
                          aria-hidden="true"
                        >
                          …
                        </span>
                      );
                    }

                    const isActive = pageNumber === activePage;

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        className={`${styles.pagNumber} ${isActive ? styles.pagNumberActive : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    className={`${styles.pagArrow} ${styles.pagArrowNext}`}
                    aria-label={t('ph.pagination.nextAriaLabel')}
                    disabled={activePage === totalPages}
                    onClick={() => handlePageChange(activePage + 1)}
                  >
                    →
                  </button>
                </div>
              </nav>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
