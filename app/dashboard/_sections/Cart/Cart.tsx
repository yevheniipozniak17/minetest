'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { getOrderItems, changeItemAmount, removeFromCart } from '@/lib/api/cart';
import { getServers, getProducts } from '@/lib/api/shop';
import { createPayment } from '@/lib/api/payment';
import { applyPromo } from '@/lib/api/promos';
import type { OrderItem } from '@/lib/api/types';
import { DEFAULT_CURRENCY, formatMoney } from '@/lib/client/currency';
import { notifyCartUpdated } from '@/lib/client/cartCount';
import {
  savePendingPayment,
  getPendingPayment,
  clearPendingPayment,
  pendingPaymentRemainingMs,
  markPaymentRedirect,
  PAYMENT_RETURN_FLAG,
  type PendingPayment,
} from '@/lib/client/pendingPayment';
import { useProfile } from '@/app/_components/ProfileProvider/ProfileProvider';
import styles from './Cart.module.css';

type Row = {
  id: string;
  productId: string;
  title: string;
  rawCurrency: string | null;
  unitPrice: number;
  qty: number;
  lineTotal: number;
  currency: string;
  image: string;
  fromApi: boolean;
};

const CART_IMAGES = ['/profile/cart/1.webp', '/profile/cart/2.webp', '/profile/cart/3.webp'];
// Реальні сервери з ТЗ (бекенд /core/servers/ поки повертає []).
const FALLBACK_SERVERS = ['LuckySurvival', 'MineWars', 'CalmSky'];
// Верхня межа кількості за позицію — узгоджено з бекендом (AddToCart.amount max 20000).
const MAX_QTY = 15_000;

// Назва сервера бекенду ("LuckySurvival") → ключ ігрового моніторингу ("luckysurvival").
function serverKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// create_payment може повернути URL платіжки під різними іменами полів —
// дістаємо перший валідний, щоб коректно зредіректити на оплату.
function extractPaymentUrl(data: unknown): string | null {
  if (typeof data === 'string') {
    return /^https?:\/\//.test(data) ? data : null;
  }
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const keys = [
      'payment_url',
      'paymentUrl',
      'redirect_url',
      'redirectUrl',
      'checkout_url',
      'checkoutUrl',
      'url',
      'link',
    ];
    for (const key of keys) {
      const value = obj[key];
      if (typeof value === 'string' && /^https?:\/\//.test(value)) return value;
    }
  }
  return null;
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

// Реальна відповідь /core/promos/apply:
//   { promo, promo_value: "30.00000000", total_price: "150...", payment_price: "120..." }
// payment_price — сума до сплати зі знижкою; promo_value — розмір знижки;
// total_price — ПОЧАТКОВА сума на боці бекенду (його база розрахунку).
//
// ВАЖЛИВО: бекендова база (total_price) може НЕ збігатися з нашим Subtotal
// (напр. інша валюта/базова ціна). Тому ми не підставляємо абсолютні суми
// бекенду напряму — беремо лише ВІДСОТОК знижки (він не залежить від бази) і
// застосовуємо його до нашого Subtotal, щоб панель завжди була узгоджена.
function extractPromoAmounts(data: unknown): {
  baseTotal: number | null;
  newTotal: number | null;
  discount: number | null;
} {
  if (!data || typeof data !== 'object') return { baseTotal: null, newTotal: null, discount: null };
  const obj = data as Record<string, unknown>;
  // Початкова сума до знижки на боці бекенду (база для відсотка).
  const baseKeys = ['total_price', 'original_price', 'order_total', 'gross_price', 'price'];
  // Сума до сплати зі знижкою.
  const totalKeys = [
    'payment_price',
    'amount_to_pay',
    'new_total',
    'new_price',
    'total_with_promo',
    'final_price',
  ];
  const discountKeys = ['promo_value', 'discount', 'discount_amount', 'promo_discount', 'sale', 'saved'];

  const pick = (keys: string[]): number | null => {
    for (const key of keys) {
      const n = toNumber(obj[key]);
      if (n !== null) return n;
    }
    return null;
  };

  return {
    baseTotal: pick(baseKeys),
    newTotal: pick(totalKeys),
    discount: pick(discountKeys),
  };
}

// Знижка як частка [0..1] з бекендової відповіді, незалежна від валюти/бази.
// Пріоритет: (база − сума_до_сплати)/база, далі знижка/база.
function promoRateFrom(baseTotal: number | null, newTotal: number | null, discount: number | null) {
  if (!baseTotal || baseTotal <= 0) return null;
  const raw =
    newTotal !== null ? (baseTotal - newTotal) / baseTotal : discount !== null ? discount / baseTotal : null;
  if (raw === null || !Number.isFinite(raw)) return null;
  return Math.min(1, Math.max(0, raw));
}

function labelFromImage(name: string | undefined): string {
  if (!name) return 'Item';
  const base =
    name
      .split('/')
      .pop()
      ?.replace(/\.[a-z0-9]+$/i, '') ?? '';
  return base ? base.replace(/[-_]+/g, ' ') : 'Item';
}

type ProductMeta = { title: string; isCrystal: boolean };

function orderItemToRow(item: OrderItem, index: number): Row {
  const unitPrice = Number(item.price) || 0;
  // Сума по позиції — авторитетна з бекенду; фолбек на unitPrice*amount.
  const lineTotal = Number(item.sum_item_price) || unitPrice * item.amount;
  return {
    id: item.id,
    productId: item.product_id,
    title: labelFromImage(item.image_name),
    rawCurrency: item.currency ?? null,
    unitPrice,
    qty: item.amount,
    lineTotal,
    currency: item.currency ?? DEFAULT_CURRENCY,
    image: CART_IMAGES[index % CART_IMAGES.length],
    fromApi: true,
  };
}

export default function Cart() {
  const t = useTranslations('cart');
  const locale = useLocale();
  const { profile } = useProfile();
  const [rows, setRows] = useState<Row[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [productMeta, setProductMeta] = useState<Map<string, ProductMeta>>(new Map());
  const [servers, setServers] = useState<string[]>(FALLBACK_SERVERS);
  const [server, setServer] = useState<string>(FALLBACK_SERVERS[0]);
  const suggestedNickname = useMemo(() => {
    const gameUsername = profile?.game_username?.trim();
    if (gameUsername) return gameUsername;
    if (!profile) return '';

    const email =
      profile.email ??
      (typeof window !== 'undefined' ? window.localStorage.getItem('user_email') : null) ??
      '';
    return email ? email.split('@')[0] : '';
  }, [profile]);
  const [nicknameOverride, setNicknameOverride] = useState<string | null>(null);
  const nickname = nicknameOverride ?? suggestedNickname;
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  // Зберігаємо ПРИРОДУ знижки, а не готову суму, щоб перераховувати під поточний
  // Subtotal при кожній зміні кількості:
  //  - promoRate  → відсоткова знижка (частка 0..1), масштабується з кількістю;
  //  - promoFixed → фіксована сума знижки, з кількістю не змінюється.
  const [promoRate, setPromoRate] = useState<number | null>(null);
  const [promoFixed, setPromoFixed] = useState<number | null>(null);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [promoError, setPromoError] = useState(false);
  // Скільки змін кількості ще летить у бекенд — поки >0, промо застосовувати не можна,
  // інакше знижка порахується від застарілого (несинхронізованого) замовлення.
  const [qtySyncing, setQtySyncing] = useState(false);
  const qtySyncCount = useRef(0);
  // Ре-валідація промо на бекенді при зміні кількості: токен відкидає застарілі
  // відповіді, а ref памʼятає Subtotal, для якого промо вже підтверджено (щоб не
  // смикати бекенд даремно, напр. одразу після ручного застосування).
  const revalidateToken = useRef(0);
  const validatedSubtotal = useRef<number | null>(null);
  const [paying, setPaying] = useState(false);
  const [payMessage, setPayMessage] = useState<string | null>(null);
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);
  const [purchaseAgreed, setPurchaseAgreed] = useState(false);
  const [policiesAgreed, setPoliciesAgreed] = useState(false);
  const [consentToast, setConsentToast] = useState<string | null>(null);
  const [highlightConsents, setHighlightConsents] = useState(false);
  const consentsRef = useRef<HTMLDivElement>(null);
  const purchaseConsentRef = useRef<HTMLInputElement>(null);
  const policiesConsentRef = useRef<HTMLInputElement>(null);
  const consentToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flashConsentToast = useCallback(
    (message: string) => {
      setConsentToast(message);
      if (consentToastTimer.current) clearTimeout(consentToastTimer.current);
      consentToastTimer.current = setTimeout(() => setConsentToast(null), 3000);
    },
    []
  );

  const nudgeConsents = useCallback(() => {
    flashConsentToast(t('consentRequiredToast'));
    setHighlightConsents(true);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightConsents(false), 1000);
    consentsRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    const focusTarget = !purchaseAgreed ? purchaseConsentRef : policiesConsentRef;
    window.requestAnimationFrame(() => focusTarget.current?.focus());
  }, [flashConsentToast, purchaseAgreed, t]);

  useEffect(() => {
    return () => {
      if (consentToastTimer.current) clearTimeout(consentToastTimer.current);
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
    };
  }, []);

  // [ТИМЧАСОВА ДІАГНОСТИКА] Пише реальний стан сховища напряму в DOM (#pp-debug),
  // тому працює навіть якщо React «заморожений» після повернення з платіжки.
  // Реагує на mount, pageshow, focus, visibilitychange та кожну секунду.
  useEffect(() => {
    const readDebug = (source: string) => {
      let ls: string | null = 'ERR';
      let flag: string | null = 'ERR';
      try {
        ls = window.localStorage.getItem('pending_payment');
      } catch {
        ls = 'ERR';
      }
      try {
        flag = window.sessionStorage.getItem(PAYMENT_RETURN_FLAG);
      } catch {
        flag = 'ERR';
      }
      const el = document.getElementById('pp-debug');
      const persisted = el?.getAttribute('data-persisted') ?? '?';
      const text = `DBG[${source}] t=${new Date().toLocaleTimeString()} | LS=${
        ls ? 'YES(' + ls.length + ')' : String(ls)
      } | FLAG=${flag ?? 'null'} | persisted=${persisted}`;
      if (el) el.textContent = text;
    };
    readDebug('mount');
    const onPageShow = (e: PageTransitionEvent) => {
      const el = document.getElementById('pp-debug');
      if (el) el.setAttribute('data-persisted', String(e.persisted));
      readDebug('pageshow');
    };
    const onFocus = () => readDebug('focus');
    const onVis = () => readDebug('visibility:' + document.visibilityState);
    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    const timer = setInterval(() => readDebug('tick'), 1000);
    return () => {
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
      clearInterval(timer);
    };
  }, []);

  // Незавершений платіж: показуємо банер «Продовжити оплату», поки лінк живий (20 хв).
  // На чистому завантаженні (у т.ч. після reload вище) mount-ефект прочитає localStorage,
  // а інтервал оновлює лічильник хвилин і ховає банер по протуханню.
  useEffect(() => {
    const refresh = () => setPendingPayment(getPendingPayment());
    refresh();
    const timer = setInterval(refresh, 30_000);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    let active = true;
    getServers()
      .then(list => {
        if (!active || list.length === 0) return;
        const types = list.map(s => s.server_type);
        setServers(types);
        setServer(prev => (types.includes(prev) ? prev : types[0]));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Перезавантаження кошика з бекенду — щоб підтягнути авторитетні price/sum_item_price.
  const reloadCart = useCallback(async () => {
    try {
      const items = await getOrderItems();
      setRows(items.map(orderItemToRow));
      notifyCartUpdated();
    } catch {
      // мовчазний фолбек — лишаємо поточний стан
    }
  }, []);

  useEffect(() => {
    let active = true;
    getOrderItems()
      .then(items => {
        if (!active) return;
        setRows(items.map(orderItemToRow));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  // Мапа продуктів: даємо позиціям кошика реальну назву та крок (кристали — по 10).
  useEffect(() => {
    let active = true;
    getProducts({ page_size: 100, lang: locale })
      .then(data => {
        if (!active) return;
        const map = new Map<string, ProductMeta>();
        for (const p of data.results) {
          map.set(p.id, {
            title: p.title ?? '',
            isCrystal: p.category_slug === 'crystals',
          });
        }
        setProductMeta(map);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [locale]);

  // Назва та крок кількості — derived з мапи продуктів (кристали продаються по 10).
  const titleFor = (row: Row) => productMeta.get(row.productId)?.title || row.title;
  const stepFor = (row: Row) => (productMeta.get(row.productId)?.isCrystal ? 10 : 1);

  const lineCount = rows.length;

  const subtotal = useMemo(() => rows.reduce((sum, item) => sum + item.lineTotal, 0), [rows]);

  // Валюта кошика = валюта його позицій (бекенд тримає одну валюту на кошик).
  const cartCurrency = rows[0]?.currency ?? DEFAULT_CURRENCY;

  // Сума знижки — ПОХІДНА від Subtotal, тож − / + перераховують її автоматично.
  const promoDiscount = useMemo(() => {
    if (!appliedPromo) return null;
    if (promoRate !== null) return subtotal * promoRate;
    if (promoFixed !== null) return Math.min(promoFixed, subtotal);
    return 0;
  }, [appliedPromo, promoRate, promoFixed, subtotal]);

  // Сума до сплати зі знижкою (ніколи не нижче 0 і не вище Subtotal).
  const promoNewTotal = useMemo(
    () => (appliedPromo ? Math.max(0, subtotal - (promoDiscount ?? 0)) : null),
    [appliedPromo, promoDiscount, subtotal]
  );

  // Ефективний тотал до оплати: якщо промо застосовано — перерахована сума.
  const effectiveTotal = promoNewTotal ?? subtotal;

  // Скидаємо застосований промо — код більше не відповідає поточному кошику/введенню.
  const clearAppliedPromo = useCallback(() => {
    setAppliedPromo(null);
    setPromoRate(null);
    setPromoFixed(null);
    setPromoMessage(null);
    setPromoError(false);
    // Наступне застосування промо має пройти повну валідацію.
    validatedSubtotal.current = null;
    revalidateToken.current += 1;
  }, []);

  // Порожній кошик — застосований промо втрачає сенс.
  useEffect(() => {
    if (appliedPromo && lineCount === 0) clearAppliedPromo();
  }, [lineCount, appliedPromo, clearAppliedPromo]);

  // Тиха ре-валідація промо на бекенді після зміни кількості (з debounce).
  // Локальний перерахунок за відсотком дає миттєвий результат, а цей запит звіряє
  // його з правилами бекенду (мін. сума, ліміти) і за потреби коригує/скидає промо.
  useEffect(() => {
    const code = appliedPromo;
    // Чекаємо, поки кількість долетить у бекенд (qtySyncing), і не смикаємо
    // бекенд, якщо для цього Subtotal промо вже підтверджено.
    if (!code || lineCount === 0 || qtySyncing || validatedSubtotal.current === subtotal) return;

    const token = ++revalidateToken.current;
    const pendingSubtotal = subtotal;
    const timer = setTimeout(async () => {
      try {
        const data = await applyPromo({ promo: code });
        if (token !== revalidateToken.current) return; // прийшла застаріла відповідь
        const { baseTotal, newTotal, discount } = extractPromoAmounts(data);
        const rate = promoRateFrom(baseTotal, newTotal, discount);
        if (rate !== null && rate > 0) {
          setPromoRate(rate);
          setPromoFixed(null);
        } else if (discount !== null) {
          setPromoFixed(discount);
          setPromoRate(null);
        }
        // Якщо нічого не витягли — лишаємо попередній коефіцієнт (локальний перерахунок).
        validatedSubtotal.current = pendingSubtotal;
      } catch {
        if (token !== revalidateToken.current) return;
        // Бекенд відхилив промо для нового складу (напр. сума впала нижче мінімуму).
        clearAppliedPromo();
        setPromoError(true);
        setPromoMessage(t('promoInvalid'));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [subtotal, appliedPromo, lineCount, qtySyncing, clearAppliedPromo, t]);

  // dir: +1 / -1 — напрямок; крок залежить від товару (кристали — по 10).
  const changeQty = (id: string, dir: 1 | -1) => {
    let nextQty = 1;
    let productId: string | null = null;
    let fromApi = false;
    setRows(prev =>
      prev.map(row => {
        if (row.id !== id) return row;
        const step = stepFor(row);
        // Клемп у межах бекенду: [step .. MAX_QTY].
        nextQty = Math.min(MAX_QTY, Math.max(step, row.qty + dir * step));
        productId = row.productId;
        fromApi = row.fromApi;
        // Оптимістичне оновлення суми; нижче синхронізуємо з бекендом.
        return { ...row, qty: nextQty, lineTotal: row.unitPrice * nextQty };
      })
    );

    // Бекенд ідентифікує позицію кошика за product_id, а не за id рядка замовлення.
    if (fromApi && productId) {
      qtySyncCount.current += 1;
      setQtySyncing(true);
      changeItemAmount(productId, nextQty)
        .then(() => reloadCart())
        .catch(() => {})
        .finally(() => {
          qtySyncCount.current = Math.max(0, qtySyncCount.current - 1);
          if (qtySyncCount.current === 0) setQtySyncing(false);
        });
    }
  };

  const removeItem = (id: string) => {
    const target = rows.find(r => r.id === id);
    setRows(prev => prev.filter(row => row.id !== id));
    if (target?.fromApi) {
      removeFromCart(target.productId)
        .then(() => notifyCartUpdated())
        .catch(() => {});
    } else {
      notifyCartUpdated();
    }
  };

  // ТЗ: перед видачею донату гравець ОБОВ'ЯЗКОВО має бути в мережі, інакше товар "піде в молоко".
  // Повертає true, якщо ник знайдено серед онлайн-гравців; null — якщо перевірити не вдалося.
  async function isNicknameOnline(nick: string): Promise<boolean | null> {
    try {
      const res = await fetch(`/api/servers/${serverKey(server)}/online`);
      if (!res.ok) return null;
      const data = (await res.json()) as { status?: string; players?: unknown };
      if (data.status !== 'online') return false;
      const players = Array.isArray(data.players) ? (data.players as string[]) : [];
      return players.some(p => p.toLowerCase() === nick.toLowerCase());
    } catch {
      return null;
    }
  }

  async function handleApplyPromo() {
    // Нормалізуємо регістр, щоб payload збігався з тим, що показує поле (uppercase).
    const code = promoCode.trim().toUpperCase();
    if (!code || applyingPromo || lineCount === 0 || qtySyncing) return;
    setApplyingPromo(true);
    setPromoMessage(null);
    setPromoError(false);
    try {
      const data = await applyPromo({ promo: code });
      const { baseTotal, newTotal, discount } = extractPromoAmounts(data);

      // Зберігаємо ПРИРОДУ знижки (відсоток або фіксовану суму), а не готове число,
      // щоб далі перераховувати під поточний Subtotal при зміні кількості.
      const rate = promoRateFrom(baseTotal, newTotal, discount);

      if (rate !== null && rate > 0) {
        // Відсоткова знижка — не залежить від валюти/бази, масштабується з кількістю.
        setPromoRate(rate);
        setPromoFixed(null);
      } else if (discount !== null) {
        // Фіксована знижка (напр. −€5) — з кількістю не змінюється.
        setPromoFixed(discount);
        setPromoRate(null);
      } else if (newTotal !== null && subtotal > 0 && newTotal <= subtotal) {
        // Є лише сума до сплати — виводимо з неї відсоток, щоб теж масштабувалась.
        setPromoRate((subtotal - newTotal) / subtotal);
        setPromoFixed(null);
      } else {
        // Код прийнято, але знижку витягти не вдалось — 0 (панель лишиться коректною).
        setPromoRate(0);
        setPromoFixed(null);
      }

      setAppliedPromo(code);
      setPromoError(false);
      setPromoMessage(t('promoApplied', { code }));
      // Промо підтверджено саме для цього Subtotal — ре-валідація не смикатиме бекенд,
      // поки кількість не зміниться.
      validatedSubtotal.current = subtotal;
    } catch {
      setAppliedPromo(null);
      setPromoRate(null);
      setPromoFixed(null);
      setPromoError(true);
      setPromoMessage(t('promoInvalid'));
    } finally {
      setApplyingPromo(false);
    }
  }

  async function handlePay() {
    const nick = nickname.trim();
    if (!nick) {
      setPayMessage(t('errorNicknameRequired'));
      return;
    }
    setPaying(true);
    setPayMessage(null);
    try {
      // Перевірка онлайну — best-effort нагадування, НЕ блокер: доставка відбувається
      // після оплати, тож не зриваємо створення платежу, якщо гравця ще немає в мережі.
      const online = await isNicknameOnline(nick);

      const data = await createPayment({
        user_nickname: nick,
        server,
        // Той самий підтверджений промокод — бекенд застосує знижку під капотом.
        promo: appliedPromo ?? undefined,
      });
      const url = extractPaymentUrl(data);
      if (url) {
        // Зберігаємо лінк, щоб при поверненні (вихід/назад) запропонувати дооплату,
        // і ставимо прапорець, щоб при поверненні зробити чистий reload.
        savePendingPayment({ url, amount: effectiveTotal, currency: cartCurrency });
        markPaymentRedirect();
        window.location.href = url;
        return;
      }
      setPayMessage(
        online === false ? t('paymentCreatedOffline', { server, nick }) : t('paymentCreatedOnline')
      );
    } catch {
      setPayMessage(t('errorPaymentFailed'));
    } finally {
      setPaying(false);
    }
  }

  function attemptPay() {
    if (!purchaseAgreed || !policiesAgreed) {
      nudgeConsents();
      return;
    }
    void handlePay();
  }

  const pendingMinutes = pendingPayment
    ? Math.max(1, Math.ceil(pendingPaymentRemainingMs(pendingPayment) / 60_000))
    : 0;

  function resumePendingPayment() {
    if (pendingPayment) window.location.href = pendingPayment.url;
  }

  function dismissPendingPayment() {
    clearPendingPayment();
    setPendingPayment(null);
  }

  const summaryBlock = (
    <section className={styles.summary} aria-labelledby="summary-heading">
      <h2 id="summary-heading" className={styles.summaryTitle}>
        {t('summaryTitle')}
      </h2>
      <div className={styles.summaryRow}>
        <span>{t('subtotal', { count: lineCount })}</span>
        <span className={styles.summaryValue}>{formatMoney(subtotal, cartCurrency)}</span>
      </div>
      <div className={styles.summaryRow}>
        <span>{appliedPromo ? t('promoLabelApplied', { code: appliedPromo }) : t('promoLabel')}</span>
        <span className={styles.summaryValue}>
          {promoDiscount && promoDiscount > 0
            ? `−${formatMoney(promoDiscount, cartCurrency)}`
            : '–'}
        </span>
      </div>
      <div className={styles.summaryRow}>
        <span>{t('serviceFee')}</span>
        <span className={styles.summaryValue}>{formatMoney(0, cartCurrency)}</span>
      </div>
      <div className={styles.summaryDivider} aria-hidden />
      <div className={styles.summaryTotal}>
        <span>{t('total')}</span>
        <span className={styles.summaryTotalValue}>
          {formatMoney(effectiveTotal, cartCurrency)}
        </span>
      </div>
      <button
        type="button"
        className={styles.payBtn}
        onClick={attemptPay}
        disabled={paying || lineCount === 0}
      >
        <span>{paying ? t('payBtnProcessing') : t('payBtn')}</span>
        <span aria-hidden>→</span>
      </button>
      <div
        ref={consentsRef}
        className={`${styles.consentGroup} ${highlightConsents ? styles.consentGroupHighlight : ''}`}
      >
        <label className={styles.consent}>
          <input
            ref={purchaseConsentRef}
            type="checkbox"
            className={styles.consentInput}
            checked={purchaseAgreed}
            onChange={event => setPurchaseAgreed(event.target.checked)}
          />
          <span className={styles.consentBox} aria-hidden="true" />
          <span className={styles.consentText}>{t('consentText')}</span>
        </label>
        <label className={styles.consent}>
          <input
            ref={policiesConsentRef}
            type="checkbox"
            className={styles.consentInput}
            checked={policiesAgreed}
            onChange={event => setPoliciesAgreed(event.target.checked)}
          />
          <span className={styles.consentBox} aria-hidden="true" />
          <span className={styles.consentText}>
            {t.rich('policiesConsentText', {
              privacy: chunks => (
                <Link href="/privacy-policy" className={styles.consentLink}>
                  {chunks}
                </Link>
              ),
              terms: chunks => (
                <Link href="/terms" className={styles.consentLink}>
                  {chunks}
                </Link>
              ),
              delivery: chunks => (
                <Link href="/delivery-policy" className={styles.consentLink}>
                  {chunks}
                </Link>
              ),
              billing: chunks => (
                <Link href="/billing-refunds" className={styles.consentLink}>
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
      </div>
      {payMessage && <p className={styles.secureNote}>{payMessage}</p>}
    </section>
  );

  return (
    <div className={styles.shell}>
      <div className={styles.root}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>{t('eyebrow')}</span>
          <h1 className={styles.title}>{t('title', { count: lineCount })}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </header>

        {/* [ТИМЧАСОВА ДІАГНОСТИКА] прибрати після зʼясування причини */}
        <div
          id="pp-debug"
          data-persisted="?"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 99999,
            background: '#111',
            color: '#0f0',
            font: '12px/1.4 monospace',
            padding: '6px 10px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
        >
          DBG[init]
        </div>

        {pendingPayment && (
          <div className={styles.resumeBanner} role="status">
            <span className={styles.resumeIcon} aria-hidden>
              ⏳
            </span>
            <div className={styles.resumeCopy}>
              <p className={styles.resumeTitle}>{t('resumeTitle')}</p>
              <p className={styles.resumeText}>{t('resumeText', { minutes: pendingMinutes })}</p>
            </div>
            <div className={styles.resumeActions}>
              <button
                type="button"
                className={styles.resumeContinue}
                onClick={resumePendingPayment}
              >
                {t('resumeContinue')}
              </button>
              <button
                type="button"
                className={styles.resumeDismiss}
                onClick={dismissPendingPayment}
              >
                {t('resumeDismiss')}
              </button>
            </div>
          </div>
        )}

        <div className={styles.body}>
          <div className={styles.mainPrimary}>
            <section className={styles.panel} aria-labelledby="cart-items-heading">
              <h2 id="cart-items-heading" className={styles.panelLabel}>
                <span className={styles.panelLabelMobile}>{t('itemsLabelMobile')}</span>
                <span className={styles.panelLabelDesktop}>{t('itemsLabelDesktop')}</span>
              </h2>
              {!loaded ? (
                <p className={styles.cartState}>{t('loading')}</p>
              ) : rows.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyTitle}>{t('emptyTitle')}</p>
                  <p className={styles.emptyText}>{t('emptyText')}</p>
                  <Link href="/dashboard/shop" className={styles.emptyCta}>
                    {t('emptyCta')}
                  </Link>
                </div>
              ) : (
                <ul className={styles.itemList}>
                  {rows.map(item => {
                    const lineTotal = item.lineTotal;
                    const title = titleFor(item);

                    return (
                      <li key={item.id} className={styles.itemRow}>
                        <div className={styles.itemThumb}>
                          <Image
                            src={item.image}
                            alt=""
                            width={64}
                            height={64}
                            className={styles.itemImg}
                            aria-hidden
                          />
                        </div>
                        <div className={styles.itemMeta}>
                          <p className={styles.itemTitle}>{title}</p>
                          <p className={styles.itemSubtitleMobile}>
                            {item.rawCurrency ?? t('itemSubtitleDefault')}
                          </p>
                          <p className={styles.itemSubtitleDesktop}>
                            {t('itemSubtitleDesktop', {
                              currency: item.rawCurrency ?? t('itemSubtitleDefault'),
                            })}
                          </p>
                        </div>
                        <div className={styles.qty}>
                          <button
                            type="button"
                            className={styles.qtyBtn}
                            onClick={() => changeQty(item.id, -1)}
                            aria-label={t('decreaseQty', { title })}
                          >
                            −
                          </button>
                          <span className={styles.qtyValue}>{item.qty}</span>
                          <button
                            type="button"
                            className={`${styles.qtyBtn} ${styles.qtyBtnPlus}`}
                            onClick={() => changeQty(item.id, 1)}
                            aria-label={t('increaseQty', { title })}
                          >
                            +
                          </button>
                        </div>
                        <p className={styles.itemPrice}>{formatMoney(lineTotal, item.currency)}</p>
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeItem(item.id)}
                          aria-label={t('removeItem', { title })}
                        >
                          ×
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section
              className={`${styles.panel} ${styles.panelDelivery}`}
              aria-labelledby="delivery-heading"
            >
              <div className={styles.panelHead}>
                <h2 id="delivery-heading" className={styles.panelTitle}>
                  {t('deliveryTitle')}
                </h2>
                <span className={styles.requiredBadge}>{t('requiredBadge')}</span>
              </div>
              <div className={styles.field}>
                <p className={styles.fieldLabel}>{t('selectServerLabel')}</p>
                <div
                  className={styles.serverRow}
                  role="radiogroup"
                  aria-label={t('selectServerLabel')}
                >
                  {servers.map(option => (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={server === option}
                      className={`${styles.serverOption} ${server === option ? styles.serverOptionActive : ''}`}
                      onClick={() => setServer(option)}
                    >
                      <span className={styles.serverRadio} aria-hidden>
                        {server === option && <span className={styles.serverRadioDot} />}
                      </span>
                      <span>{option}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="cart-nickname">
                  <span className={styles.nicknameLabelMobile}>{t('nicknameMobile')}</span>
                  <span className={styles.nicknameLabelDesktop}>{t('nicknameDesktop')}</span>
                </label>
                <input
                  id="cart-nickname"
                  className={styles.input}
                  value={nickname}
                  onChange={e => setNicknameOverride(e.target.value)}
                  autoComplete="username"
                />
              </div>
              <p className={styles.deliveryNote}>{t('deliveryNote')}</p>
            </section>
          </div>

          <div className={styles.sidebarColumn}>
            {summaryBlock}
            <p className={styles.pciNote}>{t('pciNote')}</p>

            <aside className={styles.importantNotice} aria-label={t('importantNoticeAriaLabel')}>
              <div className={styles.importantHead}>
                <span className={styles.importantIcon} aria-hidden="true">
                  ⚠
                </span>
                <p className={styles.importantTitle}>{t('importantTitle')}</p>
              </div>
              <p className={styles.importantText}>
                {t.rich('importantText1', {
                  highlight: chunks => <span className={styles.importantHighlight}>{chunks}</span>,
                })}
              </p>
              <p className={styles.importantText}>{t('importantText2')}</p>
            </aside>
          </div>

          <section className={styles.promoPanel} aria-labelledby="promo-heading">
            <span className={styles.promoIcon} aria-hidden>
              🎟
            </span>
            <div className={styles.promoCopy}>
              <h2 id="promo-heading" className={styles.promoTitle}>
                <span className={styles.promoTitleMobile}>{t('promoTitleMobile')}</span>
                <span className={styles.promoTitleDesktop}>{t('promoTitleDesktop')}</span>
              </h2>
              <p className={styles.promoHint}>{t('promoHint')}</p>
            </div>
            <div className={styles.promoRow}>
              <input
                className={styles.promoInput}
                placeholder={t('promoPlaceholder')}
                value={promoCode}
                onChange={e => {
                  // Одразу приводимо до верхнього регістру: реальне значення = те, що видно,
                  // тож "welcome20" стає "WELCOME20" і застосується коректно.
                  setPromoCode(e.target.value.toUpperCase());
                  if (appliedPromo || promoMessage) clearAppliedPromo();
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyPromo();
                  }
                }}
                disabled={applyingPromo || lineCount === 0 || qtySyncing}
              />
              <button
                type="button"
                className={styles.promoApply}
                onClick={handleApplyPromo}
                disabled={
                  applyingPromo || lineCount === 0 || promoCode.trim().length === 0 || qtySyncing
                }
              >
                {applyingPromo ? t('promoApplying') : t('promoApply')}
              </button>
            </div>
            {promoMessage && (
              <p
                className={`${styles.promoMessage} ${promoError ? styles.promoMessageError : styles.promoMessageOk}`}
                role="status"
              >
                {promoMessage}
              </p>
            )}
          </section>
        </div>
      </div>
      {consentToast && (
        <div className={styles.toast} role="status" aria-live="polite">
          {consentToast}
        </div>
      )}
    </div>
  );
}
