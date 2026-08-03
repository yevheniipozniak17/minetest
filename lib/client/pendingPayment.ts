'use client';

// Незавершений платіж: зберігаємо посилання провайдера, щоб при поверненні в кошик
// запропонувати «Продовжити оплату». Термін життя — 20 хв (узгоджено з бекендом:
// посилання на платіж живе ~20 хвилин, після чого стає недійсним).
const KEY = 'pending_payment';
export const PENDING_PAYMENT_TTL_MS = 20 * 60 * 1000;

// Прапорець «щойно пішли на оплату»: ставимо перед редіректом, аби при поверненні
// зробити один повний reload (обхід bfcache-фризу Next.js App Router).
export const PAYMENT_RETURN_FLAG = 'payment_return_reload';

export function markPaymentRedirect(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(PAYMENT_RETURN_FLAG, '1');
  } catch {
    // ignore
  }
}

export function clearPaymentReturnFlag(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(PAYMENT_RETURN_FLAG);
  } catch {
    // ignore
  }
}

export interface PendingPayment {
  url: string;
  createdAt: number;
  amount?: number;
  currency?: string;
  nickname?: string;
  server?: string;
}

export function savePendingPayment(payment: Omit<PendingPayment, 'createdAt'>): void {
  if (typeof window === 'undefined') return;
  try {
    const record: PendingPayment = { ...payment, createdAt: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(record));
  } catch {
    // localStorage недоступний (приватний режим тощо) — тихо ігноруємо.
  }
}

// Повертає незавершений платіж, якщо він ще дійсний; протухлий — прибирає й віддає null.
export function getPendingPayment(): PendingPayment | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const record = JSON.parse(raw) as Partial<PendingPayment>;
    if (
      !record ||
      typeof record.url !== 'string' ||
      typeof record.createdAt !== 'number' ||
      !/^https?:\/\//.test(record.url)
    ) {
      clearPendingPayment();
      return null;
    }
    if (Date.now() - record.createdAt > PENDING_PAYMENT_TTL_MS) {
      clearPendingPayment();
      return null;
    }
    return record as PendingPayment;
  } catch {
    clearPendingPayment();
    return null;
  }
}

export function clearPendingPayment(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

// Скільки мілісекунд лишилось до протухання (0 якщо вже недійсний).
export function pendingPaymentRemainingMs(payment: PendingPayment): number {
  return Math.max(0, PENDING_PAYMENT_TTL_MS - (Date.now() - payment.createdAt));
}
