'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import PrivilegesCards from '@/app/_components/PrivilegesCards/PrivilegesCards';
import { isAxiosError } from 'axios';
import { getCurrencies, getProducts } from '@/lib/api/shop';
import type { Currency } from '@/lib/api/types';
import { addToCart, changeItemAmount, getOrderItems } from '@/lib/api/cart';
import {
  DEFAULT_CURRENCY,
  getStoredCurrency,
  setStoredCurrency,
} from '@/lib/client/currency';
import { notifyCartUpdated } from '@/lib/client/cartCount';
import {
  buildFallbackPrivilegePrices,
  crystalsToCurrency,
} from '@/lib/pricing';
import CurrencySelect from './CurrencySelect/CurrencySelect';
import styles from './Shop.module.css';

const TABS = ['All', 'Crystals', 'Privileges'] as const;
type Tab = (typeof TABS)[number];

const MIN = 10;
const MAX = 15_000;
const STEP = 10;
// Hard backend limit per line item (AddToCart.amount max).
const BACKEND_MAX_QTY = 20_000;

type CrystalPack = {
  amount: number;
  img: string;
  save?: number;
  popular?: boolean;
};

const PACKS: CrystalPack[] = [
  { amount: 500, img: '/profile/shop/crystal-1.webp' },
  { amount: 1500, img: '/profile/shop/crystal-2.webp' },
  {
    amount: 5000,
    img: '/profile/shop/crystal-3.webp',
    popular: true,
  },
  { amount: 15000, img: '/profile/shop/crystal-4.webp' },
];

const PRIVILEGE_TITLES = [
  'Silver',
  'Supreme',
  'Wither',
  'Hero',
  'Avenger',
  'Legend',
  'Phantom',
  'Phoenix',
] as const;

const nf = new Intl.NumberFormat('en-US');

function crystalsPrice(
  amount: number,
  pricePerCrystal: number | null,
  currency: string,
): string {
  const value =
    pricePerCrystal != null
      ? amount * pricePerCrystal
      : crystalsToCurrency(amount, currency);
  return value.toFixed(2);
}

function formatSliderLabel(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    return Number.isInteger(k) ? `${k}K` : `${k.toFixed(1).replace(/\.0$/, '')}K`;
  }
  return nf.format(value);
}

const SLIDER_TICKS = [0, 0.25, 0.5, 0.75, 1].map(
  t => Math.round(MIN + t * (MAX - MIN)),
);

export default function Shop() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('store');
  const isDashboard = pathname?.startsWith('/dashboard') ?? false;
  const [tab, setTab] = useState<Tab>('All');
  const [amount, setAmount] = useState(2500);
  const [amountInput, setAmountInput] = useState('2500');

  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const handleCurrencyChange = useCallback((next: string) => {
    setCurrency(next);
    setStoredCurrency(next);
  }, []);

  const [productIdByTitle, setProductIdByTitle] = useState<Map<string, string>>(new Map());
  const [crystalId, setCrystalId] = useState<string | null>(null);
  const [pricePerCrystal, setPricePerCrystal] = useState<number | null>(null);
  const [privilegePrices, setPrivilegePrices] = useState<Record<string, string>>({});
  const [addingKey, setAddingKey] = useState<string | null>(null);
  const [doneKeys, setDoneKeys] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const DONE_RESET_MS = 800;

  const percent = ((amount - MIN) / (MAX - MIN)) * 100;
  const price = useMemo(
    () => crystalsPrice(amount, pricePerCrystal, currency),
    [amount, pricePerCrystal, currency],
  );

  const showCrystals = tab === 'All' || tab === 'Crystals';
  const showPrivileges = tab === 'All' || tab === 'Privileges';

  const crystalAddLabel = (key: string, full = false) => {
    if (addingKey === key) return t('shop_adding');
    if (doneKeys.has(key)) return t('shop_added');
    return full ? t('shop_addFull') : t('shop_addShort');
  };

  const markCrystalAdded = useCallback((key: string) => {
    setDoneKeys(prev => new Set(prev).add(key));

    const existing = doneTimers.current.get(key);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      setDoneKeys(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      doneTimers.current.delete(key);
    }, DONE_RESET_MS);

    doneTimers.current.set(key, timer);
  }, []);

  const applyAmount = useCallback((next: number) => {
    const clamped = Math.min(MAX, Math.max(MIN, Math.round(next)));
    setAmount(clamped);
    setAmountInput(String(clamped));
  }, []);

  const step = (dir: 1 | -1) => applyAmount(amount + dir * STEP);

  const onAmountInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 5);
    setAmountInput(digits);
    if (digits) setAmount(Math.min(MAX, Math.max(1, Number(digits))));
  };

  const onAmountBlur = () => applyAmount(amountInput ? Number(amountInput) : MIN);

  const flash = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
      doneTimers.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    let active = true;
    getCurrencies()
      .then(list => {
        if (!active || list.length === 0) return;
        setCurrencies(list);
        const stored = getStoredCurrency();
        const preferred =
          list.find(c => c.abbr === stored) ||
          list.find(c => c.abbr === DEFAULT_CURRENCY);
        setCurrency(preferred ? preferred.abbr : list[0].abbr);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    getProducts({ page_size: 100, lang: locale })
      .then(data => {
        if (!active) return;
        const map = new Map<string, string>();
        let crystal: string | null = null;
        for (const p of data.results) {
          if (p.title) map.set(p.title.toLowerCase(), p.id);
          if (p.category_slug === 'crystals') crystal = p.id;
        }
        setProductIdByTitle(map);
        setCrystalId(crystal);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [locale]);

  useEffect(() => {
    if (!isDashboard) {
      setPrivilegePrices({});
      return;
    }
    let active = true;
    setPricePerCrystal(null);
    setPrivilegePrices(buildFallbackPrivilegePrices(currency));
    getProducts({ priced: true, page_size: 100, currency, lang: locale })
      .then(data => {
        if (!active) return;
        const crystal = data.results.find(p => p.category_slug === 'crystals');
        const parsed = crystal?.price != null ? Number(crystal.price) : NaN;
        if (Number.isFinite(parsed) && parsed > 0) setPricePerCrystal(parsed);

        const prices = buildFallbackPrivilegePrices(currency);
        for (const p of data.results) {
          if (p.category_slug === 'crystals' || !p.title || p.price == null) continue;
          const value = Number(p.price);
          if (!Number.isFinite(value)) continue;
          const formatted = `${value.toFixed(2)} ${currency}`;
          const tier =
            PRIVILEGE_TITLES.find(t => t.toLowerCase() === p.title!.toLowerCase()) ?? p.title;
          prices[tier] = formatted;
        }
        setPrivilegePrices(prices);
      })
      .catch(() => {
        if (!active) return;
        setPrivilegePrices(buildFallbackPrivilegePrices(currency));
      });
    return () => {
      active = false;
    };
  }, [isDashboard, currency, locale]);

  const addCrystals = useCallback(
    async (qty: number) => {
      if (!crystalId || addingKey) return;
      const key = `crystals-${qty}`;
      setAddingKey(key);
      try {
        await addToCart({ amount: qty, item_id: crystalId, currency });
        notifyCartUpdated();
        markCrystalAdded(key);
        flash(t('shop_toastAdded', { amount: nf.format(qty) }));
      } catch (err) {
        if (isAxiosError(err) && (err.response?.status === 403 || err.response?.status === 400)) {
          try {
            const items = await getOrderItems();
            const existing = items.find(it => it.product_id === crystalId);
            const nextQty = Math.min(BACKEND_MAX_QTY, (existing?.amount ?? 0) + qty);
            await changeItemAmount(crystalId, nextQty);
            notifyCartUpdated();
            markCrystalAdded(key);
            flash(t('shop_toastUpdated', { amount: nf.format(qty), total: nf.format(nextQty) }));
            return;
          } catch {
            // fall through to generic error
          }
        }
        flash(t('shop_toastError'));
      } finally {
        setAddingKey(null);
      }
    },
    [crystalId, addingKey, currency, flash, markCrystalAdded, t]
  );

  const addPrivilege = useCallback(
    async (title: string) => {
      const id = productIdByTitle.get(title.toLowerCase());
      if (!id) {
        flash(t('shop_toastUnavailable'));
        return;
      }
      try {
        await addToCart({ amount: 1, item_id: id, currency });
        notifyCartUpdated();
        flash(t('shop_toastPrivAdded', { title }));
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 403) {
          flash(t('shop_toastPrivExists', { title }));
          return;
        }
        flash(t('shop_toastError'));
        throw new Error('add-failed');
      }
    },
    [productIdByTitle, currency, flash, t]
  );

  return (
    <div className={styles.shell}>
    <div className={styles.root}>
      <header className={styles.shopHeader}>
        <div className={styles.hdrTop}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>{t('shop_eyebrow')}</span>
            <h1 className={styles.title}>{t('shop_heading')}</h1>
            <p className={styles.subtitle}>
              {t('shop_subtitle')}
              <span className={styles.subtitleExtra}>
                {' '}
                {t('shop_subtitleExtra')}
              </span>
            </p>
          </div>

          <CurrencySelect
            value={currency}
            currencies={currencies}
            onChange={handleCurrencyChange}
          />
        </div>

        <div className={styles.tabs} role="tablist">
          {TABS.map(item => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              className={`${styles.tab} ${tab === item ? styles.tabActive : ''}`}
              onClick={() => setTab(item)}
            >
              {item === 'All' ? (
                <>
                  {t('shop_tabAll')}<span className={styles.tabSuffix}>{t('shop_tabAllItems')}</span>
                </>
              ) : item === 'Crystals' ? (
                t('shop_tabCrystals')
              ) : (
                t('shop_tabPrivileges')
              )}
            </button>
          ))}
        </div>
      </header>

      {showCrystals && (
        <>
          <div className={styles.crysTitle}>
            <div className={styles.crysTitleText}>
              <h2 className={styles.crysHeading}>{t('shop_crysHeading')}</h2>
              <p className={styles.crysSub}>{t('shop_crysSub')}</p>
            </div>
            <p className={styles.bestValue}>{t('shop_bestValue')}</p>
          </div>

          <div className={styles.crysRow}>
            <div className={styles.calc}>
              <span className={styles.calcHead}>{t('shop_customAmount')}</span>
              <p className={styles.calcDesc}>{t('shop_customDesc')}</p>

              <div className={styles.stepper}>
                <button
                  type="button"
                  className={styles.stepBtn}
                  onClick={() => step(-1)}
                  aria-label="Decrease"
                >
                  −
                </button>
                <div className={styles.stepValue}>
                  <input
                    type="text"
                    inputMode="numeric"
                    className={`${styles.stepAmount} ${styles.stepInput}`}
                    value={amountInput}
                    onChange={e => onAmountInput(e.target.value)}
                    onBlur={onAmountBlur}
                    onFocus={e => e.target.select()}
                    aria-label="Crystals amount"
                  />
                  <span className={styles.stepUnit}>{t('shop_unit')}</span>
                </div>
                <button
                  type="button"
                  className={`${styles.stepBtn} ${styles.stepBtnPlus}`}
                  onClick={() => step(1)}
                  aria-label="Increase"
                >
                  +
                </button>
              </div>

              <div className={styles.slider}>
                <input
                  type="range"
                  min={MIN}
                  max={MAX}
                  step={STEP}
                  value={amount}
                  onChange={e => applyAmount(Number(e.target.value))}
                  className={styles.range}
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) ${percent}%, rgba(255, 255, 255, 0.08) ${percent}%)`,
                  }}
                  aria-label="Crystals amount"
                />
                <div className={styles.sliderLabels}>
                  {SLIDER_TICKS.map(value => (
                    <span key={value}>{formatSliderLabel(value)}</span>
                  ))}
                </div>
              </div>

              <div className={styles.calcPrice}>
                <div className={styles.calcTotal}>
                  <span className={styles.calcTotalLabel}>{t('shop_total')}</span>
                  <span className={styles.calcPriceValue}>
                    {price} {currency}
                  </span>
                </div>
                <button
                  type="button"
                  className={`${styles.addAccent} ${
                    doneKeys.has(`crystals-${amount}`) ? styles.addAccentDone : ''
                  }`}
                  onClick={() => addCrystals(amount)}
                  disabled={!crystalId || addingKey === `crystals-${amount}`}
                >
                  <span className={styles.addGlyph} aria-hidden>
                    ◆
                  </span>
                  <span className={styles.addTextShort}>
                    {crystalAddLabel(`crystals-${amount}`)}
                  </span>
                  <span className={styles.addTextFull}>
                    {crystalAddLabel(`crystals-${amount}`, true)}
                  </span>
                </button>
              </div>

              <Image
                src="/profile/shop/crystal-2.webp"
                alt=""
                width={115}
                height={115}
                className={styles.calcImg}
                aria-hidden
              />
            </div>

            <div className={styles.packsCol}>
              <h2 className={styles.packsHeading}>{t('shop_packsHeading')}</h2>
              <div className={styles.packs}>
                {PACKS.map(pack => {
                  const packKey = `crystals-${pack.amount}`;
                  const packDone = doneKeys.has(packKey);
                  const packPending = addingKey === packKey;

                  return (
                  <div
                    key={pack.amount}
                    className={`${styles.pack} ${pack.popular ? styles.packPopular : ''}`}
                  >
                    {pack.popular && (
                      <span className={styles.popular}>
                        <span className={styles.popPrefix}>{t('shop_mostPrefix')}</span>
                        {t('shop_popularSuffix')}
                      </span>
                    )}
                    {pack.save && (
                      <div className={styles.saveWrap}>
                        <span className={styles.save}>
                          <span className={styles.savePrefix}>{t('shop_savePrefix')}</span>
                          {pack.save}%
                        </span>
                      </div>
                    )}
                    <span className={styles.packAmount}>
                      {nf.format(pack.amount)}
                      <span className={styles.packUnit}>{t('shop_packUnit')}</span>
                    </span>
                    <div className={styles.packPriceRow}>
                      <span className={styles.packPrice}>
                        {crystalsPrice(pack.amount, pricePerCrystal, currency)} {currency}
                      </span>
                      <button
                        type="button"
                        className={`${styles.packAdd} ${packDone ? styles.packAddDone : ''}`}
                        onClick={() => addCrystals(pack.amount)}
                        disabled={!crystalId || packPending}
                      >
                        {crystalAddLabel(packKey)}
                      </button>
                    </div>
                    <Image
                      src={pack.img}
                      alt=""
                      width={140}
                      height={140}
                      className={styles.packImg}
                      aria-hidden
                    />
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {showPrivileges && (
        <>
          <div className={styles.prTitle}>
            <h2 className={styles.prHeading}>{t('shop_privHeading')}</h2>
            <p className={styles.prNote}>{t('shop_privNote')}</p>
          </div>
          <div className={styles.privilegesFull}>
            <PrivilegesCards
              compact={isDashboard}
              pricesByTitle={privilegePrices}
              onAddToCart={addPrivilege}
            />
          </div>
        </>
      )}
    </div>
    {notice && (
      <div className={styles.toast} role="status" aria-live="polite">
        {notice}
      </div>
    )}
    </div>
  );
}
